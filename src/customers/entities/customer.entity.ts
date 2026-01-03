import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { CustomerType } from '../customer.types';

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({
        type: 'text',
        default: CustomerType.REGISTERED,
    })
    type: CustomerType;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => Appointment, (appointment) => appointment.customer)
    appointments: Appointment[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

