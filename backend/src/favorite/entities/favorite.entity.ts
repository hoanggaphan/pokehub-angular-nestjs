import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.favorites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Pokemon, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pokemon_id' })
  pokemon: Pokemon;
}
