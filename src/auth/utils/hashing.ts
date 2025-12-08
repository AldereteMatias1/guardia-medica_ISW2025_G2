import { Logger } from '@nestjs/common';
import * as argon2 from 'argon2';

export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
  } catch (error) {
    Logger.error('Error al generar el hash de la contraseña');
    throw error;
  }
};

export const comparePassword = async (
  providedPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    return await argon2.verify(hashedPassword, providedPassword);
  } catch (error) {
    Logger.error('Error al comparar la contraseña');
    throw error;
  }
};
