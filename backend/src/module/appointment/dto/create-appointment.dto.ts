import { IsUUID, IsDate, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { AppointmentStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'UUID of the patient', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  patientId: string;

  @ApiProperty({ description: 'UUID of the doctor', example: '123e4567-e89b-12d3-a456-426614174001' })
  @IsUUID()
  doctorId: string;

  @ApiProperty({ description: 'Scheduled date and time for the appointment', example: '2024-08-30T14:00:00Z' })
  @IsDate()
  @Type(() => Date)
  scheduledAt: Date;

  @ApiPropertyOptional({ description: 'Status of the appointment', enum: AppointmentStatus, example: AppointmentStatus.PENDING })
  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus = AppointmentStatus.PENDING;
}
