import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { NotesModule } from '../notes';
import { CollaborationGateway } from './collaboration.gateway';
import { CollaborationService } from './collaboration.service';
import { WsAuthService } from './ws-auth.service';

@Module({
  imports: [
    NotesModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
      }),
    }),
  ],
  providers: [CollaborationService, CollaborationGateway, WsAuthService],
  exports: [CollaborationService],
})
export class CollaborationModule {}
