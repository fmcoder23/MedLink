import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
}
