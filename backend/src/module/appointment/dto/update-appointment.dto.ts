import { IsUUID, IsDate, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { AppointmentStatus } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAppointmentDto {

  @ApiPropertyOptional({ description: 'UUID of the doctor', example: '123e4567-e89b-12d3-a456-426614174001' })
  @IsUUID()
  @IsOptional()
  doctorId?: string;

  @ApiPropertyOptional({ description: 'Updated scheduled date and time for the appointment', example: '2024-08-30T16:00:00Z' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  scheduledAt?: Date;

  @ApiPropertyOptional({ description: 'Status of the appointment', enum: AppointmentStatus, example: AppointmentStatus.CONFIRMED })
  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;
}
