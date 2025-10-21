import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './customer/customer.module';
import { ChargeModule } from './charge/charge.module';

@Module({
  imports: [CustomerModule, ChargeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
