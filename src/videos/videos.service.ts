import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { VideoDto } from './dto/video.dto';
import { createReadStream } from 'fs';
import { join } from 'path';

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

  async getVideoStreamById(id: number) {
    const videoMetadata = await this.getVideoMetadata(id);
    const stream = createReadStream(join(process.cwd(), videoMetadata.path));

    return new StreamableFile(stream, {
      disposition: `inline; filename=${videoMetadata.filename}`,
      type: videoMetadata.mimetype,
    });
  }
}
