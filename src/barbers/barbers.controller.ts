import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { BarbersService } from './barbers.service';
import { CreateBarberDto } from './dto/create-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';
import { Barber } from './entities/barber.entity';

@Controller({ path: 'barbers', version: '1' })
export class BarbersController {
    constructor(private readonly barbersService: BarbersService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createBarberDto: CreateBarberDto): Promise<Barber> {
        return this.barbersService.create(createBarberDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<Barber[]> {
        return this.barbersService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: string): Promise<Barber> {
        return this.barbersService.findOne(id);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() updateBarberDto: UpdateBarberDto,
    ): Promise<Barber> {
        return this.barbersService.update(id, updateBarberDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
        return this.barbersService.remove(id);
    }
}

