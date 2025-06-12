import { Body, Controller, Post , Get, UseGuards, Res, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { lostPasswordDto } from './dto/lostPassword-user.dto';
import { Response, Request } from 'express';



export type AuthBody = {email:string; password: string}

@Controller('auth')

export class AuthController {
    constructor(
        private readonly authService: AuthService, 
    ){}
    
    @Post('login')
    login(@Body() loginDto: LoginUserDto , @Res({ passthrough: true }) res :Response ) {
        console.log(res);
        
        return this.authService.login(loginDto , res);
    }


    @Post('register')
    register(@Body() registerDto: CreateUserDto , @Res({ passthrough: true }) res : Response ) {
        return this.authService.register(registerDto , res);
    }
    
    
    @UseGuards(JwtAuthGuard)   
    @Get()
    authenticateUser(@Req() req: Request) {   
        console.log('auth get');
            
        return req.user
    }

    
    @UseGuards(AuthGuard('jwtRefresh'))
    @Post('refresh-token')
    refreshToken( @Req() req : Request, @Res({ passthrough: true }) res : Response ) {   
        return this.authService.refreshAccessToken(req.user , res);
    }

    @Post('lost-password')
    lostPassword(@Body() lostPasswordDto: lostPasswordDto , @Res({ passthrough: true }) res : Response ){
        return this.authService.lostPassword(lostPasswordDto, res)
    }
}

