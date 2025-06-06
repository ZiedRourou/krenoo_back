import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({},{
    message:"vous devez fournir une adresse mail valide"
  })
  email: string;

  @IsNotEmpty()
  @MinLength(8, {message: "min 8 caractères "})
  password: string;

  @IsString({
    message: 'vous devez entrer un prénom'
  })
  firstname:string;
}
