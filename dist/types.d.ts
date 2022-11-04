/** getBalance() */
export declare type BalanceResult = Promise<number> | never;
/** getAddress() */
export declare type AddressResult = Promise<string> | never;
export interface IGetAddressOptions {
    /**
     * The website for which the address is ordered.
     * @example twitter.com, discord.com, facebook.com.
     */
    website: string;
    /**
     * Preferred address domains.
     * @example gmail.com, abc.ga.
     */
    domains?: string[] | string;
    /**
     * Message filtering options.
     */
    filter?: IFilterMessageProperties;
}
interface IFilterMessageProperties {
    /**
     * Sender of the message.
     */
    sender?: string;
    /**
     * The subject of the message.
     */
    subject?: string;
}
/** reuseAddress() */
export declare type ReuseAddressResult = Promise<boolean> | never;
export interface IReuseAddressOptions {
    /**
     * The website for which the address is ordered.
     * @example twitter.com, discord.com, facebook.com.
     */
    website: string;
    /**
     * Earlier received email address.
     * @example abc@gmail.com.
     */
    address?: string;
}
/** releaseAddress() */
export declare type ReleaseAddressResult = Promise<boolean> | never;
/** getMessage() */
export declare type MessageResult = Promise<string> | never;
export interface IGetMessageOptions {
    /**
     * Task id.
     */
    id?: string;
    /**
     * Waiting timeout in ms.
     */
    timeout?: number;
    /**
     * Delay between requests in ms.
     */
    delay?: number;
    /**
     * Get the full body of the message in any case.
     * Specify `false` to get only the parsed part of the message, this can be useful to save bandwidth.
     * Sometimes the server cannot parse a message, in which case the full message will be returned.
     * It's better to get the full message and parse it on your side.
     */
    full?: boolean;
}
/** getDomains() */
export declare type DomainsResult = Promise<IDomainResponse[]> | never;
interface IDomainResponse {
    /**
     * Name of domain.
     */
    name: string;
    /**
     * The cost of the domain.
     */
    cost?: string;
    /**
     * Available in stock.
     */
    count?: string;
}
export interface IGetDomains {
    /**
     * Retrieves temporary domains resource.
     * @example *.ga, *.ml, *.tk, *.info, *.site.
     */
    temp?: boolean;
    /**
     * Retrieves popular domains resource.
     * @example gmail.com, outlook.com, yahoo.com, aol.com.
     */
    popular?: boolean;
    /**
     * The website for which domains are available.
     * @example twitter.com, discord.com, facebook.com.
     */
    website?: string;
}
/** getPopularDomains() */
export declare type PopularDomainsResult = Promise<IPopularDomain[]> | never;
interface IPopularDomain {
    /**
     * Name of domain.
     */
    name: string;
    /**
     * The cost of the domain.
     */
    cost: string;
    /**
     * Available in stock.
     */
    count: string;
}
/** getTempDomains() */
export declare type TemporaryDomainsResult = Promise<string[]> | never;
/** findTaskId() */
export declare type TaskIdResult = Promise<string> | never;
export interface IFindTaskIdOptions {
    /**
     * The website for which the address is ordered.
     * @example twitter.com, discord.com, facebook.com.
     */
    website: string;
    /**
     * Earlier received email address.
     * @example abc@gmail.com.
     */
    address: string;
}
/** findTasks() */
export declare type TasksResult = Promise<ITask[]> | never;
interface ITask {
    /**
     * Task comment.
     */
    comment: string | null;
    /**
     * Task date.
     * @example 1665406735.
     */
    date: number;
    /**
     * Task email address.
     * @example abc@gmail.com.
     */
    email: string;
    /**
     * Task id.
     * @example 1434984329.
     */
    id: string;
    /**
     * Task website.
     * @example twitter.com, discord.com, facebook.com.
     */
    service: string;
    /**
     * Task status.
     * @example READY, DONE, CANCELED
     */
    status: string;
    /**
     * Pre-parsed value from message.
     */
    value: string | null;
}
export interface IFindTasksOptions {
    /**
     * Task website.
     * @example twitter.com, discord.com, facebook.com.
     */
    website?: string;
    /**
     * Task comment.
     */
    comment?: string;
    /**
     * Earlier received email address.
     * @example abc@gmail.com.
     */
    address?: string;
    /**
     * The number of returned tasks.
     */
    limit?: number;
}
/** send() */
export declare type ApiResponse = Promise<IApiResponse> | never;
interface IApiResponse {
    /**
     * Request status.
     */
    success: boolean;
    /**
     * Requst message.
     */
    message: string;
    /**
     * Request data.
     */
    data: any;
}
export {};
