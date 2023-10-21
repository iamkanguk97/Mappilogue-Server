// @Length(
//     1,
//     30,
//     getValidatorOption(
//       ScheduleAreaExceptionCodeNumber.ScheduleAreaNameLengthError,
//     ),
//   )
//   @IsString(getValidatorOption(CommonExceptionCodeNumber.MustStringType))
//   @IsNotEmpty(
//     getValidatorOption(ScheduleAreaExceptionCodeNumber.ScheduleAreaNameEmpty),
//   )
//   readonly name!: string;

//   @Length(
//     1,
//     100,
//     getValidatorOption(
//       ScheduleAreaExceptionCodeNumber.StreetAddressLengthError,
//     ),
//   )
//   @IsString(getValidatorOption(CommonExceptionCodeNumber.MustStringType))
//   @IsNotEmpty(
//     getValidatorOption(ScheduleAreaExceptionCodeNumber.StreetAddressEmpty),
//   )
//   readonly streetAddress!: string;

//   @IsString(getValidatorOption(CommonExceptionCodeNumber.MustStringType))
//   @IsNotEmpty(getValidatorOption(ScheduleAreaExceptionCodeNumber.LatitudeEmpty))
//   readonly latitude!: string;

//   @IsString(getValidatorOption(CommonExceptionCodeNumber.MustStringType))
//   @IsNotEmpty(getValidatorOption(ScheduleAreaExceptionCodeNumber.LatitudeEmpty))
//   readonly longitude!: string;

//   @Matches(
//     REGEX_AREA_TIME,
//     getValidatorOption(ScheduleAreaExceptionCodeNumber.AreaTimeFormatError),
//   )
//   @IsString(getValidatorOption(CommonExceptionCodeNumber.MustStringType))
//   @IsOptional()
//   readonly time?: string;

export class ScheduleAreaDto {}
