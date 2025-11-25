import { CreateUserDto } from "../../../src/business/usuario/dto/create.user.dto";
import { LoginAuthDto } from "../dto/login.dto";


export interface IAuthService {
    register(user: CreateUserDto) : void;
    login(credentials: LoginAuthDto): void;
} 