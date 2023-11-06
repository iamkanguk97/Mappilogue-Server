import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MarkMainLocationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  streetAddress?: string | undefined;

  @IsString()
  @IsOptional()
  latitude?: string | undefined;

  @IsString()
  @IsOptional()
  longitude?: string | undefined;
}
