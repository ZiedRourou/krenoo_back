import { IsEmail } from 'class-validator';

export class lostPasswordDto {
  @IsEmail({},{
    message:"vous devez fournir une adresse mail valide"
  })
  email: string;
}
