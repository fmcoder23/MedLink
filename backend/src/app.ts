import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';
import {AuthModule, DoctorModule, UserModule, AppointmentModule, PrescriptionModule, ReviewModule, SymptomCheckerModule} from '@module'

@Module({
  imports: [
    AuthModule,
    DoctorModule,
    UserModule,
    AppointmentModule,
    PrescriptionModule,
    // MedicalRecordModule,
    ReviewModule,
    SymptomCheckerModule
  ],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: RolesGuard
  }],
})
export class AppModule { }
