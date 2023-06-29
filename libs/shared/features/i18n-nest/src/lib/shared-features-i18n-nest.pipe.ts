import { ArgumentMetadata, ValidationPipe, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import {
  I18nContext,
  I18nValidationError,
  I18nValidationException,
  I18nValidationPipeOptions,
} from 'nestjs-i18n';

function validationErrorToI18n(e: ValidationError): I18nValidationError {
  return {
    property: e.property,
    children: e?.children?.map(validationErrorToI18n),
    constraints: !!e.constraints
      ? Object.keys(e.constraints).reduce((result, key) => {
          result[key] = e.constraints[key];
          return result;
        }, {})
      : {},
  };
}

const testFactory = (
  status: HttpStatus = HttpStatus.BAD_REQUEST
): ((errros: ValidationError[]) => I18nValidationException) => {
  return (errors: ValidationError[]): I18nValidationException => {
    return new I18nValidationException(
      errors.map(e => validationErrorToI18n(e)),
      status
    );
  };
};

export class CustomI18nValidationPipe extends ValidationPipe {
  public constructor(options?: I18nValidationPipeOptions) {
    super({ ...options, exceptionFactory: testFactory(options?.errorHttpStatusCode) });
  }

  protected override toValidate(metadata: ArgumentMetadata): boolean {
    const { metatype } = metadata;
    return metatype !== I18nContext && super.toValidate(metadata);
  }
}
