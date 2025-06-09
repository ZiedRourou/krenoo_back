// env.validation.ts

import { IsNotEmpty, IsString } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Logger } from '@nestjs/common';
import { exit } from 'process';

export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  DATABASE_URL: string;
}

export function validateEnv(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(
        EnvironmentVariables,
        config, 
        {enableImplicitConversion: true,}
    );

    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        new Logger(validateEnv.name).error(errors.toString());
        exit(1);
    }

    return validatedConfig;
}
