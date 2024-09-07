import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { config } from '@config';

@Module({
  imports: [
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: {
        expiresIn: config.jwt.expiration,
      }
    }),
    PrismaModule
  ],
  controllers: [DoctorController],
  providers: [DoctorService, RolesGuard],
})
export class DoctorModule {}
