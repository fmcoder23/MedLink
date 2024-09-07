import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { config } from '@config';
import { PrismaModule } from '../prisma/prisma.module';
import { RolesGuard } from 'src/common/guards/roles.guard';

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
  controllers: [UserController],
  providers: [UserService,RolesGuard],
})
export class UserModule {}
