import { IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateBarberServiceDto {
  @IsNumber()
  @Min(0)
  price: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}


