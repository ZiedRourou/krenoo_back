import { Injectable } from '@nestjs/common';
import  {hash, compare}  from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor ( 
        private readonly jwtService:JwtService,
        private readonly userService:UserService
    ) {}

    async login(loginDto: LoginUserDto) {
      const { email, password } = loginDto;
    
      const existingUser = await this.userService.existingUser(email);
      console.log('existing user:', existingUser);
    
      if (!existingUser) {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }
    
      //si desactivé le front reçoit la réponse
      const isPasswordValid = await this.isPasswordValid(password, existingUser.password);
    
      if (!isPasswordValid) {
        throw new UnauthorizedException('Mot de passe incorrect');
      }
    
      return this.authenticatUser(existingUser.id);
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
            hashPassword
        )

        return this.authenticatUser(createdUser.id)
        
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
    private async authenticatUser(userId : string) {
        const payload = {userId}
        const access_token = await this.jwtService.signAsync(payload) 
        return { access_token }
    }
}
