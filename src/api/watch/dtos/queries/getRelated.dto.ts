import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';
import { WatchIdMustExist } from '../../validators/decorators/watchIdMustExist.decorator';

export class GetRelatedDto {
  @ApiProperty()
  @WatchIdMustExist()
  @IsUUID()
  watchId: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit = 32;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  offset = 0;
}
