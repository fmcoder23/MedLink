import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment, AppointmentStatus } from '@prisma/client';
import { formatResponse } from 'src/common/utils/response.util';
import { addMinutes, differenceInHours } from 'date-fns';

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) {}

  async createAppointment(patientId: string, createAppointmentDto: CreateAppointmentDto): Promise<any> {
    const { doctorId, scheduledAt } = createAppointmentDto;
  
    // Retrieve the doctor's details, including the durationPerPatient
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });
  
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
  
    // Calculate the end time of the appointment
    const appointmentEndTime = addMinutes(scheduledAt, doctor.durationPerPatient);
  
    // Check if the doctor is available during the scheduled time considering the durationPerPatient
    const conflictingAppointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        OR: [
          {
            AND: [
              {
                scheduledAt: {
                  lte: scheduledAt,
                },
              },
              {
                scheduledAt: {
                  gte: appointmentEndTime,
                },
              }
            ]
          },
          {
            AND: [
              {
                scheduledAt: {
                  gte: scheduledAt,
                },
              },
              {
                scheduledAt: {
                  lte: appointmentEndTime,
                },
              }
            ]
          }
        ],
      },
    });
  
    if (conflictingAppointments.length > 0) {
      throw new BadRequestException('The doctor is not available at the scheduled time.');
    }
  
    const appointment = await this.prisma.appointment.create({
      data: {
        ...createAppointmentDto,
        patientId,
      },
    });
  
    return formatResponse('Appointment created successfully', appointment);
  }
  
  

  async findAllAppointmentsForUser(patientId: string): Promise<any> {
    const appointments = await this.prisma.appointment.findMany({
      where: { patientId },
      orderBy: {
        scheduledAt: 'asc',
      },
    });

    return formatResponse('Appointments retrieved successfully', appointments);
  }

  async findAppointmentByIdForUser(id: string, patientId: string): Promise<any> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment || appointment.patientId !== patientId) {
      throw new NotFoundException('Appointment not found');
    }

    return formatResponse('Appointment retrieved successfully', appointment);
  }

  async updateUserAppointment(id: string, patientId: string, updateAppointmentDto: UpdateAppointmentDto): Promise<any> {
    const appointment = await this.findAppointmentByIdForUser(id, patientId);

    if (appointment.status !== AppointmentStatus.PENDING) {
      throw new ForbiddenException('Cannot update an appointment that is not pending');
    }

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id },
      data: {
        ...updateAppointmentDto,
      },
    });

    return formatResponse('Appointment updated successfully', updatedAppointment);
  }

  async cancelUserAppointment(id: string, patientId: string): Promise<any> {
    const appointment = await this.findAppointmentByIdForUser(id, patientId);

    const hoursUntilAppointment = differenceInHours(appointment.scheduledAt, new Date());
    if (hoursUntilAppointment < 24) {
      throw new ForbiddenException('You can only cancel appointments at least 24 hours in advance.');
    }

    const cancelledAppointment = await this.prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.CANCELLED,
      },
    });

    return formatResponse('Appointment cancelled successfully', cancelledAppointment);
  }

  async findAllAppointmentsForDoctor(doctorId: string): Promise<any> {
    const appointments = await this.prisma.appointment.findMany({
      where: { doctorId },
      orderBy: {
        scheduledAt: 'asc',
      },
    });

    return formatResponse('Appointments retrieved successfully', appointments);
  }

  async findAppointmentByIdForDoctor(id: string, doctorId: string): Promise<any> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment || appointment.doctorId !== doctorId) {
      throw new NotFoundException('Appointment not found');
    }

    return formatResponse('Appointment retrieved successfully', appointment);
  }

  async updateAppointmentStatus(id: string, doctorId: string, updateAppointmentDto: UpdateAppointmentDto): Promise<any> {
    const appointment = await this.findAppointmentByIdForDoctor(id, doctorId);

    if (!updateAppointmentDto.status) {
      throw new ForbiddenException('You can only update the status');
    }

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id },
      data: {
        status: updateAppointmentDto.status,
      },
    });

    return formatResponse('Appointment status updated successfully', updatedAppointment);
  }

  async findAllAppointments(): Promise<any> {
    const appointments = await this.prisma.appointment.findMany({
      orderBy: {
        scheduledAt: 'asc',
      },
    });

    return formatResponse('All appointments retrieved successfully', appointments);
  }

  async updateAppointment(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<any> {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id },
      data: updateAppointmentDto,
    });

    return formatResponse('Appointment updated successfully', updatedAppointment);
  }

  async deleteAppointment(id: string): Promise<any> {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    await this.prisma.appointment.delete({ where: { id } });

    return formatResponse('Appointment deleted successfully', null);
  }
}
