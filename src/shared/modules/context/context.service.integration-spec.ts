/* eslint-disable @typescript-eslint/naming-convention */

import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { ContextModule } from './context.module'
import { ContextService } from './context.service'

describe('ContextService', () => {
  let contextService: ContextService

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ContextModule],
    }).compile()

    contextService = app.get(ContextService)
  })

  describe('getRequest', () => {
    it('should read request as undefined', () => {
      const req = contextService.getRequest()
      expect(req).toBeUndefined()
    })
  })

  describe('getResponse', () => {
    it('should read response as undefined', () => {
      const res = contextService.getResponse()
      expect(res).toBeUndefined()
    })
  })

  describe('getMetadata', () => {
    it('should read metadata as undefined', () => {
      const metadata = contextService.getMetadata('dummy')
      expect(metadata).toBeUndefined()
    })
  })

  describe('getClientIp', () => {
    it('should read client ip as undefined', () => {
      const ip = contextService.getRequestIp()
      expect(ip).toBeUndefined()
    })
  })

  /*   describe('getJwtPayload', () => {
    it('should read jwt payload as undefined', () => {
      const payload = contextService.getRequestJwtPayload()
      expect(payload).toBeUndefined()
    })
  }) */
  /*
  describe('decodeJwtPayload', () => {
    it('should decode jwt payload flattening metadata claims', () => {
      // eslint-disable-next-line max-len
      const token =
        'xxx.ew0KICAiaXNzIjogImh0dHBzOi8vbW9jay5hdXRoMC5jb20vIiwNCiAgInN1YiI6ICJhdXRoMHwxMjMiLA0KICAiYXVkIjogImFiYyIsDQogICJpYXQiOiAxNjM0MTQ4MjAzLA0KICAiZXhwIjogMTYzNDMyODIwMywNCiAgImF0X2hhc2giOiAiZGVmIiwNCiAgIm5vbmNlIjogImdoaSIsDQogICJodHRwczovL21vY2suY29tL2FwcF9tZXRhZGF0YSI6IHsNCiAgICAiaWQiOiAxMjMNCiAgfSwNCiAgImh0dHBzOi8vbW9jay5jb20vdXNlcl9tZXRhZGF0YSI6IHsNCiAgICAiaWQiOiA0NTYNCiAgfQ0KfQ==.xxx'
      const payload = contextService.decodeJwtPayload(token)

      expect(payload).toStrictEqual({
        iss: 'https://mock.auth0.com/',
        sub: 'auth0|123',
        aud: 'abc',
        iat: 1_634_148_203,
        exp: 1_634_328_203,
        at_hash: 'def',
        nonce: 'ghi',
        'https://mock.com/app_metadata': {
          id: 123,
        },
        'https://mock.com/user_metadata': {
          id: 456,
        },
        app_metadata: {
          id: 123,
        },
        user_metadata: {
          id: 456,
        },
      })
    })

    it('should throw an exception for invalid payload', () => {
      const token = 'xxx.xxx.xxx'
      let err: HttpException

      try {
        contextService.decodeJwtPayload(token)
      } catch (e) {
        err = e
      }

      expect(err.getStatus()).toBe(HttpStatus.UNAUTHORIZED)
    })
  }) */
})
