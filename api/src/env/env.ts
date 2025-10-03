import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';

export class Env {
  @IsString()
  DATABASE_URL: string;

  @IsString()
  AT_JWT_SECRET: string;

  @IsString()
  AT_EXPIRES_IN: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(Env, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
