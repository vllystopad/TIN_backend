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
  UseGuards,
  Request,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { CustomerAuthGuard } from 'src/features/auth/guards/customer-auth.guard';

@Controller({ path: 'appointments', version: '1' })
@UseGuards(CustomerAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @Post('barber/:barberId')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req: any,
    @Param('barberId') barberId: string,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const customerId = req.user.sub;
    return await this.appointmentsService.create(customerId, barberId, createAppointmentDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Request() req: any): Promise<Appointment[]> {
    const customerId = req.user.sub;
    return await this.appointmentsService.findByCustomer(customerId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Request() req: any, @Param('id') id: string): Promise<Appointment> {
    const customerId = req.user.sub;
    return await this.appointmentsService.findOne(customerId, id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const customerId = req.user.sub;
    return await this.appointmentsService.update(customerId, id, updateAppointmentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req: any, @Param('id') id: string): Promise<void> {
    const customerId = req.user.sub;
    return await this.appointmentsService.remove(customerId, id);
  }
}

