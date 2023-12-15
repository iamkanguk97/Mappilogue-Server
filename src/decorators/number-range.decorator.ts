import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * @summary 두 Number 사이의 숫자인지 확인하는 Custom Decorator
 * @author  Jason
 * @example @IsNumberRange(1, 10)
 */
@ValidatorConstraint({ name: 'IsNumberRange', async: false })
export class IsNumberRangeConstraint implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments): boolean {
    const [minNum, maxNum] = args.constraints;
    return minNum <= value && maxNum >= value;
  }

  defaultMessage(args: ValidationArguments): string {
    const [minNum, maxNum] = args.constraints;
    return `The number must be between ${minNum} and ${maxNum}.`;
  }
}

export function IsNumberRange(
  number1: number,
  number2: number,
  validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [number1, number2],
      validator: IsNumberRangeConstraint,
    });
  };
}
