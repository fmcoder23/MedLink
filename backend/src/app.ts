import { Module } from '@nestjs/common';
import { AuthModule } from './module/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';
import { DoctorModule } from './module/doctor/doctor.module';

@Module({
  imports: [
    AuthModule,
    DoctorModule
  ],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: RolesGuard
  }],
})
export class AppModule { }
