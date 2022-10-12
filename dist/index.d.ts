import type * as type from './types';
declare class Kopeechka {
    private readonly baseUrl;
    private readonly token;
    id: string;
    address: string;
    constructor(clientKey: string);
    /** Returns the account balance. */
    getBalance(): type.BalanceResult;
    /** Gets email address (creates a new task). */
    getAddress(options: type.IGetAddressOptions): type.AddressResult;
    /** Re-uses an email address (creates new task). */
    reuseAddress(options: type.IReuseAddressOptions): type.ReuseAddressResult;
    /** Releases the email address (cancels task). */
    releaseAddress(id?: string): type.ReleaseAddressResult;
    /** Retrieves the message resource. */
    getMessage(options?: type.IGetMessageOptions): type.MessageResult;
    private waitMessage;
    /** Returns a list of domains. */
    getDomains(options?: type.IGetDomains): type.DomainsResult;
    /** Retrieves popular domains resource. */
    getPopularDomains(website?: string): type.PopularDomainsResult;
    /** Retrieves temporary domains resource. */
    getTempDomains(website?: string): type.TemporaryDomainsResult;
    /** Finds the task id. */
    findTaskId(options: type.IFindTaskIdOptions): type.TaskIdResult;
    /** Finds tasks. */
    findTasks(options?: type.IFindTasksOptions): type.TasksResult;
    private wait;
    private cleanParams;
    private send;
    private request;
}
export default Kopeechka;
