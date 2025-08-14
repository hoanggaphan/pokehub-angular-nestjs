import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepo: Repository<Favorite>,
  ) {}

  async toggle(userId: number, pokemonId: number) {
    const existing = await this.favoriteRepo.findOne({
      where: { user: { id: userId }, pokemon: { id: pokemonId } },
      relations: ['user', 'pokemon'],
    });

    if (existing) {
      await this.favoriteRepo.remove(existing);
      return { message: 'Unmarked as favorite' };
    }

    const fav = this.favoriteRepo.create({
      user: { id: userId },
      pokemon: { id: pokemonId },
    });
    await this.favoriteRepo.save(fav);
    return { message: 'Marked as favorite' };
  }

  async getFavoritesByUser(userId: number) {
    const favorites = await this.favoriteRepo.find({
      where: { user: { id: userId } },
      relations: ['pokemon'],
      order: { id: 'DESC' },
    });
    return favorites.map((f) => f.pokemon);
  }
}
