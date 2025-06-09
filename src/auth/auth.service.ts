import { Injectable } from '@nestjs/common';
import  {hash, compare}  from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor ( 
        private readonly jwtService:JwtService,
        private readonly userService:UserService
    ) {}

    
    async login(loginDto: LoginUserDto) {
      const { email, password } = loginDto;
    
      const existingUser = await this.userService.existingUser(email);
    
      if (!existingUser) {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }
    
      const isPasswordValid = await this.isPasswordValid(password, existingUser.password);
    
      if (!isPasswordValid) {
        throw new UnauthorizedException('Mot de passe incorrect');
      }
    
      return this.authenticateUser(existingUser.id);
    }
    

    async register ( registerUser: CreateUserDto) {
        const {email , firstname, password } = registerUser

        const existingUser = await this.userService.existingUser(email)

        if (existingUser) {
            throw new Error("already exist")
        }
        const hashPassword = await this.hashPassword(password)

        const createdUser = await this.userService.registerUser(
            email, 
            firstname, 
            hashPassword,
        )

        return this.authenticateUser(createdUser.id)
        
    }

    async refreshAccessToken(user : any, res: Response) {
        try {
            const tokens = await this.authenticateUser(user.id)

            res.cookie('refresh_token', tokens.refresh_token, {
                httpOnly: false,
                secure: false, 
                sameSite: 'strict',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 j
            });
            
            return tokens.access_token

        }catch(err){
            throw new UnauthorizedException ('erreur refresh')
        }       


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
    private async authenticateUser(userId : string) {
        const payload = {sub : userId}
        const access_token = await this.jwtService.signAsync(payload, {expiresIn:'3d'}) 
        const refresh_token = await this.jwtService.signAsync(payload, { expiresIn: '7d' })

        return { access_token , refresh_token}
    }

    
}
