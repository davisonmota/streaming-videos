import { Test, TestingModule } from '@nestjs/testing';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { Readable } from 'stream';

const mockServiceVideo = {
  create: jest.fn(),
};

describe('VideosController', () => {
  let controller: VideosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideosController],
      providers: [{ provide: VideosService, useValue: mockServiceVideo }],
    }).compile();

    controller = module.get<VideosController>(VideosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call VideoService.create with correct data', async () => {
    const mockFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'GravaÃ§Ã£o de tela de 2025-02-12 18-22-36.webm',
      encoding: '7bit',
      mimetype: 'video/webm',
      destination: './uploadedFiles/videos',
      filename: '9e43e7cb6b98e08d4975de7fc176baf8',
      path: 'uploadedFiles/videos/9e43e7cb6b98e08d4975de7fc176baf8',
      size: 403509,
      buffer: Buffer.from('test video'),
      stream: new Readable(),
    };

    await controller.addVideo(mockFile);

    expect(mockServiceVideo.create).toHaveBeenCalledWith({
      filename: mockFile.originalname,
      path: mockFile.path,
      mimetype: mockFile.mimetype,
    });
  });

  it('should thrown an error if VideoService.create fails', () => {
    const mockFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'GravaÃ§Ã£o de tela de 2025-02-12 18-22-36.webm',
      encoding: '7bit',
      mimetype: 'video/webm',
      destination: './uploadedFiles/videos',
      filename: '9e43e7cb6b98e08d4975de7fc176baf8',
      path: 'uploadedFiles/videos/9e43e7cb6b98e08d4975de7fc176baf8',
      size: 403509,
      buffer: Buffer.from('test video'),
      stream: new Readable(),
    };

    mockServiceVideo.create.mockRejectedValue(new Error('Any error'));
    const resultPromise = controller.addVideo(mockFile);

    void expect(resultPromise).rejects.toThrow();
  });
});
