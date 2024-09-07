// src/api/medical-record/medical-record.module.ts
import { Module } from '@nestjs/common';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecordController } from './medical-record.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [MedicalRecordController],
  providers: [MedicalRecordService, RolesGuard],
})
export class MedicalRecordModule {}
