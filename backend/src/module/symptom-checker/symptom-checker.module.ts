import { Module } from '@nestjs/common';
import { SymptomCheckerService } from './symptom-checker.service';
import { SymptomCheckerController } from './symptom-checker.controller';

@Module({
  controllers: [SymptomCheckerController],
  providers: [SymptomCheckerService],
})
export class SymptomCheckerModule {}
