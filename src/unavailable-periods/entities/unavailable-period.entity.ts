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
import { UnavailabilityType } from '../../barbers/barber.types';

@Entity('unavailable_periods')
export class UnavailablePeriod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  barberId: string;

  @ManyToOne(() => Barber, (barber) => barber.unavailablePeriods, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'barberId' })
  barber: Barber;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ type: 'text', default: UnavailabilityType.DAY_OFF })
  type: UnavailabilityType;

  @Column({ nullable: true, type: 'text' })
  reason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
