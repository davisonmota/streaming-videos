import {
  Controller,
  Get,
  Header,
  Headers,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FindOnParams } from './dto/find-on-params.dto';
import { Response } from 'express';

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

  @Get(':id')
  @Header('Accept-Ranges', 'bytes')
  async streamVideo(
    @Param() { id }: FindOnParams,
    @Headers('range') range: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!range) {
      return this.videosService.getVideoStreamById(+id);
    }
    const { streamableFile, contentRange } =
      await this.videosService.getPartialVideoStream(+id, range);

    response.status(206);
    response.set({
      'Content-Range': contentRange,
    });

    return streamableFile;
  }
}
