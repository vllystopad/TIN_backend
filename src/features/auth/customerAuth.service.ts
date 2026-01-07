import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  HttpException,
} from '@nestjs/common';
import { CustomerService } from 'src/customer/customer.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HashService } from 'src/shared/security/hash.service';
import { RegisterCustomerDto } from './dtos/register.dto';
import { CustomerType, type ResponseCustomer } from 'src/customer/customer.types';
import { LoginCustomerDto } from './dtos/login.dto';
import { CustomerJwtPayload, TokenPair } from './types/customer-jwt-payload.type';
import { AuthResponse } from './types/auth-response.type';

@Injectable()
export class CustomerAuthService {
  constructor(
    private readonly customersService: CustomerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly hashService: HashService,
  ) {}

  async register(registerCustomerDto: RegisterCustomerDto): Promise<AuthResponse> {
    const newCustomerDto = {
      ...registerCustomerDto,
      type: CustomerType.REGISTERED,
    };

    const customer = await this.customersService.create(newCustomerDto);

    const tokens = await this.issueTokens(customer.id, customer.type);

    const { password, ...customerWithoutPassword } = customer;

    return {
      customer: customerWithoutPassword,
      ...tokens,
    };
  }

  async login(loginCustomerDto: LoginCustomerDto): Promise<AuthResponse> {
    const customer = await this.customersService.findByEmail(loginCustomerDto.email);

    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.hashService.compare(
      loginCustomerDto.password,
      customer.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!customer.isActive) {
      throw new ForbiddenException();
    }

    const tokens = await this.issueTokens(customer.id, customer.type);

    const { password, ...customerWithoutPassword } = customer;

    return {
      customer: customerWithoutPassword,
      ...tokens,
    };
  }

  async me(userId: string): Promise<ResponseCustomer> {
    const customer = await this.customersService.findOne(userId);

    if (!customer) {
      throw new UnauthorizedException();
    }

    if (!customer.isActive) {
      throw new ForbiddenException();
    }

    const { password, ...customerWithoutPassword } = customer;
    return customerWithoutPassword;
  }

  async issueTokens(userId: string, role: CustomerType): Promise<TokenPair> {
    const accessExpiresIn = this.configService.get<string>('JWT_CUSTOMER_ACCESS_EXPIRES_IN')!;
    const refreshExpiresIn = this.configService.get<string>('JWT_CUSTOMER_REFRESH_EXPIRES_IN')!;
    const accessSecret = this.configService.get<string>('JWT_CUSTOMER_ACCESS_SECRET')!;
    const refreshSecret = this.configService.get<string>('JWT_CUSTOMER_REFRESH_SECRET')!;

    const accessPayload = {
      sub: userId,
      role,
      type: 'access' as const,
    };

    const refreshPayload = {
      sub: userId,
      role,
      type: 'refresh' as const,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload as any, {
        secret: accessSecret,
        expiresIn: accessExpiresIn as any,
      }),
      this.jwtService.signAsync(refreshPayload as any, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn as any,
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      access_expires_in: this.parseExpiresIn(accessExpiresIn),
      refresh_expires_in: this.parseExpiresIn(refreshExpiresIn),
    };
  }

  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    const payload = await this.validateRefreshToken(refreshToken);

    const customer = await this.customersService.findOne(payload.sub);

    if (!customer) {
      throw new UnauthorizedException();
    }

    if (!customer.isActive) {
      throw new ForbiddenException();
    }

    return this.issueTokens(customer.id, customer.type);
  }

  async validateAccessToken(token: string): Promise<CustomerJwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<CustomerJwtPayload>(token, {
        secret: this.configService.get<string>('JWT_CUSTOMER_ACCESS_SECRET')!,
      });

      if (payload.type !== 'access') {
        throw new UnauthorizedException();
      }

      console.log('payload', payload);

      return payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async validateRefreshToken(token: string): Promise<CustomerJwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<CustomerJwtPayload>(token, {
        secret: this.configService.get<string>('JWT_CUSTOMER_REFRESH_SECRET')!,
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException();
      }

      return payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private parseExpiresIn(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1), 10);

    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return value * multipliers[unit];
  }
}
