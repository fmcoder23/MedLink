import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: 'Register' })
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post("login")
  @ApiOperation({ summary: 'Log in'})
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post("admin-login")
  @ApiOperation({ summary: 'Admin Log in'})
  adminLogin(@Body() body: LoginDto) {
    return this.authService.adminLogin(body);
  }
}
