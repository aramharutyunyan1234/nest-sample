import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  UseGuards,
  Body,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '../common/guard/auth.guard';
import { FilesService } from './files.service';

@Controller('upload')
@UseGuards(AuthGuard)
export class UploadFilesController {
  constructor(private fileServices: FilesService) {
  }
  @Post('images')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './assets/uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(new BadRequestException('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  uploadImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('orderId', new DefaultValuePipe(0), ParseIntPipe) orderId: number,
    @Body('userId', new DefaultValuePipe(0), ParseIntPipe) userId: number,
  ) {
    this.fileServices.saveFiles(
      orderId,
      userId,
      files.map((f) => f.filename),
    );

    return {
      message: 'Images successfully uploaded!',
      count: files.length,
      files: files.map((f) => f.filename),
    };
  }
}
