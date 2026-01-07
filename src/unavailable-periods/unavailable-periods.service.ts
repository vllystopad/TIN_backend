import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnavailablePeriod } from './entities/unavailable-period.entity';
import { CreateUnavailablePeriodDto } from './dto/create-unavailable-period.dto';
import { UpdateUnavailablePeriodDto } from './dto/update-unavailable-period.dto';

@Injectable()
export class UnavailablePeriodsService {
  constructor(
    @InjectRepository(UnavailablePeriod)
    private unavailablePeriodsRepository: Repository<UnavailablePeriod>,
  ) {}

  async create(createUnavailablePeriodDto: CreateUnavailablePeriodDto): Promise<UnavailablePeriod> {
    const unavailablePeriod = this.unavailablePeriodsRepository.create(createUnavailablePeriodDto);
    return await this.unavailablePeriodsRepository.save(unavailablePeriod);
  }

  async findAll(): Promise<UnavailablePeriod[]> {
    return await this.unavailablePeriodsRepository.find({
      relations: ['barber'],
    });
  }

  async findOne(id: string): Promise<UnavailablePeriod> {
    const unavailablePeriod = await this.unavailablePeriodsRepository.findOne({
      where: { id },
      relations: ['barber'],
    });

    if (!unavailablePeriod) {
      throw new NotFoundException(`UnavailablePeriod with ID ${id} not found`);
    }

    return unavailablePeriod;
  }

  async findByBarber(barberId: string): Promise<UnavailablePeriod[]> {
    return await this.unavailablePeriodsRepository.find({
      where: { barberId },
    });
  }

  async update(id: string, updateUnavailablePeriodDto: UpdateUnavailablePeriodDto): Promise<UnavailablePeriod> {
    const unavailablePeriod = await this.findOne(id);

    Object.assign(unavailablePeriod, updateUnavailablePeriodDto);

    return await this.unavailablePeriodsRepository.save(unavailablePeriod);
  }

  async remove(id: string): Promise<void> {
    const unavailablePeriod = await this.findOne(id);
    await this.unavailablePeriodsRepository.remove(unavailablePeriod);
  }
}


