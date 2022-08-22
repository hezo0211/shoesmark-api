import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { WatchIdMustExist } from 'src/api/watch/validators/decorators/watchIdMustExist.decorator';

export class EditOrderDetailDto {
  @ApiProperty()
  @WatchIdMustExist()
  @IsUUID()
  watchId: string;

  @ApiPropertyOptional()
  @Min(1)
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional()
  @Min(0)
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  sale?: number;

  @ApiPropertyOptional()
  @Min(0)
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  price?: number;
}
