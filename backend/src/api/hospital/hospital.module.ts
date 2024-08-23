import { Module } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { HospitalController } from './hospital.controller';

@Module({
  controllers: [HospitalController],
  providers: [HospitalService],
})
export class HospitalModule {}
