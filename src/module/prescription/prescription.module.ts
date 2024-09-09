// src/api/prescription/prescription.module.ts
import { Module } from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { PrescriptionController } from './prescription.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule,JwtModule],
  controllers: [PrescriptionController],
  providers: [PrescriptionService, RolesGuard],
})
export class PrescriptionModule {}
