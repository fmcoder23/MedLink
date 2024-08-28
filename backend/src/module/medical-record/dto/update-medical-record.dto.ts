import { PartialType } from '@nestjs/swagger';
import { CreateMedicalRecordDto } from './create-medical-record.dto';
import { IsOptional, IsString, IsEnum, IsArray, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RecordType } from '@prisma/client';

export class UpdateMedicalRecordDto extends PartialType(CreateMedicalRecordDto) {
  @ApiPropertyOptional({ description: 'UUID of the patient associated with the medical record' })
  @IsUUID()
  @IsNotEmpty()
  patientId?: string;

  @ApiPropertyOptional({ description: 'Type of medical record', enum: RecordType })
  @IsEnum(RecordType)
  @IsOptional()
  recordType?: RecordType;

  @ApiPropertyOptional({ description: 'Details of the medical record' })
  @IsString()
  @IsOptional()
  details?: string;

  @ApiPropertyOptional({ description: 'List of file paths associated with the medical record', type: [String] })
  @IsArray()
  @IsOptional()
  files?: string[];
}
