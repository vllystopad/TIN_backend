import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Barber } from '../../barbers/entities/barber.entity';
import { Service } from '../../services/entities/service.entity';

@Entity('barber_services')
export class BarberService {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    barberId: string;

    @Column()
    serviceId: string;

    @ManyToOne(() => Barber, (barber) => barber.barberServices, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'barberId' })
    barber: Barber;

    @ManyToOne(() => Service, (service) => service.barberServices, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'serviceId' })
    service: Service;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ default: true })
    isAvailable: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

