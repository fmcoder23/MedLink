// src/api/prescription/dto/create-prescription.dto.ts
import { IsNotEmpty, IsString, IsUUID, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePrescriptionDto {
  @ApiProperty({ description: 'UUID of the doctor issuing the prescription' })
  @IsUUID()
  @IsNotEmpty()
  doctorId: string;

  @ApiProperty({ description: 'UUID of the patient receiving the prescription' })
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({ description: 'Name of the medication prescribed' })
  @IsString()
  @IsNotEmpty()
  medication: string;

  @ApiProperty({ description: 'Dosage of the prescribed medication' })
  @IsString()
  @IsNotEmpty()
  dosage: string;

  @ApiProperty({ description: 'Instructions for taking the prescribed medication' })
  @IsString()
  @IsNotEmpty()
  instructions: string;

  @ApiPropertyOptional({ description: 'Expiration date of the prescription' })
  @IsOptional()
  @IsDateString()
  expirationDate?: Date;

  @ApiPropertyOptional({ description: 'Whether the prescription has been fulfilled' })
  @IsOptional()
  @IsBoolean()
  fulfilled?: boolean;
}
