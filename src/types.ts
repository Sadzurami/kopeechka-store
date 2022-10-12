/** getBalance() */
export type BalanceResult = Promise<number>

/** getAddress() */
export type AddressResult = Promise<string>
export interface IGetAddressOptions {
  /**
   * The website for which the address is ordered.
   * @example twitter.com, discord.com, facebook.com.
   */
  website: string
  /**
   * Preferred address domains.
   * @example gmail.com, abc.ga.
   */
  domains?: string[] | string
  /**
   * Message filtering options.
   */
  filter?: IFilterMessageProperties
}
interface IFilterMessageProperties {
  /**
   * Sender of the message.
   */
  sender?: string
  /**
   * The subject of the message.
   */
  subject?: string
}

/** reuseAddress() */
export type ReuseAddressResult = Promise<boolean>
export interface IReuseAddressOptions {
  /**
   * The website for which the address is ordered.
   * @example twitter.com, discord.com, facebook.com.
   */
  website: string
  /**
   * Earlier received email address.
   * @example abc@gmail.com.
   */
  address?: string
}

/** releaseAddress() */
export type ReleaseAddressResult = Promise<boolean>

/** getMessage() */
export type MessageResult = Promise<string>
export interface IGetMessageOptions {
  /**
   * Task id.
   */
  id?: string
  /**
   * Waiting timeout in ms.
   */
  timeout?: number
  /**
   * Delay between requests in ms.
   */
  delay?: number
}

/** getDomains() */
export type DomainsResult = Promise<IDomainResponse[]>
interface IDomainResponse {
  /**
   * Name of domain.
   */
  name: string
  /**
   * The cost of the domain.
   */
  cost?: string
  /**
   * Available in stock.
   */
  count?: string
}
export interface IGetDomains {
  /**
   * Retrieves temporary domains resource.
   * @example *.ga, *.ml, *.tk, *.info, *.site.
   */
  temp?: boolean
  /**
   * Retrieves popular domains resource.
   * @example gmail.com, outlook.com, yahoo.com, aol.com.
   */
  popular?: boolean
  /**
   * The website for which domains are available.
   * @example twitter.com, discord.com, facebook.com.
   */
  website?: string
}

/** getPopularDomains() */
export type PopularDomainsResult = Promise<IPopularDomain[]>
interface IPopularDomain {
  /**
   * Name of domain.
   */
  name: string
  /**
   * The cost of the domain.
   */
  cost: string
  /**
   * Available in stock.
   */
  count: string
}

/** getTempDomains() */
export type TemporaryDomainsResult = Promise<string[]>

/** findTaskId() */
export type TaskIdResult = Promise<string>
export interface IFindTaskIdOptions {
  /**
   * The website for which the address is ordered.
   * @example twitter.com, discord.com, facebook.com.
   */
  website: string
  /**
   * Earlier received email address.
   * @example abc@gmail.com.
   */
  address: string
}

/** findTasks() */
export type TasksResult = Promise<ITask[]>
interface ITask {
  /**
   * Task comment.
   */
  comment: string | null
  /**
   * Task date.
   * @example 1665406735.
   */
  date: number
  /**
   * Task email address.
   * @example abc@gmail.com.
   */
  email: string
  /**
   * Task id.
   * @example 1434984329.
   */
  id: string
  /**
   * Task website.
   * @example twitter.com, discord.com, facebook.com.
   */
  service: string
  /**
   * Task status.
   * @example READY, DONE, CANCELED
   */
  status: string
  /**
   * Pre-parsed value from message.
   */
  value: string | null
}
export interface IFindTasksOptions {
  /**
   * Task website.
   * @example twitter.com, discord.com, facebook.com.
   */
  website?: string
  /**
   * Task comment.
   */
  comment?: string
  /**
   * Earlier received email address.
   * @example abc@gmail.com.
   */
  address?: string
  /**
   * The number of returned tasks.
   */
  limit?: number
}

/** send() */
export type ApiResponse = Promise<IApiResponse>
interface IApiResponse {
  /**
   * Request status.
   */
  success: boolean
  /**
   * Requst message.
   */
  message: string
  /**
   * Request data.
   */
  data: any
}
