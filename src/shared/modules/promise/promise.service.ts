/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common'

import type { PromiseResolveParams, PromiseRetryParams } from './promise.interface'

@Injectable()
export class PromiseService {
  //   public constructor(private readonly logService: LogService) {}

  /**
   * Asynchronously wait for desired amount of milliseconds.
   * @param time
   */
  public async sleep(time: number): Promise<void> {
    await new Promise((resolve) => {
      setTimeout(resolve, time)
    })
  }

  /**
   * Wait for target promise resolution withing desired timeout.
   * On failure throw a timeout exception.
   * @param promise
   * @param timeout
   */
  public async resolveOrTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
    // this.logService.debug(`Resolving promise with ${timeout / 1000}s timeout`)

    const result = await Promise.race([
      promise,
      new Promise((reject) => {
        setTimeout(() => reject('timed out'), timeout)
      }),
    ])

    if (result === 'timed out') {
      throw new Error(`promise resolution timed out after ${timeout / 1000}s`)
    }

    // this.logService.debug('Promise resolved successfully within timeout')
    return result as T
  }

  /**
   * Runs multiple promises limiting concurrency.
   * @param params
   */
  public async resolveLimited<I, O>(params: PromiseResolveParams<I, O>): Promise<Awaited<O>[]> {
    const { data, limit, promise: method } = params
    const resolved: Promise<O>[] = []
    const executing = [] as unknown[]

    // this.logService.debug(`Resolving promises with ${limit} concurrency limit`)

    for (const item of data) {
      const p = Promise.resolve().then(() => method(item))
      resolved.push(p)

      if (limit <= data.length) {
        const e = p.then(() => executing.splice(executing.indexOf(e), 1))
        executing.push(e)

        if (executing.length >= limit) {
          await Promise.race(executing)
        }
      }
    }

    const allResolved = await Promise.all(resolved)

    // this.logService.debug(`Promises resolved successfully with ${limit} concurrency limit`)
    return allResolved
  }

  /**
   * Retry a method for configured times or until desired timeout.
   * @param params
   */
  public async retryOnRejection<T>(params: PromiseRetryParams<T>): Promise<T> {
    const { name, retries, timeout, promise, breakIf, delay } = params
    const start = Date.now()

    const txtPrefix = `${name || 'retryOnException()'}`
    // const txtRetry = retries || retries === 0 ? retries : '∞'
    // const txtTimeout = timeout ? timeout / 1000 : '∞ '

    // const msgStart = `${txtPrefix} running with ${txtRetry} retries and ${txtTimeout}s timeout`
    // this.logService.debug(msgStart)

    let tentative = 1
    let result: T

    // eslint-disable-next-line no-constant-condition, @typescript-eslint/no-unnecessary-condition
    while (true) {
      try {
        const elapsed = Date.now() - start

        result = timeout
          ? await this.resolveOrTimeout(promise(), timeout - elapsed)
          : await promise()

        break
      } catch (e) {
        const elapsed = Date.now() - start

        if (
          ((retries || retries === 0) && tentative > retries) ||
          (timeout && elapsed > timeout) ||
          breakIf?.(e)
        ) {
          if ((e as Error).message.startsWith('promise resolution timed out')) {
            ;(e as Error).message = `${txtPrefix} timed out after ${(timeout || 0) / 1000}s`
          }

          throw e as Error
        }

        tentative++

        // const txtElapsed = `${elapsed / 1000}/${txtTimeout}`
        // const msgRetry = `${txtPrefix} ${e.message} | Attempt #${tentative}/${txtRetry} | Elapsed ${txtElapsed}s`
        // this.logService.debug(msgRetry)

        await this.sleep(delay || 0)
      }
    }

    // this.logService.debug(`${txtPrefix} finished successfully`)
    return result
  }
}
