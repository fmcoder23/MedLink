import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, Query } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create.dto';
import { DoctorLoginDto } from './dto/login.dto';
import { UpdateDoctorDto } from './dto/update.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/common/enums/role.enum';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Doctor')
@Controller('doctor')
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorService.create(createDoctorDto);
  }

  @Post('login')
  login(@Body() payload: DoctorLoginDto) {
    return this.doctorService.login(payload);
  }

  @Get('me')
  @Roles(UserRole.DOCTOR)
  findCurrentDoctor(@Req() req: any) {
    const doctorId = req.user.id;
    return this.doctorService.findCurrentDoctor(doctorId);
  }

  @Put('me')
  @Roles(UserRole.DOCTOR)
  updateMe(@Req() req: any, @Body() updateDoctorDto: UpdateDoctorDto) {
    const doctorId = req.user.id;
    return this.doctorService.updateMe(doctorId, updateDoctorDto);
  }

  @Get()
  @ApiQuery({ name: 'regionId', required: false, type: String })
  @ApiQuery({ name: 'specialization', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String, enum: ['top-rated'] })
  findAll(
    @Query('regionId') regionId?: string,
    @Query('specialization') specialization?: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
    @Query('sortBy') sortBy?: string,
  ) {
    return this.doctorService.findAll({ regionId, specialization,limit,page, sortBy });
  }

  @Get('by-city')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER)
   findDoctorsByCityAndCategory(
    @Query('city') city: string,
    @Query('category') category: string,
  ) {
    return this.doctorService.findDoctorsByCityAndCategory(city, category);
  }

  

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.USER)
  findOne(@Param('id') id: string) {
    return this.doctorService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorService.update(id, updateDoctorDto);
  }

  

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.doctorService.remove(id);
  }
}
