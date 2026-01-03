import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { validate } from './config/env.validation';
import { CustomerModule } from './customer/customer.module';
import { SecurityModule } from './shared/security/security.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            validate,
        }),
        DatabaseModule,
        SecurityModule,
        CustomerModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
