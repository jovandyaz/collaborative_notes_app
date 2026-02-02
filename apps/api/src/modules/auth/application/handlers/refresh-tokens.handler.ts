import { Inject, Injectable } from '@nestjs/common';
import { err, ok, type Result } from 'neverthrow';

import {
  AuthErrors,
  TOKEN_SERVICE,
  USER_REPOSITORY,
  UserId,
  type AuthDomainError,
  type AuthTokens,
  type TokenService,
  type UserRepository,
} from '../../domain';

@Injectable()
export class RefreshTokensHandler {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(TOKEN_SERVICE) private readonly tokenService: TokenService
  ) {}

  async execute(
    refreshToken: string
  ): Promise<Result<AuthTokens, AuthDomainError>> {
    const verifyResult =
      await this.tokenService.verifyRefreshToken(refreshToken);
    if (verifyResult.isErr()) {
      return err(verifyResult.error);
    }
    const payload = verifyResult.value;

    const userId = UserId.fromTrusted(payload.sub);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      return err(AuthErrors.userNotFound(payload.sub));
    }

    const tokensResult = await this.tokenService.generateTokens(
      userId,
      payload.email
    );
    if (tokensResult.isErr()) {
      return err(tokensResult.error);
    }

    return ok(tokensResult.value);
  }
}
