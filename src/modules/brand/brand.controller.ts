import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { BrandService } from './brand.service';
import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { UpdateBrandStatusDto } from './dto/update-status.dto';

@Controller('brands')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  create(@Body() dto: CreateBrandDto, @Request() req) {
    return this.brandService.create(dto, req.user);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  findAll() {
    return this.brandService.findAll();
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.USER)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBrandDto,
    @Request() req,
  ) {
    return this.brandService.update(id, dto, req.user);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBrandStatusDto,
  ) {
    return this.brandService.changeStatus(id, dto.status);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.remove(id);
  }
}
