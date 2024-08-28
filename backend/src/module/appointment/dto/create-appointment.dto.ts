import { IsUUID, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {

  @ApiProperty({ description: 'UUID of the doctor', example: '123e4567-e89b-12d3-a456-426614174001' })
  @IsUUID()
  doctorId: string;

  @ApiProperty({ description: 'Scheduled date and time for the appointment', example: '2024-08-30T14:00:00Z' })
  @IsDate()
  @Type(() => Date)
  scheduledAt: Date;
}
