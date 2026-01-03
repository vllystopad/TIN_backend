import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CustomerAuthController } from './customerAuth.controller';
import { CustomerAuthService } from './customerAuth.service';
import { CustomerModule } from 'src/customer/customer.module';
import { CustomerAuthGuard } from './guards/customer-auth.guard';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { getJwtConfig } from 'src/config/jwt.config';

@Module({
  imports: [
    CustomerModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getJwtConfig,
      inject: [ConfigService],
    }),
  ],
  controllers: [CustomerAuthController],
  providers: [CustomerAuthService, CustomerAuthGuard],
  exports: [CustomerAuthService, CustomerAuthGuard],
})
export class CustomerAuthModule {}
