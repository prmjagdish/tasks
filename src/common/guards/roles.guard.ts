import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private roleHierarchy = {
    SUPERADMIN: 4,
    ADMIN: 3,
    AUTHOR: 2,
    USER: 1,
  };

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    const userLevel = this.roleHierarchy[user.role];
    const requiredLevel = Math.max(
      ...requiredRoles.map((role) => this.roleHierarchy[role]),
    );

    return userLevel >= requiredLevel;
  }
}