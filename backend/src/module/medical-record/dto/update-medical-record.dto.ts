// src/api/medical-record/dto/update-medical-record.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateMedicalRecordDto } from './create-medical-record.dto';

export class UpdateMedicalRecordDto extends PartialType(CreateMedicalRecordDto) {}
