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
    const allowedMimeTypes = ['text/csv'];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('invalid file type');
    }

    // validate file size (e.g., max 5mb)
    const maxSize = 5 * 1024 * 1024;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (file.size > maxSize) {
      throw new BadRequestException('file is too large!');
    }

    return {
      statusCode: HttpStatus.OK,
    };
  }
}
