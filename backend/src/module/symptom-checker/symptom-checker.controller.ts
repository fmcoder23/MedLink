// src/api/symptom-checker/symptom-checker.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { SymptomCheckerService } from './symptom-checker.service';
import { CreateSymptomCheckerDto } from './dto/create-symptom-checker.dto';
import { UpdateSymptomCheckerDto } from './dto/update-symptom-checker.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Symptom-checkers')
@Controller('symptom-checkers')
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class SymptomCheckerController {
  constructor(private readonly symptomCheckerService: SymptomCheckerService) {}

  @Post()
  @Roles(UserRole.USER)
  create(@Body() createSymptomCheckerDto: CreateSymptomCheckerDto) {
    return this.symptomCheckerService.create(createSymptomCheckerDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  findAll() {
    return this.symptomCheckerService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.USER)
  findOne(@Param('id') id: string) {
    return this.symptomCheckerService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.USER)
  update(@Param('id') id: string, @Body() updateSymptomCheckerDto: UpdateSymptomCheckerDto) {
    return this.symptomCheckerService.update(id, updateSymptomCheckerDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.symptomCheckerService.remove(id);
  }
}
