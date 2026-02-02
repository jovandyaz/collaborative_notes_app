import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import pino from 'pino';
import type { Logger, LoggerOptions } from 'pino';

@Injectable()
export class StructuredLogger implements NestLoggerService {
  private readonly isProd: boolean;
  private readonly logger: Logger;

  constructor(private readonly configService: ConfigService) {
    this.isProd = this.configService.get('NODE_ENV') === 'production';

    const pinoOptions: LoggerOptions = {
      level: this.isProd ? 'info' : 'debug',
    };

    if (!this.isProd) {
      pinoOptions.transport = {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      };
    }

    this.logger = pino(pinoOptions);
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    this.logger.info(this.formatMessage(message, optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    this.logger.error(this.formatMessage(message, optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    this.logger.warn(this.formatMessage(message, optionalParams));
  }

  debug?(message: unknown, ...optionalParams: unknown[]) {
    this.logger.debug(this.formatMessage(message, optionalParams));
  }

  verbose?(message: unknown, ...optionalParams: unknown[]) {
    this.logger.trace(this.formatMessage(message, optionalParams));
  }

  private formatMessage(
    message: unknown,
    optionalParams: unknown[]
  ): Record<string, unknown> {
    const context = optionalParams[optionalParams.length - 1];
    const params = optionalParams.slice(0, -1);

    const contextObj = typeof context === 'string' ? { context } : {};

    if (typeof message === 'object') {
      return {
        ...message,
        ...contextObj,
        params: params.length > 0 ? params : undefined,
      };
    }

    return {
      msg: message,
      ...contextObj,
      params: params.length > 0 ? params : undefined,
    };
  }
}
