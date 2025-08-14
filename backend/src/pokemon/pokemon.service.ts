/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Pokemon } from './entities/pokemon.entity';
import fs from 'fs';
import { Readable } from 'stream';
import * as csv from 'fast-csv';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private pokemonRepository: Repository<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    const exist = await this.pokemonRepository.findOneBy({
      name: createPokemonDto.name,
    });
    if (exist) throw new BadRequestException('name already exist');

    return this.pokemonRepository.save(createPokemonDto).then(() => ({
      statusCode: HttpStatus.CREATED,
      message: 'Create pokemon success',
    }));
  }

  async findAllPaginated(params: {
    page: number;
    limit: number;
    name?: string;
    type?: string;
    generation?: number;
    legendary?: boolean;
  }) {
    const { page, limit, name, type, generation, legendary } = params;

    if (page < 1 || limit < 1) {
      throw new BadRequestException('page and limit must be positive integers');
    }

    const where: FindOptionsWhere<Pokemon> = {};

    if (name) {
      where.name = ILike(`%${name}%`);
    }

    const whereClauses: FindOptionsWhere<Pokemon>[] = [];
    if (type) {
      whereClauses.push({ ...where, type1: ILike(type) });
      whereClauses.push({ ...where, type2: ILike(type) });
    } else {
      whereClauses.push(where);
    }

    if (generation !== undefined) {
      whereClauses.forEach((w) => (w.generation = generation));
    }

    if (legendary !== undefined) {
      whereClauses.forEach((w) => (w.legendary = legendary));
    }

    const [items, total] = await this.pokemonRepository.findAndCount({
      where: whereClauses,
      take: limit,
      skip: (page - 1) * limit,
      order: { id: 'ASC' },
    });

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        pageCount: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const exist = await this.pokemonRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Pokemon not found.');
    }

    return exist;
  }

  async update(id: number, updatePokemonDto: UpdatePokemonDto) {
    const exist = await this.pokemonRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Pokemon not found.');
    }

    await this.pokemonRepository.update(id, updatePokemonDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Update pokemon success',
    };
  }

  async remove(id: number) {
    const exist = await this.pokemonRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Pokemon not found.');
    }

    return this.pokemonRepository.delete(id).then(() => ({
      statusCode: HttpStatus.OK,
      message: 'Delete success',
    }));
  }

  importFromCsv(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('no file uploaded');
    }

    // validate file type
    const allowedMimeTypes = [
      'text/csv',
      'application/csv',
      'application/x-csv',
      'text/comma-separated-values',
      'application/vnd.ms-excel',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('invalid file type');
    }

    // Validate file size (max 20MB)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File is too large!');
    }

    const BATCH_SIZE = 1000; // số bản ghi insert mỗi batch
    let batch: Pokemon[] = [];
    let totalInserted = 0;

    return new Promise((resolve, reject) => {
      const parseStream = csv.parse({ headers: true, ignoreEmpty: true });

      parseStream
        .on('error', (error) => reject(error))
        .on('data', (row) => {
          const p = new Pokemon();
          p.name = row.name;
          p.type1 = row.type1;
          p.type2 = row.type2 || null;
          p.total = Number(row.total);
          p.hp = Number(row.hp);
          p.attack = Number(row.attack);
          p.defense = Number(row.defense);
          p.spAttack = Number(row.spAttack);
          p.spDefense = Number(row.spDefense);
          p.speed = Number(row.speed);
          p.generation = Number(row.generation);
          p.legendary = row.legendary?.toLowerCase() === 'true';
          p.ytbUrl = row.ytbUrl || null;
          p.image = row.image || '';

          batch.push(p);

          // Nếu đủ batch thì insert ngay
          if (batch.length >= BATCH_SIZE) {
            parseStream.pause();
            this.pokemonRepository.manager
              .transaction(async (manager) => {
                await manager.insert(Pokemon, batch);
              })
              .then(() => {
                totalInserted += batch.length;
                batch = [];
                parseStream.resume();
              })
              .catch((err) => {
                console.error(`Batch insert failed: ${err.message}`);
                reject(new BadRequestException(err.message));
              });
          }
        })
        .on('end', async () => {
          try {
            // Insert phần còn lại
            if (batch.length > 0) {
              await this.pokemonRepository.manager.transaction(
                async (manager) => {
                  await manager.insert(Pokemon, batch);
                },
              );
              totalInserted += batch.length;
            }

            // Xóa file sau khi import
            if (file.path) {
              fs.unlinkSync(file.path);
            }

            resolve({
              statusCode: HttpStatus.OK,
              message: `Imported ${totalInserted} Pokémon successfully`,
            });
          } catch (err) {
            console.error(`Final batch insert failed: ${err.message}`);
            reject(new BadRequestException((err as Error).message));
          }
        });

      if (file.path) {
        fs.createReadStream(file.path).pipe(parseStream);
      } else if ((file as any).buffer) {
        const buffer: Buffer = (file as any).buffer as Buffer;
        Readable.from(buffer).pipe(parseStream);
      } else {
        reject(new BadRequestException('uploaded file has no path or buffer'));
      }
    });
  }
}
