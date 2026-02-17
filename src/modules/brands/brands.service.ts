import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
  ) {}

  async create(dto: CreateBrandDto) {
    const existing = await this.brandRepo.findOne({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Brand already exists');

    const brand = this.brandRepo.create(dto as any);
    return this.brandRepo.save(brand);
  }

  findAll() {
    return this.brandRepo.find();
  }
}
