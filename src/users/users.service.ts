import { Injectable } from '@nestjs/common';
import { Users } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from '../auth/interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private readonly dataSource: DataSource,
  ) {}
  async findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  async getUserWithAuth(userName: string): Promise<Users | null> {
    const users: Array<any> = await this.dataSource.query(
      `SELECT * FROM "users" WHERE username = $1`,
      [userName],
    );
    return users[0];
  }

  async create(dto: CreateUserDto): Promise<CreateUserDto | null> {
    console.log(dto);
    const users = await this.dataSource.query(
      `INSERT INTO "users" (name, email, password, username, roles)
       VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [dto.name, dto.email, dto.password, dto.userName, dto.role],
    );
    return users && users.length > 0 ? users[0] : null;
  }
}
