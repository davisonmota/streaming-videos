import { IsString } from 'class-validator';

export class VideoDto {
  @IsString()
  filename: string;

  @IsString()
  path: string;

  @IsString()
  minetype: string;
}
