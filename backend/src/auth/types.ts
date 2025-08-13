import { Role } from 'src/enums/role.enum';

export interface JwtPayload {
  sub: number;
  username: string;
  roles: Role[];
}

export interface AuthenticatedUser {
  id: number;
  username: string;
  roles: Role[];
}
