import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class DeleteManyOrderDto {
  @ApiProperty()
  @IsArray()
  ids: string[];
}
