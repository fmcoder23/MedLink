// // src/api/medical-record/medical-record.controller.ts
// import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
// import { MedicalRecordService } from './medical-record.service';
// import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
// import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
// import { RolesGuard } from 'src/common/guards/roles.guard';
// import { Roles } from 'src/common/decorators/roles.decorator';
// import { UserRole } from 'src/common/enums/role.enum'; 
// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// @ApiTags('Medical-Record')
// @Controller('medical-records')
// @ApiBearerAuth()
// @UseGuards(RolesGuard)
// export class MedicalRecordController {
//   constructor(private readonly medicalRecordService: MedicalRecordService) {}

//   @Post()
//   @Roles(UserRole.DOCTOR)
//   create(@Body() createMedicalRecordDto: CreateMedicalRecordDto) {
//     return this.medicalRecordService.create(createMedicalRecordDto);
//   }

//   @Get()
//   @Roles(UserRole.ADMIN, UserRole.DOCTOR)
//   findAll() {
//     return this.medicalRecordService.findAll();
//   }

//   @Get(':id')
//   @Roles(UserRole.USER, UserRole.DOCTOR, UserRole.USER)
//   findOne(@Param('id') id: string) {
//     return this.medicalRecordService.findOne(id);
//   }

//   @Patch(':id')
//   @Roles(UserRole.DOCTOR)
//   update(@Param('id') id: string, @Body() updateMedicalRecordDto: UpdateMedicalRecordDto) {
//     return this.medicalRecordService.update(id, updateMedicalRecordDto);
//   }

//   @Delete(':id')
//   @Roles(UserRole.ADMIN)
//   remove(@Param('id') id: string) {
//     return this.medicalRecordService.remove(id);
//   }
// }
