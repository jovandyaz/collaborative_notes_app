import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { FeatureFlag, FeatureFlagsService } from './feature-flags.service';

export const FEATURE_FLAG_KEY = 'feature_flag';

export const RequireFeatureFlag = (flag: FeatureFlag) =>
  SetMetadata(FEATURE_FLAG_KEY, flag);

@Injectable()
export class FeatureFlagGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly featureFlags: FeatureFlagsService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredFlag = this.reflector.getAllAndOverride<FeatureFlag>(
      FEATURE_FLAG_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredFlag) {
      return true;
    }

    if (!this.featureFlags.isEnabled(requiredFlag)) {
      throw new ForbiddenException(`Feature '${requiredFlag}' is not enabled`);
    }

    return true;
  }
}
