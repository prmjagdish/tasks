import { IsEnum } from 'class-validator';
import { BrandStatus } from '../../../common/enums/brand-status.enum';

export class UpdateBrandStatusDto {
  @IsEnum(BrandStatus)
  status: BrandStatus;
}
