import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { compare as bcryptCompare, hash as bcryptHash } from 'bcrypt';
import { UpdatePasswordDto } from './dto/update-password.dto';

const saltOrRounds = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const exist = await this.usersRepository.findOneBy({
      username: createUserDto.username,
    });
    if (exist) throw new BadRequestException('username already exist');

    createUserDto.password = await (
      bcryptHash as unknown as (
        pwd: string,
        salt: string | number,
      ) => Promise<string>
    )(createUserDto.password, saltOrRounds);

    return this.usersRepository.save(createUserDto).then(() => ({
      statusCode: HttpStatus.CREATED,
      message: 'Register success',
    }));
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number): Promise<User> {
    const exist = await this.usersRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('User not found.');
    }

    return exist;
  }

  async findByName(username: string): Promise<User> {
    const exist = await this.usersRepository.findOneBy({ username });
    if (!exist) {
      throw new NotFoundException('User not found.');
    }

    return exist;
  }

  update(id: number, _updateUserDto: UpdateUserDto) {
    void _updateUserDto;
    return `This action updates a #${id} user`;
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    const user = await this.usersRepository.findOne({
      where: { id: updatePasswordDto.userId },
      select: ['id', 'password'],
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const isMatch: boolean = await (
      bcryptCompare as unknown as (
        data: string,
        encrypted: string,
      ) => Promise<boolean>
    )(updatePasswordDto.oldPass, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password not exactly');
    }

    if (updatePasswordDto.newPass !== updatePasswordDto.confirmPass) {
      throw new BadRequestException('Confirm password not equal new password');
    }

    const hashedPassword: string = await (
      bcryptHash as unknown as (
        pwd: string,
        salt: string | number,
      ) => Promise<string>
    )(updatePasswordDto.newPass, saltOrRounds);

    return this.usersRepository
      .update(updatePasswordDto.userId, { password: hashedPassword })
      .then(() => ({
        statusCode: HttpStatus.OK,
        message: 'Update password success',
      }));
  }

  async remove(id: number) {
    const exist = await this.usersRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('User not found.');
    }

    return this.usersRepository.delete(id).then(() => ({
      statusCode: HttpStatus.OK,
      message: 'Delete success',
    }));
  }
}
