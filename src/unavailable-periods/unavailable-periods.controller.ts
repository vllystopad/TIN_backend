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
import { UnavailablePeriodsService } from './unavailable-periods.service';
import { CreateUnavailablePeriodDto } from './dto/create-unavailable-period.dto';
import { UpdateUnavailablePeriodDto } from './dto/update-unavailable-period.dto';
import { UnavailablePeriod } from './entities/unavailable-period.entity';

@Controller('unavailable-periods')
export class UnavailablePeriodsController {
  constructor(private readonly unavailablePeriodsService: UnavailablePeriodsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUnavailablePeriodDto: CreateUnavailablePeriodDto): Promise<UnavailablePeriod> {
    return await this.unavailablePeriodsService.create(createUnavailablePeriodDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<UnavailablePeriod[]> {
    return await this.unavailablePeriodsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<UnavailablePeriod> {
    return await this.unavailablePeriodsService.findOne(id);
  }

  @Get('barber/:barberId')
  @HttpCode(HttpStatus.OK)
  async findByBarber(@Param('barberId') barberId: string): Promise<UnavailablePeriod[]> {
    return await this.unavailablePeriodsService.findByBarber(barberId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateUnavailablePeriodDto: UpdateUnavailablePeriodDto,
  ): Promise<UnavailablePeriod> {
    return await this.unavailablePeriodsService.update(id, updateUnavailablePeriodDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return await this.unavailablePeriodsService.remove(id);
  }
}

