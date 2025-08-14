import { Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { AuthenticatedUser } from 'src/auth/types';
import { AccessTokenGuard } from 'src/auth/access-token.guard';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @UseGuards(AccessTokenGuard)
  @Post(':pokemonId')
  toggleFavorite(
    @Param('pokemonId') id: number,
    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.favoriteService.toggle(req.user.id, id);
  }
}
