import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HashService } from './hash.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [HashService],
  exports: [HashService],
})
export class SecurityModule {}
