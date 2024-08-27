// src/api/medical-record/dto/update-medical-record.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateMedicalRecordDto } from './create-medical-record.dto';
import { IsOptional, IsUUID, IsString, IsEnum, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RecordType } from '@prisma/client';

export class UpdateMedicalRecordDto {
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
