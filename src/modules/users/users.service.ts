import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  create(user: Partial<User>) {
    return this.userRepo.save(user);
  }

 async updateRole(
  userId: string,
  newRole: Role,
  currentUserRole: Role,
) {
  const roleHierarchy = {
    SUPERADMIN: 4,
    ADMIN: 3,
    AUTHOR: 2,
    USER: 1,
  };

  const currentLevel = roleHierarchy[currentUserRole];
  const newLevel = roleHierarchy[newRole];

  if (newLevel >= currentLevel) {
    throw new Error('You cannot assign this role');
  }

  await this.userRepo.update(userId, { role: newRole });

  return { message: 'User role updated successfully' };
}
}