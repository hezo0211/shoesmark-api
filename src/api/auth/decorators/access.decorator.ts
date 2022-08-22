import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Exclude, Expose, Type } from 'class-transformer';
import { Allow, IsEnum } from 'class-validator';
import { AccessAction } from '../enums/activationAction.enum';

@Exclude()
export class AccessRequest {
  @Expose()
  @Allow()
  email: string;

  @Expose()
  @Allow()
  @IsEnum(AccessAction)
  action: AccessAction;

  @Expose()
  @Allow()
  @Type(() => Date)
  expiredAt: Date;
}

export const Access = createParamDecorator((data, ctx: ExecutionContext) => {
  const { access } = ctx.switchToHttp().getRequest();
  return access;
});
