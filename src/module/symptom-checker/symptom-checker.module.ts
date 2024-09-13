import { Module } from '@nestjs/common';
import { SymptomCheckerService } from './symptom-checker.service';
import { SymptomCheckerController } from './symptom-checker.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [SymptomCheckerController],
  providers: [SymptomCheckerService],
})
export class SymptomCheckerModule {}
