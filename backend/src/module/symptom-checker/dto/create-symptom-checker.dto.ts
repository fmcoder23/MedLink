// src/api/symptom-checker/dto/create-symptom-checker.dto.ts
import { IsNotEmpty, IsUUID, IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSymptomCheckerDto {
  @ApiProperty({ description: 'UUID of the user checking symptoms' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ description: 'UUID of the recommended doctor' })
  @IsUUID()
  @IsOptional()
  recommendedDoctorId?: string;

  @ApiProperty({ description: 'List of symptoms provided by the user', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  symptoms: string[];

  @ApiPropertyOptional({ description: 'Diagnosis suggested by the AI' })
  @IsString()
  @IsOptional()
  diagnosis?: string;
}