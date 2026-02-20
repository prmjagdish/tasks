import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsEmail,
} from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
