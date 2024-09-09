// src/api/medical-record/dto/create-medical-record.dto.ts
import { IsNotEmpty, IsString, IsUUID, IsArray, IsEnum, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RecordType } from '@prisma/client';
import { PaymentStatus } from '@prisma/client';

export class CreateMedicalRecordDto {
  @ApiProperty({ description: 'UUID of the patient associated with the medical record' })
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({ enum: RecordType, description: 'Type of the medical record' })
  @IsEnum(RecordType)
  @IsNotEmpty()
  recordType: RecordType;

  @ApiPropertyOptional({ description: 'Detailed description or notes of the medical record' })
  @IsString()
  @IsOptional()
  details?: string;

  @ApiPropertyOptional({ description: 'Array of file paths associated with the medical record' })
  @IsArray()
  @IsOptional()
  files?: string[];

  @ApiProperty({ description: 'Price associated with the medical record' })
  @IsInt()
  price: number;

  @ApiPropertyOptional({ enum: PaymentStatus, description: 'Payment status of the medical record' })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;
}
