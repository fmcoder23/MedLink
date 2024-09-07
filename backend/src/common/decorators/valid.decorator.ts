import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
  } from 'class-validator';
  import { isUUID } from 'class-validator';
  
  export function IsUUIDOrStringArray(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isUUIDOrStringArray',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            if (!Array.isArray(value)) {
              return false;
            }
            return value.every((item) => {
              return isUUID(item, '4') || typeof item === 'string';
            });
          },
          defaultMessage(args: ValidationArguments) {
            return 'Each value in $property must be either a valid UUID or a string.';
          },
        },
      });
    };
  }
  