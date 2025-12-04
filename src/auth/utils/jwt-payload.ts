export interface JwtPayload {
  email: string;
  rol: string;
  idProfesional: number;
  iat?: number;
  exp?: number;
}