import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CheckColumnInArray } from 'src/constants';
import { CheckColumnType } from 'src/types/type';

export class LoginOrSignUpRequestDto {
  @IsString()
  @IsNotEmpty()
  socialAccessToken: string;

  @IsNotEmpty()
  socialVendor: string;

  @IsString()
  @IsNotEmpty()
  fcmToken: string;

  @IsIn(CheckColumnInArray)
  @IsOptional()
  isAlarmAccept?: CheckColumnType | null;
}
