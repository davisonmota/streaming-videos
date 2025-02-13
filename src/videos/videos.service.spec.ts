/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { VideosService } from './videos.service';
import { PrismaService } from 'src/database/prisma.service';
import { VideoDto } from './dto/video.dto';
import { NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  video: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe('VideosService', () => {
  let service: VideosService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideosService,
        { provide: PrismaService, useValue: mockPrismaService },
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

    mockPrismaService.video.create.mockResolvedValue(mockResponse);

    const result = await service.create(videoDto);

    expect(prismaService.video.create).toHaveBeenCalledWith({
      data: videoDto,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should throw error if prismaService fails', () => {
    const videoDto: VideoDto = {
      filename: 'test-video.mp4',
      mimetype: 'video/mp4',
      path: '/home/video/test-video.mp4',
    };

    mockPrismaService.video.create.mockRejectedValue(
      new Error('Database error'),
    );

    void expect(service.create(videoDto)).rejects.toThrow();
  });

  it('should call prismaService.video.findUnique with correct data', async () => {
    const mockVideoMetadata = {
      id: 1,
      filename: 'test-video.mp4',
      mimetype: 'video/mp4',
      path: '/home/video/test-video.mp4',
    };

    mockPrismaService.video.findUnique.mockResolvedValue(mockVideoMetadata);

    await service.getVideoMetadata(1);

    expect(mockPrismaService.video.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should throw NotFoundException when video is not found', () => {
    mockPrismaService.video.findUnique.mockResolvedValue(null);

    const nonExistentId = 3587;

    void expect(service.getVideoMetadata(nonExistentId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return video metadata from VideoService.getVideoMetadata', async () => {
    const mockVideoMetadata = {
      id: 1,
      filename: 'test-video.mp4',
      mimetype: 'video/mp4',
      path: '/home/video/test-video.mp4',
    };

    mockPrismaService.video.findUnique.mockResolvedValue(mockVideoMetadata);

    const result = await service.getVideoMetadata(1);

    expect(result).toEqual(mockVideoMetadata);
  });
});
