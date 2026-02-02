import { Inject, Injectable } from '@nestjs/common';
import { err, ok, type Result } from 'neverthrow';

import {
  AuthErrors,
  Email,
  PASSWORD_HASHER,
  TOKEN_SERVICE,
  USER_REPOSITORY,
  UserId,
  type AuthDomainError,
  type AuthTokens,
  type PasswordHasher,
  type TokenService,
  type UserRepository,
} from '../../domain';

export interface ValidateUserInput {
  readonly email: string;
  readonly password: string;
}

export interface ValidatedUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly avatarUrl: string | null;
}

export interface LoginUserOutput {
  readonly user: ValidatedUser;
  readonly tokens: AuthTokens;
}

@Injectable()
export class LoginUserHandler {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
    @Inject(TOKEN_SERVICE) private readonly tokenService: TokenService
  ) {}

  async validateCredentials(
    input: ValidateUserInput
  ): Promise<Result<ValidatedUser, AuthDomainError>> {
    const emailResult = Email.create(input.email);
    if (emailResult.isErr()) {
      return err(AuthErrors.invalidCredentials());
    }
    const email = emailResult.value;

    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.passwordHash) {
      return err(AuthErrors.invalidCredentials());
    }

    const verifyResult = await this.passwordHasher.verify(
      input.password,
      user.passwordHash
    );
    if (verifyResult.isErr()) {
      return err(AuthErrors.invalidCredentials());
    }
    if (!verifyResult.value) {
      return err(AuthErrors.invalidCredentials());
    }

    return ok({
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
    });
  }

  async login(
    user: ValidatedUser
  ): Promise<Result<LoginUserOutput, AuthDomainError>> {
    const tokensResult = await this.tokenService.generateTokens(
      UserId.fromTrusted(user.id),
      user.email
    );
    if (tokensResult.isErr()) {
      return err(tokensResult.error);
    }

    return ok({
      user,
      tokens: tokensResult.value,
    });
  }
}
