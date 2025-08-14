import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  findAll() {
    return this.pokemonRepository.find();
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
}
