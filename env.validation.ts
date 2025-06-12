// env.validation.ts

import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Logger } from '@nestjs/common';
import { exit } from 'process';

export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  SMTP_HOST:string;

  @IsNumber()
  @IsNotEmpty()
  SMTP_PORT:number; 
  
  @IsNotEmpty()
  @IsString()
  SMTP_FROM:string;

  @IsNotEmpty()
  @IsString()
  SMTP_TO:string;
  
  @IsString()
  @IsNotEmpty()
  SMTP_USER:string;

  @IsString()
  @IsNotEmpty()
  SMTP_PASS:string;

  @IsNumber()
  @IsNotEmpty()
  PORT:number; 
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
