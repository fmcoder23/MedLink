import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
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
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule]
})
export class AuthModule {}
