import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import {validateEnv} from '../env.validation'

@Module({
  imports: [ ConfigModule.forRoot(
    {
      isGlobal:true,
      validate:validateEnv,
    }), 
    UserModule, 
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
