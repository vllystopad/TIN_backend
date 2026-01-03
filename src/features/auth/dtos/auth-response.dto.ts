import type { ResponseCustomer } from 'src/customer/customer.types';

export class AuthResponse {
  customer: ResponseCustomer;
  access_token: string;
  refresh_token: string;
  access_expires_in: number;
  refresh_expires_in: number;
}
