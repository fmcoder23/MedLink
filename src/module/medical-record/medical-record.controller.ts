// src/api/medical-record/medical-record.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { MedicalRecordService } from './medical-record.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/role.enum';

@ApiTags('MedicalRecords')
@Controller('medical-records')
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class MedicalRecordController {
  constructor(private readonly medicalRecordService: MedicalRecordService) {}

  @Post()
  @Roles(UserRole.DOCTOR)
  create(@Request() req, @Body() createMedicalRecordDto: CreateMedicalRecordDto) {
    return this.medicalRecordService.create(req.user.id, createMedicalRecordDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  findAll() {
    return this.medicalRecordService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  findOne(@Param('id') id: string) {
    return this.medicalRecordService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  update(@Param('id') id: string, @Body() updateMedicalRecordDto: UpdateMedicalRecordDto) {
    return this.medicalRecordService.update(id, updateMedicalRecordDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.medicalRecordService.remove(id);
  }

  @Get('for-user')
  @Roles(UserRole.USER)
  findForUser(@Request() req) {
    return this.medicalRecordService.findMedicalRecordsForUser(req.user.id);
  }

  @Get('for-doctor')
  @Roles(UserRole.DOCTOR)
  findForDoctor(@Request() req) {
    return this.medicalRecordService.findMedicalRecordsForDoctor(req.user.id);
  }

  @Put('for-doctor/:id')
  @Roles(UserRole.DOCTOR)
  updateForDoctor(@Request() req, @Param('id') id: string, @Body() updateMedicalRecordDto: UpdateMedicalRecordDto) {
    return this.medicalRecordService.updateByDoctor(req.user.id, id, updateMedicalRecordDto);
  }

  @Delete('for-doctor/:id')
  @Roles(UserRole.DOCTOR)
  deleteForDoctor(@Request() req, @Param('id') id: string) {
    return this.medicalRecordService.deleteByDoctor(req.user.id, id);
  }
}
