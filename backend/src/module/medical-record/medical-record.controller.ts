// import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
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
//   @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.DOCTOR)
//   findAll() {
//     return this.medicalRecordService.findAll();
//   }

//   @Get(':id')
//   @Roles(UserRole.USER, UserRole.DOCTOR, UserRole.SUPERADMIN)
//   findOne(@Param('id') id: string, @Req() req: any) {
//     return this.medicalRecordService.findOne(id, req.user);
//   }

//   @Patch(':id')
//   @Roles(UserRole.DOCTOR, UserRole.SUPERADMIN)
//   update(@Param('id') id: string, @Body() updateMedicalRecordDto: UpdateMedicalRecordDto) {
//     return this.medicalRecordService.update(id, updateMedicalRecordDto);
//   }

//   @Delete(':id')
//   @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
//   remove(@Param('id') id: string) {
//     return this.medicalRecordService.remove(id);
//   }
// }
