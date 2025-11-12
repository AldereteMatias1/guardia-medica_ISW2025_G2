import { LoginAuthDto } from '../../../auth/dto/login.dto';
import { CreateUserDto } from '../../../models/usuario/dto/create.user.dto';

export interface IAuthService {
  register(user: CreateUserDto): void;
  login(credentials: LoginAuthDto): void;
}
