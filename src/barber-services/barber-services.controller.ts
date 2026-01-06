import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BarberServicesService } from './barber-services.service';
import { CreateBarberServiceDto } from './dto/create-barber-service.dto';
import { BarberService } from './entities/barber-service.entity';

@Controller({ path: 'barber-services', version: '1' })
export class BarberServicesController {
  constructor(private readonly barberServicesService: BarberServicesService) {}

  @Post('service/:serviceId/assign/:barberId')
  @HttpCode(HttpStatus.CREATED)
  async assignServiceToBarber(
    @Param('barberId') barberId: string,
    @Param('serviceId') serviceId: string,
    @Body() createBarberServiceDto: CreateBarberServiceDto,
  ): Promise<BarberService> {
    return await this.barberServicesService.assignServiceToBarber(
      barberId,
      serviceId,
      createBarberServiceDto,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<BarberService[]> {
    return await this.barberServicesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<BarberService> {
    return await this.barberServicesService.findOne(id);
  }

  @Get('barber/:barberId')
  @HttpCode(HttpStatus.OK)
  async findByBarber(@Param('barberId') barberId: string): Promise<BarberService[]> {
    return await this.barberServicesService.findByBarber(barberId);
  }

  @Get('service/:serviceId')
  @HttpCode(HttpStatus.OK)
  async findByService(@Param('serviceId') serviceId: string): Promise<BarberService[]> {
    return await this.barberServicesService.findByService(serviceId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return await this.barberServicesService.remove(id);
  }
}

