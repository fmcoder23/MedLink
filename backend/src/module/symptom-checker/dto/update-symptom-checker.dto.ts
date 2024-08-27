import { PartialType } from '@nestjs/swagger';
import { CreateSymptomCheckerDto } from './create-symptom-checker.dto';

export class UpdateSymptomCheckerDto extends PartialType(CreateSymptomCheckerDto) {}