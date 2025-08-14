import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from 'src/auth/access-token.guard';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('name') name?: string,
    @Query('type') type?: string,
    @Query('generation') generation?: string,
    @Query('legendary') legendary?: string,
  ) {
    return this.pokemonService.findAllPaginated({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      name: name ?? undefined,
      type: type ?? undefined,
      generation: generation ? Number(generation) : undefined,
      legendary:
        typeof legendary === 'string'
          ? legendary.toLowerCase() === 'true'
          : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pokemonService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update(+id, updatePokemonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pokemonService.remove(+id);
  }

  @UseGuards(AccessTokenGuard)
  @Post('import-csv')
  @UseInterceptors(FileInterceptor('file'))
  importCsv(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.pokemonService.importFromCsv(file);
  }
}
