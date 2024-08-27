import { IsNotEmpty, IsString, IsUUID, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RecordType } from '@prisma/client';

export class CreateMedicalRecordDto {

    @ApiProperty({ description: 'UUID of the patient associated with the medical record' })
    @IsUUID()
    @IsNotEmpty()
    patientId: string;
  
    @ApiProperty({ description: 'Type of medical record', enum: RecordType })
    @IsEnum(RecordType)
    @IsNotEmpty()
    recordType: RecordType;
  
    @ApiProperty({ description: 'Details of the medical record' })
    @IsString()
    @IsNotEmpty()
    details: string;
  
    @ApiProperty({ description: 'List of file paths associated with the medical record', type: [String] })
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    files: string[];
  }
  