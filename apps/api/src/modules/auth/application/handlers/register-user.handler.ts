import { Inject, Injectable } from '@nestjs/common';
import { err, ok, type Result } from 'neverthrow';

import {
  AuthErrors,
  Email,
  Password,
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

export interface RegisterUserInput {
  readonly email: string;
  readonly name: string;
  readonly password: string;
}

export interface RegisterUserOutput {
  readonly user: {
    readonly id: string;
    readonly email: string;
    readonly name: string;
    readonly avatarUrl: string | null;
  };
  readonly tokens: AuthTokens;
}

@Injectable()
export class RegisterUserHandler {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
    @Inject(TOKEN_SERVICE) private readonly tokenService: TokenService
  ) {}

  async execute(
    input: RegisterUserInput
  ): Promise<Result<RegisterUserOutput, AuthDomainError>> {
    const emailResult = Email.create(input.email);
    if (emailResult.isErr()) {
      return err(emailResult.error);
    }
    const email = emailResult.value;

    const passwordResult = Password.create(input.password);
    if (passwordResult.isErr()) {
      return err(passwordResult.error);
    }

    const emailExists = await this.userRepository.emailExists(email);
    if (emailExists) {
      return err(AuthErrors.emailAlreadyExists(email.value));
    }

    const hashResult = await this.passwordHasher.hash(input.password);
    if (hashResult.isErr()) {
      return err(hashResult.error);
    }

    const createResult = await this.userRepository.create({
      email: email.value,
      name: input.name,
      passwordHash: hashResult.value,
    });
    if (createResult.isErr()) {
      return err(createResult.error);
    }
    const user = createResult.value;

    const tokensResult = await this.tokenService.generateTokens(
      UserId.fromTrusted(user.id),
      user.email
    );
    if (tokensResult.isErr()) {
      return err(tokensResult.error);
    }

    return ok({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      tokens: tokensResult.value,
    });
  }
}
