import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { Gender } from 'src/api/user/enums/gender';
import { OrderStatus } from '../../enums/orderStatus.enum';
import { PaymentMethod } from '../../enums/paymentMedthod.enum';

export class EditOrderDto {
  @ApiPropertyOptional()
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  orderEmail?: string;

  @ApiPropertyOptional()
  @Length(1, 25)
  @IsString()
  @IsOptional()
  postCode?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  note?: string;

  @ApiPropertyOptional()
  @Length(1, 35)
  @IsString()
  @IsOptional()
  orderFirstName?: string;

  @ApiPropertyOptional()
  @Length(1, 100)
  @IsString()
  @IsOptional()
  orderLastName?: string;

  @ApiPropertyOptional()
  @IsPhoneNumber()
  @IsOptional()
  orderPhoneNumber?: string;

  @ApiPropertyOptional()
  @IsEnum(Gender)
  @IsOptional()
  orderGender?: Gender;

  @ApiPropertyOptional()
  @Length(1, 35)
  @IsString()
  @IsOptional()
  orderCity?: string;

  @ApiPropertyOptional()
  @Length(1, 75)
  @IsString()
  @IsOptional()
  orderDistrict?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  orderAddress?: string;

  @ApiPropertyOptional()
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional()
  @Type(() => Date)
  @IsOptional()
  datePurchased?: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  onlinePaymentId?: string;
}
