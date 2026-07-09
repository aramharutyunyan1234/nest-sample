import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Files } from './files.entity';
import { UploadFilesController } from './upload-files.controller';
import { FilesService } from './files.service';

@Module({
  controllers: [UploadFilesController],
  providers: [FilesService],
  imports: [TypeOrmModule.forFeature([Files]), AuthModule],
  exports: [FilesService],
})
export class FilesModule {}
