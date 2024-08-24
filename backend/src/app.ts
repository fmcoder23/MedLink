import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from './config';
import { AuthModule } from './module/auth/auth.module';

@Module({
  imports: [
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
