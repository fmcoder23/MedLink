// src/api/review/review.module.ts
import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule,JwtModule],
  controllers: [ReviewController],
  providers: [ReviewService, RolesGuard],
})
export class ReviewModule {}
