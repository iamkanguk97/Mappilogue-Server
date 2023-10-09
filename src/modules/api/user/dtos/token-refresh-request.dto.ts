import { IsNotEmpty, IsString } from 'class-validator';

export class TokenRefreshRequestDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
