// src/api/prescription/prescription.controller.ts
import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Prescriptions')
@Controller('prescriptions')
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Post()
  @Roles(UserRole.DOCTOR)
  create(@Request() req, @Body() createPrescriptionDto: CreatePrescriptionDto) {
    return this.prescriptionService.create(req.user.id, createPrescriptionDto); // Doctor ID from token
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  findAll() {
    return this.prescriptionService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  findOne(@Param('id') id: string) {
    return this.prescriptionService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  update(@Param('id') id: string, @Body() updatePrescriptionDto: UpdatePrescriptionDto) {
    return this.prescriptionService.update(id, updatePrescriptionDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.prescriptionService.remove(id);
  }

  @Get('for-user')
  @Roles(UserRole.USER)
  findForUser(@Request() req) {
    return this.prescriptionService.findPrescriptionsForUser(req.user.id); // User ID from token
  }

  @Get('for-doctor')
  @Roles(UserRole.DOCTOR)
  findForDoctor(@Request() req) {
    return this.prescriptionService.findPrescriptionsForDoctor(req.user.id); // Doctor ID from token
  }

  @Put('for-doctor/:id')
  @Roles(UserRole.DOCTOR)
  updateForDoctor(@Request() req, @Param('id') id: string, @Body() updatePrescriptionDto: UpdatePrescriptionDto) {
    return this.prescriptionService.updateByDoctor(req.user.id, id, updatePrescriptionDto); // Doctor ID from token
  }

  @Delete('for-doctor/:id')
  @Roles(UserRole.DOCTOR)
  deleteForDoctor(@Request() req, @Param('id') id: string) {
    return this.prescriptionService.deleteByDoctor(req.user.id, id); // Doctor ID from token
  }
}
