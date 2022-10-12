import { ErrorCodes } from './enum'

export class KopeechkaError extends Error {
  public readonly code: string

  constructor(code: string) {
    // @ts-expect-error
    super(ErrorCodes[code] ?? code)
    this.code = code
  }
}
