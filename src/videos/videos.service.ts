import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { VideoDto } from './dto/video.dto';

@Injectable()
export class VideosService {
  constructor(private readonly prismaService: PrismaService) {}

  create({ filename, mimetype, path }: VideoDto) {
    return this.prismaService.video.create({
      data: {
        filename,
        mimetype,
        path,
      },
    });
  }

  async getVideoMetadata(id: number) {
    const videoMetadata = await this.prismaService.video.findUnique({
      where: {
        id,
      },
    });

    if (!videoMetadata) throw new NotFoundException();

    return videoMetadata;
  }
}
