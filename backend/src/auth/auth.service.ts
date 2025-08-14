import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { compare as bcryptCompare } from 'bcrypt';
import { AuthenticatedUser, JwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.findByName(username);
    const isMatch: boolean = await (
      bcryptCompare as unknown as (
        data: string,
        encrypted: string,
      ) => Promise<boolean>
    )(pass, (user as unknown as { password: string }).password);
    if (!isMatch) return null;

    Reflect.deleteProperty(user, 'password');
    return user;
  }

  login(user: AuthenticatedUser) {
    const payload: JwtPayload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
    };
    return {
      ...user,
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        // expiresIn: '1 day',
        expiresIn: '1d',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        // expiresIn: '7 day',
        expiresIn: '7d',
      }),
    };
  }

  refresh(user: AuthenticatedUser) {
    const payload: JwtPayload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
    };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        // expiresIn: '1 day',
        expiresIn: '1d',
      }),
    };
  }
}
