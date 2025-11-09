import { Controller,  Post, Body, Get} from '@nestjs/common';
import { AuthService } from '../app/services/auth.service';
import { LoginAuthDto } from '../auth/dto/login.dto';
import { CreateUserDto } from '../../src/models/usuario/dto/create.user.dto';

@Controller('auth')
export class AuthController {
  
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }

  @Post('/login')
  login(@Body() credentials: LoginAuthDto) {
    return this.authService.login(credentials);
  }

}
