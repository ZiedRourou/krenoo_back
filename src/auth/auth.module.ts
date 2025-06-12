import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from 'src/user/user.service';
import { JwtRefreshStrategy } from './jwtRefresh.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
      })
      
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService, 
    JwtStrategy, 
    JwtRefreshStrategy, 
    AuthService, 
    UserService,
    JwtAuthGuard
  ]
})
export class AuthModule {}

