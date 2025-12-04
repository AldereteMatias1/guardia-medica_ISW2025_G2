import { Controller,  Post, Body, Get} from '@nestjs/common';
import { LoginAuthDto } from '../auth/dto/login.dto';
import { AuthService } from '../../src/auth/service/auth.service';
import { CreateUserDto } from '../../src/business/usuario/dto/create.user.dto';
import { Public } from '../../src/auth/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/register')
  register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }
  @Public()
  @Post('/login')
  login(@Body() credentials: LoginAuthDto) {
    return this.authService.login(credentials);
  }

}
