// src/api/symptom-checker/symptom-checker.module.ts
import { Module } from '@nestjs/common';
import { SymptomCheckerService } from './symptom-checker.service';
import { SymptomCheckerController } from './symptom-checker.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule,JwtModule],
  controllers: [SymptomCheckerController],
  providers: [SymptomCheckerService, RolesGuard],
})
export class SymptomCheckerModule {}
