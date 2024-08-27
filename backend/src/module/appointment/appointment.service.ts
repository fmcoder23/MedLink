import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from '@prisma/client';

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) {}

  async createAppointment(patientId: string, createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    return this.prisma.appointment.create({
      data: {
        ...createAppointmentDto,
        patientId,
      },
    });
  }

  async findAllAppointmentsForUser(patientId: string): Promise<Appointment[]> {
    return this.prisma.appointment.findMany({
      where: { patientId },
      orderBy: {
        scheduledAt: 'asc',
      },
    });
  }

  async findAppointmentById(id: string): Promise<Appointment> {
    return this.prisma.appointment.findUnique({
      where: { id },
    });
  }

  async updateAppointment(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    return this.prisma.appointment.update({
      where: { id },
      data: updateAppointmentDto,
    });
  }

  async deleteAppointment(id: string): Promise<void> {
    await this.prisma.appointment.delete({
      where: { id },
    });
  }
}
