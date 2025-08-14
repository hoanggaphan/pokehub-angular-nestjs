import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { AuthenticatedUser } from 'src/auth/types';
import { AccessTokenGuard } from 'src/auth/access-token.guard';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @UseGuards(AccessTokenGuard)
  @Post(':pokemonId')
  toggleFavorite(
    @Param('pokemonId') pokemonId: string,
    @Request() req: { user: AuthenticatedUser },
  ) {
    return this.favoriteService.toggle(req.user.id, Number(pokemonId));
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  getMyFavorites(@Request() req: { user: AuthenticatedUser }) {
    return this.favoriteService.getFavoritesByUser(req.user.id);
  }
}
