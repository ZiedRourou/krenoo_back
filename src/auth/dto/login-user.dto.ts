
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginUserDto {
    
  @IsEmail({},{
    message:"vous devez fournir une adresse mail valide"
  })
  email: string;

  @IsNotEmpty()
  @MinLength(3, {message: "min 8 caractères "})
  password: string;
}
