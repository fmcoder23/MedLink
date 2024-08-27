// src/api/review/dto/create-review.dto.ts
import { IsNotEmpty, IsString, IsUUID, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'UUID of the doctor being reviewed' })
  @IsUUID()
  @IsNotEmpty()
  doctorId: string;

  @ApiProperty({ description: 'UUID of the patient writing the review' })
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({ description: 'Indicates if the review is anonymous' })
  @IsBoolean()
  @IsNotEmpty()
  isAnonymous: boolean;

  @ApiProperty({ description: 'Rating given by the patient', minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number;

  @ApiProperty({ description: 'Comment provided by the patient' })
  @IsString()
  @IsNotEmpty()
  comment: string;
}
