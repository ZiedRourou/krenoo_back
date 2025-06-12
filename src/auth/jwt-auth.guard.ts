import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info?: Error) {
    console.log('guard jwt');
    console.log(err);
    console.log(info);
    
    
    if (err) {
      throw err;
    }

    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('TOKEN_EXPIRED');
    }
    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('TOKEN_INVALID');
    }
  
    return user;
  }
}
