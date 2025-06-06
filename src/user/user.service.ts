import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
    constructor (private readonly prisma: PrismaService) {}
    async getUsers(){
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                email: true, 
                firstname:true,
            },
        });
        return users;
    }
    async getUser({userId}:{userId:string}){
        const users = await this.prisma.user.findUnique({
            where: {
                id:userId,
            },
            select: {
                id: true,
                email: true, 
                firstname:true,
            },
        });
        return users;
    }

    async existingUser (email: string){
       return await this.prisma.user.findUnique({
            where : {
                email: email,
            }
        })
    }
    async registerUser (email: string , firstname:string , password: string){
        return await this.prisma.user.create({
            data: {
                email, 
                firstname,
                password
            }
        })
     }

}
