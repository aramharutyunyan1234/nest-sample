import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from '../auth/interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async getUserWithAuth(userName: string): Promise<User | null> {
    const users = await this.dataSource.query(
      `SELECT * FROM "user" WHERE username = $1`,
      [userName],
    );
    return users[0];
  }

  async create(dto: CreateUserDto): Promise<CreateUserDto | null> {
    console.log(dto);
    const users = await this.dataSource.query(
      `INSERT INTO "user" (name, email, password, username)
       VALUES ($1, $2, $3, $4) RETURNING *;`,
      [dto.name, dto.email, dto.password, dto.userName],
    );
    return users && users.length > 0 ? users[0] : null;
  }
}
