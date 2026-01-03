import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { BarberService } from '../../barber-services/entities/barber-service.entity';
import { UnavailablePeriod } from '../../unavailable-periods/entities/unavailable-period.entity';
import { BarberRole } from '../barber.types';

@Entity('barbers')
export class Barber {
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

    @Column({ nullable: true, type: 'text' })
    bio: string;

    @Column({ nullable: true })
    photo: string;

    @Column({ default: 0 })
    experienceYears: number;

    @Column({
        type: 'text',
        default: BarberRole.ADMIN,
    })
    role: BarberRole;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => Appointment, (appointment) => appointment.barber)
    appointments: Appointment[];

    @OneToMany(() => BarberService, (barberService) => barberService.barber)
    barberServices: BarberService[];

    @OneToMany(
        () => UnavailablePeriod,
        (unavailablePeriod) => unavailablePeriod.barber,
    )
    unavailablePeriods: UnavailablePeriod[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

