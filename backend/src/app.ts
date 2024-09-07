import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';
import { AppointmentModule, AuthModule, CityModule, DoctorModule, MedicalRecordModule, PrescriptionModule, ReviewModule, SpecializationModule, SymptomCheckerModule, UploadModule, UserModule } from '@module';

@Module({
  imports: [
    UploadModule,
    AuthModule,
    DoctorModule,
    UserModule,
    AppointmentModule,
    PrescriptionModule,
    MedicalRecordModule,
    ReviewModule,
    SymptomCheckerModule,
    SpecializationModule,
    CityModule
  ],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: RolesGuard
  }],
})
export class AppModule { }
