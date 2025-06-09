import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';


@Controller('users')
export class UserController {
    constructor (private readonly userService: UserService){}
    
    @Get()
    getUsers() {
        return this.userService.getUsers();
    }

    @Get('/:userId')
    getUser(@Query('userId') userId:string){
        return this.userService.getUser(userId)
        
    }

    
}