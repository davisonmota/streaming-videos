import { IsString } from 'class-validator';

export class FindOnParams {
  @IsString()
  id: string;
}
