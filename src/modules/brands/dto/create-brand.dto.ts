import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @MaxLength(500)
  description?: string;
}
