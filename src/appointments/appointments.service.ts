import { Injectable, NotFoundException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CustomerService } from 'src/customer/customer.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    private readonly customerService: CustomerService
  ) { }

  async create(customerId: string, barberId: string, createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    try {
      await this.customerService.findOne(customerId);
    } catch (error) {
      throw new UnauthorizedException();
    }

    const appointment = this.appointmentsRepository.create({
      ...createAppointmentDto,
      customerId,
      barberId,
    });

    return await this.appointmentsRepository.save(appointment);
  }

  async findOne(customerId: string, id: string): Promise<Appointment> {
    try {
      await this.customerService.findOne(customerId);
    } catch (error) {
      throw new UnauthorizedException();
    }

    const appointment = await this.appointmentsRepository.findOne({
      where: { id, customerId },
      relations: ['customer', 'barber', 'appointmentServices'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async findByCustomer(customerId: string): Promise<Appointment[]> {
    try {
      await this.customerService.findOne(customerId);
    } catch (error) {
      throw new UnauthorizedException();
    }

    return await this.appointmentsRepository.find({
      where: { customerId },
      relations: ['barber', 'appointmentServices'],
      order: { appointmentDate: 'DESC', startTime: 'DESC' },
    });
  }

  async update(customerId: string, id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    try {
      await this.customerService.findOne(customerId);
    } catch (error) {
      throw new UnauthorizedException();
    }

    const appointment = await this.appointmentsRepository.findOne({
      where: { id, customerId },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    Object.assign(appointment, updateAppointmentDto);

    return await this.appointmentsRepository.save(appointment);
  }

  async remove(customerId: string, id: string): Promise<void> {
    try {
      await this.customerService.findOne(customerId);
    } catch (error) {
      throw new UnauthorizedException();
    }

    const appointment = await this.appointmentsRepository.findOne({
      where: { id, customerId },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    await this.appointmentsRepository.remove(appointment);
  }
}

