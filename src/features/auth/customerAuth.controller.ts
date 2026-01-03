import {
  Body,
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { CustomerAuthService } from './customerAuth.service';
import { RegisterCustomerDto } from './dtos/register.dto';
import { LoginCustomerDto } from './dtos/login.dto';
import { CustomerAuthGuard } from './guards/customer-auth.guard';
import type { ResponseCustomer } from 'src/customer/customer.types';

@Controller({ version: '1', path: 'auth/customers' })
export class CustomerAuthController {
  constructor(private readonly customerAuthService: CustomerAuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerCustomerDto: RegisterCustomerDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ customer: ResponseCustomer }> {
    const authResponse = await this.customerAuthService.register(registerCustomerDto);

    response.cookie('access_token', authResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: authResponse.access_expires_in,
    });

    response.cookie('refresh_token', authResponse.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: authResponse.refresh_expires_in,
    });

    return { customer: authResponse.customer };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginCustomerDto: LoginCustomerDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ customer: ResponseCustomer }> {
    const authResponse = await this.customerAuthService.login(loginCustomerDto);

    response.cookie('access_token', authResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: authResponse.access_expires_in,
    });

    response.cookie('refresh_token', authResponse.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: authResponse.refresh_expires_in,
    });

    return { customer: authResponse.customer };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const refreshToken = request.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const tokens = await this.customerAuthService.refreshTokens(refreshToken);

    response.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: tokens.access_expires_in,
    });

    response.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: tokens.refresh_expires_in,
    });

    return { message: 'Tokens refreshed successfully' };
  }

  @Get('me')
  @UseGuards(CustomerAuthGuard)
  @HttpCode(HttpStatus.OK)
  async me(@Req() request: any): Promise<{ customer: ResponseCustomer }> {
    const userId = request.user.sub;
    const customer = await this.customerAuthService.me(userId);

    return { customer };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response): Promise<{ message: string }> {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');

    return { message: 'Logged out successfully' };
  }
}
