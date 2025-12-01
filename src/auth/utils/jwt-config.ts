import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

const JwtModuleConfig = async () => {
  const options: JwtModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => {
        const expiresIn = configService.get<number>('JWT_EXPIRES_IN');
      return {
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: expiresIn,
        },
      };
    },
    inject: [ConfigService],
  };
  return JwtModule.registerAsync(options);
};

export default JwtModuleConfig;

