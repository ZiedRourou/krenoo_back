import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';


@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwtRefresh') {
  
  
  constructor(
    private readonly  userService: UserService,
    private readonly  configService: ConfigService
  ) {
    const JWT_SECRET = configService.get<string>('JWT_SECRET')!; 
    console.log('jwt refresh');
    
    super({
      jwtFromRequest:  ExtractJwt.fromExtractors([
        (req: Request) => {
          const token = req?.cookies?.['refresh_token'];
          if (!token) {
            throw new UnauthorizedException('Refresh token manquant');
          }
          return token;
        },
      ]),
      secretOrKey: JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: { sub: string }) {
    console.log('tyvuybiunoiok');
    
    const userId = payload.sub;

    const user = await this.userService.getUser(userId);
    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable via refresh');
    }
    return user;
  }
}
