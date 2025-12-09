import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  profileImage: string;

  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  passKey: string;

  @IsUUID()
  @IsNotEmpty()
  roleId: string;

  // @IsUUID()
  // @IsOptional()
  // employeeId: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  access?: string[];
}
