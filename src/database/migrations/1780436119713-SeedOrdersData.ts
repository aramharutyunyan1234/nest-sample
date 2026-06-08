import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedOrdersData1780436119713 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Insert into orders_status table using its string name
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('orderStatus') // <-- Pass the exact DB table name as a string
      .values([
        { id: 1, name: 'created' },
        { id: 2, name: 'first modified' },
        { id: 3, name: 'worker checked' },
        { id: 4, name: 'worker started' },
        { id: 5, name: 'worker finished' },
        { id: 6, name: 'accept an order' },
        { id: 7, name: 'paid order' },
      ])
      .execute();

    // 2. Insert into orders_type table using its string name
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('ordersType') // <-- Pass the exact DB table name as a string
      .values([
        { id: 1, name: 'programmer' },
        { id: 2, name: 'santexnik' },
        { id: 3, name: 'kafelchik' },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Clean up orders_status table
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('orders_status') // <-- Pass the exact DB table name as a string
      .where('id IN (:...ids)', { ids: [1, 2, 3, 4, 5, 6, 7] })
      .execute();

    // Clean up orders_type table
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('orders_type') // <-- Pass the exact DB table name as a string
      .where('id IN (:...ids)', { ids: [1, 2, 3] })
      .execute();
  }
}
