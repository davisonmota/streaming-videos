import {
  BadRequestException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { VideoDto } from './dto/video.dto';
import { createReadStream } from 'fs';
import { join } from 'path';
import * as rangeParser from 'range-parser';
import { stat } from 'fs/promises';

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

  parseRange(range: string, fileSize: number) {
    const parseResult = rangeParser(fileSize, range);
    if (parseResult === -1 || parseResult === -2 || parseResult.length !== 1) {
      throw new BadRequestException();
    }
    return parseResult[0];
  }

  async getFileSize(path: string) {
    const status = await stat(path);
    return status.size;
  }

  getContentRange(rangeStart: number, rangeEnd: number, fileSize: number) {
    return `bytes ${rangeStart}-${rangeEnd}/${fileSize}`;
  }

  async getPartialVideoStream(id: number, range: string) {
    const videoMetadata = await this.getVideoMetadata(id);
    const videoPath = join(process.cwd(), videoMetadata.path);
    const fileSize = await this.getFileSize(videoPath);

    const { start, end } = this.parseRange(range, fileSize);

    const stream = createReadStream(videoPath, { start, end });

    const streamableFile = new StreamableFile(stream, {
      disposition: `inline; filename=${videoMetadata.filename}`,
      type: videoMetadata.mimetype,
      length: fileSize,
    });

    const contentRange = this.getContentRange(start, end, fileSize);

    return {
      streamableFile,
      contentRange,
    };
  }
}
