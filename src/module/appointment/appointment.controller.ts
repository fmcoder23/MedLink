import { Controller, Post, Body, Get, Put, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from '@prisma/client';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('Appointments')
@ApiBearerAuth()
@Controller('appointments')
@UseGuards(RolesGuard)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @Roles(UserRole.USER)
  create(@Req() req: any, @Body() createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const userId = req.user.id;
    return this.appointmentService.createAppointment(userId, createAppointmentDto);
  }

  @Get()
  @Roles(UserRole.USER)
  findAll(@Req() req: any): Promise<Appointment[]> {
    const userId = req.user.id;
    return this.appointmentService.findAllAppointmentsForUser(userId);
  }

  @Get(':id')
  @Roles(UserRole.USER)
  findOne(@Param('id') id: string, @Req() req: any): Promise<Appointment> {
    return this.appointmentService.findAppointmentByIdForUser(id, req.user.id);
  }

  @Put(':id')
  @Roles(UserRole.USER)
  update(@Param('id') id: string, @Req() req: any, @Body() updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    return this.appointmentService.updateUserAppointment(id, req.user.id, updateAppointmentDto);
  }

  @Delete(':id')
  @Roles(UserRole.USER)
  delete(@Param('id') id: string, @Req() req: any): Promise<void> {
    return this.appointmentService.cancelUserAppointment(id, req.user.id);
  }

  @Get('doctor/me')
  @Roles(UserRole.DOCTOR)
  findAllForDoctor(@Req() req: any): Promise<Appointment[]> {
    const doctorId = req.user.id;
    return this.appointmentService.findAllAppointmentsForDoctor(doctorId);
  }

  @Get('doctor/:id')
  @Roles(UserRole.DOCTOR)
  findOneForDoctor(@Param('id') id: string, @Req() req: any): Promise<Appointment> {
    return this.appointmentService.findAppointmentByIdForDoctor(id, req.user.id);
  }

  @Put('doctor/:id')
  @Roles(UserRole.DOCTOR)
  updateStatus(@Param('id') id: string, @Req() req: any, @Body() updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    return this.appointmentService.updateAppointmentStatus(id, req.user.id, updateAppointmentDto);
  }

  @Get('admin/all')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  findAllAppointments(): Promise<Appointment[]> {
    return this.appointmentService.findAllAppointments();
  }

  @Put('admin/:id')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  adminUpdate(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    return this.appointmentService.updateAppointment(id, updateAppointmentDto);
  }

  @Delete('admin/:id')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  adminDelete(@Param('id') id: string): Promise<void> {
    return this.appointmentService.deleteAppointment(id);
  }
}
