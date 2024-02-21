import type { DynamicModule } from '@nestjs/common'
import { Module, forwardRef } from '@nestjs/common'

import { PassportModule } from '@nestjs/passport'

import { SessionRedisGuard, SessionRedisLoginGuard } from '@auth-session/infrastructure/guards'
import {
  SessionRedisSerializer,
  SessionRedisStrategy,
} from '@auth-session/infrastructure/strategies'
import { AuthSessionRepositoryModule } from '@auth-session/infrastructure/repositories'

import { UsecasesProxyModule } from '@auth-session/application/usecases'

import { AuthSessionService } from './auth-session.service'

@Module({
  imports: [
    PassportModule.register({
      session: true,
    }),
    AuthSessionRepositoryModule,
    forwardRef(() => UsecasesProxyModule.register()),
  ],
})
export class AuthSessionModule {
  static SERVICE_TOKEN = 'SESSION_SERVICE_TOKEN'

  static register(): DynamicModule {
    return {
      module: AuthSessionModule,
      providers: [
        {
          provide: AuthSessionModule.SERVICE_TOKEN,
          useClass: AuthSessionService,
        },
        SessionRedisGuard,
        SessionRedisLoginGuard,
        SessionRedisStrategy,
        SessionRedisSerializer,
      ],
      exports: [AuthSessionModule.SERVICE_TOKEN],
    }
  }
}
