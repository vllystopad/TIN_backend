import { plainToInstance } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsNumber()
  @IsNotEmpty()
  PORT: number;

  @IsEnum(Environment)
  @IsNotEmpty()
  NODE_ENV: Environment;

  @IsString()
  @IsNotEmpty()
  DATABASE_PATH: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRES_IN: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const missingVariables: string[] = [];
    const invalidVariables: string[] = [];

    errors.forEach((error) => {
      const property = error.property;
      const constraints = error.constraints;

      if (constraints) {
        if (constraints.isNotEmpty) {
          missingVariables.push(property);
        } else {
          invalidVariables.push(
            `${property}: ${Object.values(constraints).join(', ')}`,
          );
        }
      }
    });

    let errorMessage = '\nEnvironment validation failed!\n\n';

    if (missingVariables.length > 0) {
      errorMessage += 'Missing required environment variables:\n';
      missingVariables.forEach((variable) => {
        errorMessage += `   - ${variable}\n`;
      });
      errorMessage += '\n';
    }

    if (invalidVariables.length > 0) {
      errorMessage += 'Invalid environment variables:\n';
      invalidVariables.forEach((variable) => {
        errorMessage += `   - ${variable}\n`;
      });
      errorMessage += '\n';
    }

    errorMessage +=
      'Please check your .env file and ensure all required variables are set.\n';
    errorMessage += '   Reference: .env.example\n';

    throw new Error(errorMessage);
  }

  return validatedConfig;
}

