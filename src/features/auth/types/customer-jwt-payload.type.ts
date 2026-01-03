import { CustomerType } from 'src/customer/customer.types';

export interface CustomerJwtPayload {
  sub: string;
  role: CustomerType;
  type: 'access' | 'refresh';
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  access_expires_in: number;
  refresh_expires_in: number;
}
