import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SymptomCheckerService } from './symptom-checker.service';
import { CreateSymptomCheckerDto } from './dto/create-symptom-checker.dto';

@Controller('symptom-checker')
export class SymptomCheckerController {
  constructor(private readonly symptomCheckerService: SymptomCheckerService) {}

  @Post()
  create(@Body() createSymptomCheckerDto: CreateSymptomCheckerDto) {
    return this.symptomCheckerService.create(createSymptomCheckerDto);
  }

  @Get()
  findAll() {
    return this.symptomCheckerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.symptomCheckerService.findOne(+id);
  }

}
