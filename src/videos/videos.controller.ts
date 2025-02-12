import { Controller, UploadedFile } from '@nestjs/common';
import { VideosService } from './videos.service';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  async addVideo(@UploadedFile() file: Express.Multer.File) {}
}
