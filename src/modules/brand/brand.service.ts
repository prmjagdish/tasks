import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { BrandStatus } from '../../common/enums/brand-status.enum';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { User } from '../users/entities/user.entity';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
  ) {}

  async create(
    dto: CreateBrandDto,
    currentUser: { userId: string; role: Role },
  ): Promise<Brand> {
    const brand = this.brandRepo.create({
      ...dto,
      createdBy: { id: currentUser.userId } as User,
    });

    return await this.brandRepo.save(brand);
  }

  async findAll(): Promise<Brand[]> {
    return this.brandRepo.find({
      relations: {
        createdBy: true,
      },
    });
  }

  async update(id: number, dto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.brandRepo.findOne({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    Object.assign(brand, dto);

    return await this.brandRepo.save(brand);
  }

  async remove(id: number): Promise<{ message: string }> {
    const brand = await this.brandRepo.findOne({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    await this.brandRepo.remove(brand);

    return { message: 'Brand deleted successfully' };
  }

  async changeStatus(id: number, status: BrandStatus): Promise<Brand> {
    const brand = await this.brandRepo.findOne({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    brand.status = status;

    return await this.brandRepo.save(brand);
  }
}
