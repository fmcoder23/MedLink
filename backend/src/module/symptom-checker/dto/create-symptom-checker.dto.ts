import { IsNotEmpty, IsUUID, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSymptomCheckerDto {
  @ApiProperty({ description: 'UUID of the user associated with the symptom checker', example: 'e1234567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Array of symptoms reported by the user', example: ['headache', 'fever', 'nausea'] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  symptoms: string[];
}
