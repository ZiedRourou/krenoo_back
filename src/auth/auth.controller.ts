import { Body, Controller, Post , Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-aut.guard';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

export type AuthBody = {email:string; password: string}

@Controller('auth')

export class AuthController {
    constructor(
        private readonly authService: AuthService, 
        private readonly userSevice:UserService
    ){}
    
    @Post('login')
    login(@Body() loginDto: LoginUserDto ) {
        console.log('Reçu logindto:', loginDto);

        const res= this.authService.login(loginDto);
        console.log('res controller : ' , res);
        
        return res;
    }

    // @Post('login')
    // async login(@Body() loginDto: LoginUserDto) {
    //     console.log('Login DTO reçu :', loginDto);
    //     return { access_token: 'token-test' };
    // }


  

    @Post('register')
    register(@Body() registerDto: CreateUserDto ) {
        return this.authService.register(registerDto);
    }
    
    
    @UseGuards(JwtAuthGuard)
    @Get()
    async authenticateUser(@Request() req ) {
        return await this.userSevice.getUser(req.user.userId)
    }


}

