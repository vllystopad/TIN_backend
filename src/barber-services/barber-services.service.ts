import { Injectable, NotFoundException, ConflictException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BarberService } from './entities/barber-service.entity';
import { CreateBarberServiceDto } from './dto/create-barber-service.dto';

@Injectable()
export class BarberServicesService {
  constructor(
    @InjectRepository(BarberService)
    private barberServicesRepository: Repository<BarberService>,
  ) {}

  async assignServiceToBarber(
    barberId: string,
    serviceId: string,
    createBarberServiceDto: CreateBarberServiceDto,
  ): Promise<BarberService> {


    const existingBarberservice=  await this.barberServicesRepository.findOne({
      where: {
        barberId, serviceId
      }
    });

    if (existingBarberservice){
      throw new ConflictException('Service already assigned to barber');    
    }

    const barberService = this.barberServicesRepository.create({
      barberId,
      serviceId,
      ...createBarberServiceDto,
    });

    return await this.barberServicesRepository.save(barberService);
  }

  async findAll(): Promise<BarberService[]> {
    return await this.barberServicesRepository.find({
      relations: ['barber', 'service'],
    });
  }

  async findOne(id: string): Promise<BarberService> {
    const barberService = await this.barberServicesRepository.findOne({
      where: { id },
      relations: ['barber', 'service'],
    });

    if (!barberService) {
      throw new NotFoundException(`BarberService with ID ${id} not found`);
    }

    return barberService;
  }

  async findByBarber(barberId: string): Promise<BarberService[]> {
    return await this.barberServicesRepository.find({
      where: { barberId },
      relations: ['service'],
    });
  }

  async findByService(serviceId: string): Promise<BarberService[]> {
    return await this.barberServicesRepository.find({
      where: { serviceId },
      relations: ['barber'],
    });
  }

  async remove(id: string): Promise<void> {
    const barberService = await this.findOne(id);
    await this.barberServicesRepository.remove(barberService);
  }
}

