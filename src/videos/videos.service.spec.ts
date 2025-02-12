/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { VideosService } from './videos.service';
import { PrismaService } from 'src/database/prisma.service';
import { VideoDto } from './dto/video.dto';

const prismaServiceMock = {
  video: {
    create: jest.fn(),
  },
};

describe('VideosService', () => {
  let service: VideosService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideosService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<VideosService>(VideosService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should call prismaService.video.create with correct data', async () => {
    const videoDto: VideoDto = {
      filename: 'test-video.mp4',
      mimetype: 'video/mp4',
      path: '/home/video/test-video.mp4',
    };

    const mockResponse = {
      id: 1,
      ...videoDto,
    };

    prismaServiceMock.video.create.mockResolvedValue(mockResponse);

    const result = await service.create(videoDto);

    expect(prismaService.video.create).toHaveBeenCalledWith({
      data: videoDto,
    });

    expect(result).toEqual(mockResponse);
  });
});
