import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BarberService } from '../../barber-services/entities/barber-service.entity';
import { AppointmentService } from '../../appointment-services/entities/appointment-service.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  durationMinutes: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => BarberService, (barberService) => barberService.service)
  barberServices: BarberService[];

  @OneToMany(() => AppointmentService, (appointmentService) => appointmentService.service)
  appointmentServices: AppointmentService[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
