// src/pokemon/entities/pokemon.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Pokemon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  type1: string;

  @Column({ nullable: true })
  type2: string;

  @Column()
  total: number;

  @Column()
  hp: number;

  @Column()
  attack: number;

  @Column()
  defense: number;

  @Column({ name: 'sp_attack' })
  spAttack: number;

  @Column({ name: 'sp_defense' })
  spDefense: number;

  @Column()
  speed: number;

  @Column()
  generation: number;

  @Column()
  legendary: boolean;

  @Column({ name: 'ytb_url', nullable: true })
  ytbUrl: string;
}
