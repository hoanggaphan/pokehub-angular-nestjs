import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthenticatedUser } from './types';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { RefreshTokenGuard } from './refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @Request()
    req: {
      user: AuthenticatedUser;
    },
  ) {
    return this.authService.login(req.user);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refreshToken')
  refresh(
    @Request()
    req: {
      user: AuthenticatedUser;
    },
  ) {
    return this.authService.refresh(req.user);
  }
}
