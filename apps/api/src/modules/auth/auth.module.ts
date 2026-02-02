import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users';
import {
  LoginUserHandler,
  RefreshTokensHandler,
  RegisterUserHandler,
} from './application';
import { AuthController } from './auth.controller';
import { PASSWORD_HASHER, TOKEN_SERVICE, USER_REPOSITORY } from './domain';
import {
  BcryptPasswordHasher,
  DrizzleUserRepository,
  JwtTokenService,
} from './infrastructure';
import { JwtStrategy, LocalStrategy } from './strategies';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '15m'),
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    JwtStrategy,
    RegisterUserHandler,
    LoginUserHandler,
    RefreshTokensHandler,
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: TOKEN_SERVICE,
      useClass: JwtTokenService,
    },
    {
      provide: USER_REPOSITORY,
      useClass: DrizzleUserRepository,
    },
  ],
  exports: [LoginUserHandler],
})
export class AuthModule {}
