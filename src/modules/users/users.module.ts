import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { AdminSeeder } from '../../common/seeder/admin.seeder';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, AdminSeeder],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}