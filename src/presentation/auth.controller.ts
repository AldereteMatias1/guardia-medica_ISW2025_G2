import { Controller,  Post, Body, Get} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginAuthDto } from '../auth/dto/login.dto';
import { Usuario } from '../models/usuario/usuario';

@Controller('auth')
export class AuthController {
  
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() user: Usuario) {
    return this.authService.register(user);
  }

  @Post('/login')
  login(@Body() credentials: LoginAuthDto) {
    return this.authService.login(credentials);
  }

  @Get('/')
  getAllUsers() {
    return this.authService.getAllUsers();
  }

}
