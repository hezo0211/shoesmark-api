import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { UserIdMustExist } from '../../validators/decorators/userIdMustExist.decorator';

export class GetUserParamDto {
  @ApiProperty()
  @UserIdMustExist()
  @IsUUID()
  id: string;
}
