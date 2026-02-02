import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export enum FeatureFlag {
  REAL_TIME_COLLABORATION = 'real_time_collaboration',
  PUBLIC_NOTES = 'public_notes',
  NOTE_SHARING = 'note_sharing',
  RICH_TEXT_EDITOR = 'rich_text_editor',
}

export interface FeatureFlagConfig {
  [FeatureFlag.REAL_TIME_COLLABORATION]: boolean;
  [FeatureFlag.PUBLIC_NOTES]: boolean;
  [FeatureFlag.NOTE_SHARING]: boolean;
  [FeatureFlag.RICH_TEXT_EDITOR]: boolean;
}

@Injectable()
export class FeatureFlagsService {
  private readonly flags: FeatureFlagConfig;

  constructor(private readonly configService: ConfigService) {
    this.flags = {
      [FeatureFlag.REAL_TIME_COLLABORATION]: this.getFlag(
        'FF_REAL_TIME_COLLABORATION',
        true
      ),
      [FeatureFlag.PUBLIC_NOTES]: this.getFlag('FF_PUBLIC_NOTES', true),
      [FeatureFlag.NOTE_SHARING]: this.getFlag('FF_NOTE_SHARING', true),
      [FeatureFlag.RICH_TEXT_EDITOR]: this.getFlag('FF_RICH_TEXT_EDITOR', true),
    };
  }

  private getFlag(envKey: string, defaultValue: boolean): boolean {
    const value = this.configService.get<string>(envKey);
    if (value === undefined) {
      return defaultValue;
    }
    return value.toLowerCase() === 'true';
  }

  isEnabled(flag: FeatureFlag): boolean {
    return this.flags[flag] ?? false;
  }

  getAllFlags(): FeatureFlagConfig {
    return { ...this.flags };
  }
}
