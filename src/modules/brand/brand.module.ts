import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { User } from '../users/entities/user.entity';
import { MailService } from 'src/common/mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Brand, User])
  ],
  providers: [BrandService, MailService],
  controllers: [BrandController],
})
export class BrandModule {}
