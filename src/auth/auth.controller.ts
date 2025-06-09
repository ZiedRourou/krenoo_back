import { Body, Controller, Post , Get, UseGuards, Request , Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';

export type AuthBody = {email:string; password: string}

@Controller('auth')

export class AuthController {
    constructor(
        private readonly authService: AuthService, 
    ){}
    
    @Post('login')
    login(@Body() loginDto: LoginUserDto ) {
        const res= this.authService.login(loginDto);
        
        return res;
    }

 

    @Post('register')
    register(@Body() registerDto: CreateUserDto ) {
        return this.authService.register(registerDto);
    }
    
    
    @UseGuards(AuthGuard('jwt'))
    @Get()
    async authenticateUser(@Request() req ) {       
        return req.user
    }

    
    @UseGuards(AuthGuard('jwtRefresh'))
    @Post('refresh-token')
    async refreshToken( @Request() req, @Res({ passthrough: true }) res ) {  
        console.log("hey");
              
        return await this.authService.refreshAccessToken(req.user , res);
    }


}

