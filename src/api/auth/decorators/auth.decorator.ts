import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Exclude, Expose, Type } from 'class-transformer';
import { Allow, IsEnum } from 'class-validator';
import { Role } from '../enums/role.enum';

@Exclude()
export class AuthRequest {
  @Expose()
  @Allow()
  userId: string;

  @Expose()
  @Allow()
  @Type(() => Boolean)
  isActive: boolean;

  @Expose()
  @Allow()
  @IsEnum(Role)
  role: Role;
}

export const Auth = createParamDecorator((data, ctx: ExecutionContext) => {
  const { user } = ctx.switchToHttp().getRequest();
  return user;
});
