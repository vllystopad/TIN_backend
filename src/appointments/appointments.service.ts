import { Injectable, NotFoundException, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CustomerService } from 'src/customer/customer.service';
import { Barber } from 'src/barbers/entities/barber.entity';
import { AppointmentService } from 'src/appointment-services/entities/appointment-service.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    @InjectRepository(AppointmentService)
    private appointmentServicesRepository: Repository<AppointmentService>,
    private readonly customerService: CustomerService,
    private readonly dataSource: DataSource,
  ) { }

  async getAppointmentData(customerId: string) {
    try {
      await this.customerService.findOne(customerId);
    } catch (error) {
      throw new UnauthorizedException();
    }

    const barbers = await this.dataSource
      .getRepository(Barber)
      .createQueryBuilder('barber')
      .leftJoinAndSelect('barber.barberServices', 'barberService')
      .leftJoinAndSelect('barberService.service', 'service')
      .where('barber.isActive = :isActive', { isActive: true })
      .andWhere('barberService.isAvailable = :isAvailable', { isAvailable: true })
      .andWhere('service.isActive = :serviceActive', { serviceActive: true })
      .select([
        'barber.id',
        'barber.firstName',
        'barber.lastName',
        'barber.bio',
        'barber.photo',
        'barber.experienceYears',
        'barberService.id',
        'barberService.price',
        'service.id',
        'service.name',
        'service.description',
        'service.durationMinutes',
      ])
      .getMany();

    return barbers.map(barber => ({
      id: barber.id,
      firstName: barber.firstName,
      lastName: barber.lastName,
      bio: barber.bio,
      photo: barber.photo,
      experienceYears: barber.experienceYears,
      services: barber.barberServices.map(bs => ({
        id: bs.service.id,
        name: bs.service.name,
        description: bs.service.description,
        durationMinutes: bs.service.durationMinutes,
        price: bs.price,
        barberServiceId: bs.id,
      })),
    }));
  }

  async create(customerId: string, createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    try {
      await this.customerService.findOne(customerId);
    } catch (error) {
      throw new UnauthorizedException();
    }

    const { barberId, serviceIds, ...appointmentData } = createAppointmentDto;

    if (!serviceIds || serviceIds.length === 0) {
      throw new BadRequestException('At least one service must be selected');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const appointment = this.appointmentsRepository.create({
        ...appointmentData,
        customerId,
        barberId,
      });

      const savedAppointment = await queryRunner.manager.save(appointment);

      const barberServices = await this.dataSource
        .getRepository('BarberService')
        .createQueryBuilder('bs')
        .leftJoinAndSelect('bs.service', 'service')
        .where('bs.barberId = :barberId', { barberId })
        .andWhere('service.id IN (:...serviceIds)', { serviceIds })
        .andWhere('bs.isAvailable = :isAvailable', { isAvailable: true })
        .getMany();

      if (barberServices.length !== serviceIds.length) {
        throw new BadRequestException('Some services are not available for this barber');
      }

      const appointmentServices = barberServices.map(bs =>
        this.appointmentServicesRepository.create({
          appointmentId: savedAppointment.id,
          serviceId: bs.service.id,
          price: bs.price,
          durationMinutes: bs.service.durationMinutes,
        })
      );

      await queryRunner.manager.save(appointmentServices);

      await queryRunner.commitTransaction();

      return await this.findOne(customerId, savedAppointment.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
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


