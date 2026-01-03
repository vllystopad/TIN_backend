import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Customer } from 'src/customer/entities/customer.entity';
import { Barber } from '../../barbers/entities/barber.entity';
import { AppointmentService } from '../../appointment-services/entities/appointment-service.entity';
import { AppointmentStatus } from '../appointment.types';

@Entity('appointments')
export class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    customerId: string;

    @Column()
    barberId: string;

    @ManyToOne(() => Customer, (customer) => customer.appointments, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'customerId' })
    customer: Customer;

    @ManyToOne(() => Barber, (barber) => barber.appointments, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'barberId' })
    barber: Barber;

    @OneToMany(
        () => AppointmentService,
        (appointmentService) => appointmentService.appointment,
    )
    appointmentServices: AppointmentService[];

    @Column({ type: 'date' })
    appointmentDate: string;

    @Column({ type: 'time' })
    startTime: string;

    @Column({ type: 'time' })
    endTime: string;

    @Column({ type: 'text', default: AppointmentStatus.PENDING })
    status: AppointmentStatus;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalPrice: number;

    @Column({ nullable: true, type: 'text' })
    notes: string;

    @Column({ nullable: true, type: 'text' })
    cancellationReason: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

