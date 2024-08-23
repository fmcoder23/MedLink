import { Injectable } from '@nestjs/common';
import { CreateSymptomCheckerDto } from './dto/create-symptom-checker.dto';
import { UpdateSymptomCheckerDto } from './dto/update-symptom-checker.dto';

@Injectable()
export class SymptomCheckerService {
  create(createSymptomCheckerDto: CreateSymptomCheckerDto) {
    return 'This action adds a new symptomChecker';
  }

  findAll() {
    return `This action returns all symptomChecker`;
  }

  findOne(id: number) {
    return `This action returns a #${id} symptomChecker`;
  }

  update(id: number, updateSymptomCheckerDto: UpdateSymptomCheckerDto) {
    return `This action updates a #${id} symptomChecker`;
  }

  remove(id: number) {
    return `This action removes a #${id} symptomChecker`;
  }
}
