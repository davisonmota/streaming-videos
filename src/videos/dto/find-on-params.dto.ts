import { IsNumber } from 'class-validator';

export class FindOnParams {
  @IsNumber()
  id: number;
}
