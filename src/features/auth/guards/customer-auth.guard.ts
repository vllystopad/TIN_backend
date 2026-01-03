import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { CustomerAuthService } from '../customerAuth.service';

@Injectable()
export class CustomerAuthGuard implements CanActivate {
  constructor(private readonly customerAuthService: CustomerAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.customerAuthService.validateAccessToken(token);
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
