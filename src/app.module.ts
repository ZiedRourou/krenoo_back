import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import {validateEnv} from '../env.validation'
import { MailModule } from './mail/mail.module';

@Module({
  imports: [ ConfigModule.forRoot(
    {
      isGlobal:true,
      validate:validateEnv,
    }), 
    UserModule, 
    AuthModule, 
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
