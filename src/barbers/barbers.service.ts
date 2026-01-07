import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Barber } from './entities/barber.entity';
import { CreateBarberDto } from './dto/create-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';
import { HashService } from '../shared/security/hash.service';

@Injectable()
export class BarbersService {
    constructor(
        @InjectRepository(Barber)
        private barbersRepository: Repository<Barber>,
        private readonly hashService: HashService,
    ) { }

    async create(createBarberDto: CreateBarberDto): Promise<Barber> {
        const existingBarber = await this.barbersRepository.findOne({
            where: { email: createBarberDto.email },
        });

        if (existingBarber) {
            throw new ConflictException('Barber with this email already exists');
        }

        const hashedPassword = await this.hashService.hash(createBarberDto.password);

        const barber = this.barbersRepository.create({
            ...createBarberDto,
            password: hashedPassword,
        });

        return await this.barbersRepository.save(barber);
    }

    async findAll(): Promise<Barber[]> {
        return await this.barbersRepository.find();
    }

    async findOne(id: string): Promise<Barber> {
        const barber = await this.barbersRepository.findOne({ where: { id } });

        if (!barber) {
            throw new NotFoundException(`Barber with ID ${id} not found`);
        }

        return barber;
    }

    async update(id: string, updateBarberDto: UpdateBarberDto): Promise<Barber> {
        const barber = await this.findOne(id);

        Object.assign(barber, updateBarberDto);

        return await this.barbersRepository.save(barber);
    }

    async remove(id: string): Promise<void> {
        const barber = await this.findOne(id);
        await this.barbersRepository.remove(barber);
    }
}

