import fetch from 'node-fetch'
import { KopeechkaError } from './error'
import { StatusCodes } from './enum'
import type * as type from './types'

class Kopeechka {
  private readonly baseUrl: string
  private readonly token: string
  id: string
  address: string

  constructor(clientKey: string) {
    this.baseUrl = 'https://api.kopeechka.store'
    this.token = clientKey
    this.id = ''
    this.address = ''
  }

  // Account

  /** Returns the account balance. */
  public async getBalance(): type.BalanceResult {
    const res = await this.send('/user-balance')
    if (!res.success) throw new KopeechkaError(res.message)

    return res.data.balance
  }

  // Address

  /** Gets email address (creates a new task). */
  public async getAddress(
    options: type.IGetAddressOptions
  ): type.AddressResult {
    const params = this.cleanParams({
      site: options.website,
      mail_type: options.domains,
      sender: options.filter?.sender,
      subject: options.filter?.subject,
      soft: 7
    })

    const res = await this.send('/mailbox-get-email', params)
    if (!res.success) throw new KopeechkaError(res.message)

    this.id = res.data.id
    this.address = res.data.mail

    return this.address
  }

  /** Re-uses an email address (creates new task). */
  public async reuseAddress(
    options: type.IReuseAddressOptions
  ): type.ReuseAddressResult {
    const params = this.cleanParams({
      site: options.website,
      email: options.address ?? this.address
    })

    const res = await this.send('/mailbox-reorder', params)
    if (!res.success) throw new KopeechkaError(res.message)

    this.id = res.data.id
    this.address = res.data.mail

    return true
  }

  /** Releases the email address (cancels task). */
  public async releaseAddress(id?: string): type.ReleaseAddressResult {
    const params = this.cleanParams({ id: id ?? this.id })

    const res = await this.send('/mailbox-cancel', params)
    if (!res.success) throw new KopeechkaError(res.message)

    this.id = ''
    this.address = ''

    return true
  }

  // Message

  /** Retrieves the message resource. */
  public async getMessage(
    options: type.IGetMessageOptions = {}
  ): type.MessageResult {
    const { timeout = 120000, delay = 10000, full=0 } = options

    const params = { id: options.id ?? this.id, full: full }
    const timings = { timeout, delay }

    const res = await this.waitMessage(params, timings)
    if (!res.success) throw new KopeechkaError(res.message)

    if(full===1) {
      return res.data.fullmessage
    }else{
      return res.data.value
    }
  }

  private async waitMessage(
    params: any,
    timings: { timeout: number; delay: number; start?: number; end?: number }
  ): type.ApiResponse {
    let { start = 0, end = 0, delay, timeout } = timings
    start ??= Date.now()
    end ??= start + timeout

    const res = await this.send('/mailbox-get-message', params)
    if (res.message === 'WAIT_LINK' && end > Date.now() + delay) {
      await this.wait(delay)
      return await this.waitMessage(params, timings)
    }

    return res
  }

  // Domain

  /** Returns a list of domains. */
  public async getDomains(
    options: type.IGetDomains = {
      temp: true,
      popular: true
    }
  ): type.DomainsResult {
    let tempDomains: any = []
    if (options.temp === true) {
      tempDomains = await this.getTempDomains(options.website)
      tempDomains = tempDomains.map((d: string) => ({ name: d }))
    }

    let popularDomains: any = []
    if (options.popular === true) {
      popularDomains = await this.getPopularDomains(options.website)
    }

    return [...popularDomains, ...tempDomains]
  }

  /** Retrieves popular domains resource. */
  public async getPopularDomains(website?: string): type.PopularDomainsResult {
    const params = this.cleanParams({
      site: website,
      popular: 1
    })

    const res = await this.send('/mailbox-zones', params)
    if (!res.success) throw new KopeechkaError(res.message)

    return res.data.popular
  }

  /** Retrieves temporary domains resource. */
  public async getTempDomains(website?: string): type.TemporaryDomainsResult {
    const params = this.cleanParams({
      site: website
    })

    const res = await this.send('/mailbox-get-domains', params)
    if (!res.success) throw new KopeechkaError(res.message)

    return res.data.domains
  }

  // Task

  /** Finds the task id. */
  public async findTaskId(options: type.IFindTaskIdOptions): type.TaskIdResult {
    const params = this.cleanParams({
      site: options.website,
      email: options.address
    })

    const res = await this.send('/mailbox-get-fresh-id', params)
    if (!res.success) throw new KopeechkaError(res.message)

    return res.data.id
  }

  /** Finds tasks. */
  public async findTasks(
    options: type.IFindTasksOptions = {}
  ): type.TasksResult {
    const params = this.cleanParams({
      site: options.website,
      comment: options.comment,
      email: options.address,
      count: options.limit
    })

    const res = await this.send('/mailbox-get-bulk', params)
    if (!res.success) throw new KopeechkaError(res.message)

    return res.data.items
  }

  // Helper

  private async wait(ms: number = 0): Promise<void> {
    return await new Promise((resolve) => setTimeout(resolve, ms))
  }

  private cleanParams(params: any = {}): any {
    return Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v != null)
    )
  }

  private async send(path: string, params: object = {}): type.ApiResponse {
    const options = { method: 'GET', retry: { limit: 3 }, compress: true }

    const query = new URLSearchParams({
      ...params,
      token: this.token,
      type: 'JSON',
      api: '2.0'
    }).toString()

    const url = `${this.baseUrl}${path}?${query}`

    const res: Response = await this.request(url, options)
    const data: any = await res.json().catch(() => null)

    if (data == null) throw new Error('Incorrect server response received')

    return {
      success: data.status === StatusCodes.ok,
      message: data.status === StatusCodes.ok ? 'ok' : data.value,
      data
    }
  }

  private async request(url: string, options: any): Promise<any> {
    const { retry = { limit: 3 }, ...requestOptions } = options

    retry.attempts ??= 0
    retry.attempts++

    const timeout: any = {}
    timeout.controller = new AbortController()
    timeout.id = setTimeout(() => timeout.controller.abort(), 10000)
    requestOptions.signal = timeout.controller.signal

    const res: Response | null = await fetch(url, requestOptions)
      .then((res: any) => {
        clearTimeout(timeout.id)
        return res
      })
      .catch(() => null)
    if (res?.ok === true) return res

    if (retry.attempts < retry.limit) {
      await this.wait(Math.pow(2, retry.attempts) * 1000 + 100)
      return await this.request(url, { retry, ...requestOptions })
    }

    throw new Error('Request failed')
  }
}

export default Kopeechka
