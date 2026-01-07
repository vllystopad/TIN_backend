import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateBarberDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  experienceYears?: number;
}

