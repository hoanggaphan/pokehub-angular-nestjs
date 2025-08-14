/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreatePokemonDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @Length(1, 50)
  type1: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  type2?: string;

  @IsInt()
  @Min(0)
  total: number;

  @IsInt()
  @Min(0)
  hp: number;

  @IsInt()
  @Min(0)
  attack: number;

  @IsInt()
  @Min(0)
  defense: number;

  @IsInt()
  @Min(0)
  spAttack: number;

  @IsInt()
  @Min(0)
  spDefense: number;

  @IsInt()
  @Min(0)
  speed: number;

  @IsInt()
  @Min(1)
  generation: number;

  @IsBoolean()
  legendary: boolean;

  @IsOptional()
  @IsString()
  ytbUrl?: string;
}
