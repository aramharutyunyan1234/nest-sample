import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../configs/configuration';
import { AuthModule } from './auth/auth.module';
import { CatsController } from './cats/cats.controller';

@Module({
  controllers: [AppController, CatsController],
  providers: [AppService],
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true, // Makes ConfigModule available everywhere without re-importing
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // Use dot notation to match the structure inside your config.yaml
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        autoLoadEntities: true,
        synchronize: true, // Quick note: usually keep this false in production!
      }),
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
