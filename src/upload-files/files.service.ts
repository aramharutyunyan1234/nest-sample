import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Files } from './files.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(Files)
    private readonly filesRepository: Repository<Files>,
    private readonly dataSource: DataSource,
  ) {}
  async saveFiles(
    orderId: number,
    userId: number,
    files: string[],
  ) {
    const values: any[] = [];
    const valueRows: string[] = [];

    // Build parameterized placeholders dynamically
    files.forEach((file, index) => {
      const offset = index * 3;
      valueRows.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, NOW())`);
      values.push(orderId, userId, file);
    });
    console.log(valueRows);

    const query = `INSERT INTO files ("orderId", "userId", "fileAddress", "created_at")
    VALUES ${valueRows.join(', ')}
    RETURNING *;
  `;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.dataSource.query(query, values);
  }
}
