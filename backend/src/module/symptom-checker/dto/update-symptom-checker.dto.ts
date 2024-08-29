import { PartialType } from '@nestjs/swagger';
import { CreateSymptomCheckerDto } from './create-symptom-checker.dto';
import { IsUUID, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSymptomCheckerDto extends PartialType(CreateSymptomCheckerDto) {
  @ApiPropertyOptional({ description: 'UUID of the doctor recommended by the symptom checker', example: 'd1234567-e89b-12d3-a456-426614174001' })
  @IsUUID()
  @IsOptional()
  recommendedDoctorId?: string;
}
