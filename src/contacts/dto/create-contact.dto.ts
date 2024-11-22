import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Roles } from 'src/common/enums/roles.enum';
import { LatLng } from 'src/common/interfaces/region.interface';

export class CreateContactDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  number: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @IsOptional()
  @Type(() => File)
  image?: File;

  @IsNotEmpty()
  @IsEnum(Roles)
  role: Roles;

  // @IsNotEmpty()
  @IsOptional()
  @Type(() => Object)
  location: LatLng;
}
