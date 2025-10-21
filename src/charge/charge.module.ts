import { Module } from '@nestjs/common';
import { ChargeService } from './charge.service';
import { ChargeController } from './charge.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ChargeController],
  providers: [ChargeService],
  imports: [PrismaModule],
})
export class ChargeModule {}
