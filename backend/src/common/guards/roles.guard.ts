import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../enums/role.enum';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { config } from '@config';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];
    let user: JwtPayload;

    try {
      user = this.jwtService.verify<JwtPayload>(token, {
        secret: config.jwt.secret
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new UnauthorizedException('You do not have the required role');
    }

    request.user = user; 
    return true;
  }
}
