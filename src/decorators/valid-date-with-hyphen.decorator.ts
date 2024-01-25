import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { REGEX_DATE } from 'src/common/regex';
import { getLastDate } from 'src/helpers/date.helper';

/**
 * @summary YYYY-MM-DD 형식의 날짜 유효성 및 형태 확인
 * @author  Jason
 * @example @IsValidDateWithHyphen()
 */
@ValidatorConstraint({ name: 'IsValidDateWithHyphen', async: false })
export class IsValidDateWithHyphenConstraint
  implements ValidatorConstraintInterface
{
  validate(value: string): boolean {
    if (!REGEX_DATE.test(value)) {
      return false;
    }

    const [year, month, day] = value.split('-').map(Number);
    return (
      year >= 1960 &&
      year <= 9999 &&
      month >= 1 &&
      month <= 12 &&
      day >= 1 &&
      day <= getLastDate(year, month)
    );
  }

  defaultMessage(args?: ValidationArguments): string {
    return `The keys of date ${args?.property} must be yyyy-mm-dd format && valid year,month and date`;
  }
}

export function IsValidDateWithHyphen(
  validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidDateWithHyphen',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidDateWithHyphenConstraint,
    });
  };
}
