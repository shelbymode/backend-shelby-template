export type Class = new (...args: unknown[]) => unknown
export type UnixDate = number
export type StringError = string

export enum CronEnum {
  REMOVE_EXPIRED_RT_SESSIONS = 'REMOVE_EXPIRED_RT_SESSIONS',
}
