import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { User } from '../../modules/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Role } from '../enums/role.enum';

@Injectable()
export class AdminSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeeder.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const shouldSeed = this.configService.get<string>('SEED_ADMIN') === 'true';

    if (!shouldSeed) {
      this.logger.log('Admin seeding disabled');
      return;
    }

    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    let adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
    const adminRole =
      (this.configService.get<string>('ADMIN_ROLE') as Role) || Role.ADMIN;

    if (!adminEmail) {
      this.logger.warn('ADMIN_EMAIL not provided. Skipping admin seeding.');
      return;
    }

    const existingAdmin = await this.userRepository.findOne({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      this.logger.log('Admin already exists. Seeding skipped.');
      return;
    }

    let generatedPassword: string | null = null;

    if (!adminPassword) {
      if (nodeEnv === 'production') {
        this.logger.error(
          'ADMIN_PASSWORD must be provided in production environment.',
        );
        return;
      }

      generatedPassword = randomBytes(8).toString('hex');
      adminPassword = generatedPassword;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = this.userRepository.create({
      email: adminEmail,
      password: hashedPassword,
      role: adminRole,
    });

    await this.userRepository.save(admin);

    this.logger.log(`Default ADMIN created: ${adminEmail}`);

    if (generatedPassword && nodeEnv !== 'production') {
      this.logger.warn(
        `Generated ADMIN password (dev only): ${generatedPassword}`,
      );
    }
  }
}
