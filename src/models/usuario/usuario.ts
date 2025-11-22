export enum RolUsuario {
  MEDICO = 'medico',
  ENFERMERO = 'enfermero',
}

export class Usuario {
    id?: number;
  email: string;
  password?: string;
  rol: RolUsuario;

    public constructor(email: string, rol: RolUsuario);
    public constructor(email: string, password: string, rol: RolUsuario);

    public constructor(email: string, param2: string | RolUsuario, param3?: RolUsuario) {
        this.email = email;

        if (typeof param2 === 'string' && param3 !== undefined) {
            this.password = param2; 
            this.rol = param3;      
        } else if (typeof param2 !== 'string' && param3 === undefined) {
            this.password = undefined; 
            this.rol = param2;         
        } else {
            throw new Error("Constructor de Usuario llamado con argumentos inválidos.");
        }
    }

}

