import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService : UserService,
    private readonly configService : ConfigService
  ) {

    const JWT_SECRET = configService.get<string>('JWT_SECRET');
    
   console.log('strategy jwt ');
   

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET!,
    
    });
  }

  async validate(payload : {sub:string}) {
    const userId= payload.sub

    const user = await this.userService.getUser(userId)
    if (!user){
      throw new UnauthorizedException('utilisateur non trouve')
    }
    return user;
  }
}
