import { Customer } from './entities/customer.entity';

export enum CustomerType {
  GUEST = 'guest',
  REGISTERED = 'registered',
}

export type ResponseCustomer = Omit<Customer, 'password'>;
