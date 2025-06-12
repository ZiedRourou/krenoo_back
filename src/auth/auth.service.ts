import { Injectable } from '@nestjs/common';
import  {hash, compare}  from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { lostPasswordDto } from './dto/lostPassword-user.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
    constructor ( 
        private readonly jwtService:JwtService,
        private readonly userService:UserService
    ) {}

    
    async login(loginDto: LoginUserDto , res : Response) {
      const { email, password } = loginDto;
    
      const existingUser = await this.userService.existingUser(email);
    
      if (!existingUser) {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }
    
      const isPasswordValid = await this.isPasswordValid(password, existingUser.password);
    
      if (!isPasswordValid) {
        throw new UnauthorizedException('Mot de passe incorrect');
      }
    
      return this.authenticateUser(existingUser.id , res);
    }
    

    async register ( registerUser: CreateUserDto , res: Response) {
        const {email , password } = registerUser

        const existingUser = await this.userService.existingUser(email)

        if (existingUser) {
            throw new UnauthorizedException("Utilisateur deja existant")
        }
        const hashPassword = await this.hashPassword(password)

        const createdUser = await this.userService.registerUser(
            email, 
            hashPassword, 
        )

        return this.authenticateUser(createdUser.id , res)
        
    }

    async refreshAccessToken(user :any , res: Response) {
        try {
            console.log('userid',user.id);
     
            
            
            console.log('try refresh');
            const resposne = await this.authenticateUser(user.id , res)
            console.log(resposne);
            
            return resposne

        }catch(err){
            console.log('refresh catch');
            
            throw new UnauthorizedException ('erreur refresh')
        }       


    }

    async lostPassword(lostPasswordDto:lostPasswordDto, res:Response){
        const { email } = lostPasswordDto;
    
        const existingUser = await this.userService.existingUser(email);
      
        if (!existingUser) {
          throw new UnauthorizedException('Utilisateur non trouvé');
        }
      
        const hashPassword = await this.hashPassword(randomUUID())
      
        
      
        return this.authenticateUser(existingUser.id , res);

    }

    private async hashPassword ( password:string) {
        const hashedPassword = await hash(password,10);
        return hashedPassword;
    }
    private async isPasswordValid ( password:string, hashedPassword: string) {
        console.log('password :', password , 'hashpass : ', hashedPassword);
        if (password && hashedPassword) {
        const isPasswordValid = await compare(password, hashedPassword)
        return isPasswordValid
        } 
        
        return { access_token: 'error' };
    }
    private async authenticateUser(userId : string , res: Response) {
        
        console.log('authenticate');
        const payload = {sub : userId}
        const access_token = await this.jwtService.signAsync(payload, {expiresIn:'2m'}) 
        const refresh_token = await this.jwtService.signAsync(payload, { expiresIn: '7d' })

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true, //dev 
            secure: false, //dev
            sameSite: 'lax',
            path: '/auth/refresh-token',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 j
        });

        return { access_token , refresh_token}
    }

    
}
