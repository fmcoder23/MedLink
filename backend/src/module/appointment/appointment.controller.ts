import { Controller, Post, Body, Patch, Param, Delete, Get, UseGuards, Req, Put } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from '@prisma/client';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/role.enum';

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
  findOne(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentService.findAppointmentById(id);
  }

  @Put(':id')
  @Roles(UserRole.USER)
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    return this.appointmentService.updateAppointment(id, updateAppointmentDto);
  }

  @Delete(':id')
  @Roles(UserRole.USER)
  delete(@Param('id') id: string): Promise<void> {
    return this.appointmentService.deleteAppointment(id);
  }
}
