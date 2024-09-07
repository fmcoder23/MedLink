import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SpecializationService } from './specialization.service';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Specializations')
@Controller('specializations')
export class SpecializationController {
  constructor(private readonly specializationService: SpecializationService) {}

  @Post()
  create(@Body() createSpecializationDto: CreateSpecializationDto) {
    return this.specializationService.create(createSpecializationDto);
  }

  @Get()
  findAll() {
    return this.specializationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specializationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpecializationDto: UpdateSpecializationDto) {
    return this.specializationService.update(id, updateSpecializationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specializationService.remove(id);
  }
}
