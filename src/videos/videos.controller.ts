import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploadedFiles/videos',
      }),
    }),
  )
  async addVideo(@UploadedFile() file: Express.Multer.File) {
    return this.videosService.create({
      filename: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
    });
  }
}
