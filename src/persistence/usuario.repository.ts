import { IUsuarioRepositorio } from '../../src/app/interfaces/usuario/usuarios.repository';
import { Usuario } from '../../src/models/usuario/usuario';

export class UsuarioRepositorio implements IUsuarioRepositorio {
  private users: Usuario[] = [];

  registrarUsuario(user: Usuario): void {
    const exists = this.users.some((u) => u.email === user.email);
    if (exists) throw new Error('User already exists');
    this.users.push(user);
  }

  login(user: Usuario): Usuario {
    console.log('Attempting login for user:', user);
    const foundUser = this.users.find(
      (u) => u.email === user.email && u.password === user.password,
    );
    if (!foundUser) throw new Error('Invalid credentials');
    return foundUser;
  }

  obtenerPorEmail(email: string): Usuario | undefined {
    const user = this.users.find((u) => u.email === email);
    console.log('obtenerPorEmail:', email, 'found:', user);
    return user;
  }

  obtenerTodos(): Usuario[] {
    return [...this.users];
  }

  borrarPorEmail(email: string): void {
    this.users = this.users.filter((u) => u.email !== email);
  }

  clear(): void {
    this.users = [];
  }
}
