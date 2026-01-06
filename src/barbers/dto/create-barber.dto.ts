import { IsEmail, IsNotEmpty, IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateBarberDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

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

