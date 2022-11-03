import fetch from 'node-fetch';

var StatusCodes;
(function (StatusCodes) {
    StatusCodes["ok"] = "OK";
    StatusCodes["error"] = "ERROR";
})(StatusCodes || (StatusCodes = {}));
var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes["BAD_TOKEN"] = "The client key is not valid.";
    ErrorCodes["BAD_SITE"] = "The \"website\" argument is not correct.";
    ErrorCodes["BAD_DOMAIN"] = "The \"domains\" argument is not correct.";
    ErrorCodes["BAD_BALANCE"] = "There are not enough funds to perform the operation.";
    ErrorCodes["OUT_OF_STOCK"] = "The requested domain is out of stock.";
    ErrorCodes["SYSTEM_ERROR"] = "Unknown, server error. Contact support.";
    ErrorCodes["TIME_LIMIT_EXCEED"] = "Address ordering limit per second has been reached.";
    ErrorCodes["NO_ACTIVATION"] = "The server could not find the task.";
    ErrorCodes["ACTIVATION_CANCELED"] = "The task was canceled.";
    ErrorCodes["WAIT_LINK"] = "Message not received.";
    ErrorCodes["bad request"] = "An incorrect request was sent.";
})(ErrorCodes || (ErrorCodes = {}));

class KopeechkaError extends Error {
    constructor(code) {
        var _a;
        // @ts-expect-error
        super((_a = ErrorCodes[code]) !== null && _a !== void 0 ? _a : code);
        this.code = code;
    }
}

class Kopeechka {
    constructor(clientKey) {
        this.baseUrl = 'https://api.kopeechka.store';
        this.token = clientKey;
        this.id = '';
        this.address = '';
    }
    // Account
    /** Returns the account balance. */
    async getBalance() {
        const res = await this.send('/user-balance');
        if (!res.success)
            throw new KopeechkaError(res.message);
        return res.data.balance;
    }
    // Address
    /** Gets email address (creates a new task). */
    async getAddress(options) {
        var _a, _b;
        const params = this.cleanParams({
            site: options.website,
            mail_type: options.domains,
            sender: (_a = options.filter) === null || _a === void 0 ? void 0 : _a.sender,
            subject: (_b = options.filter) === null || _b === void 0 ? void 0 : _b.subject,
            soft: 7
        });
        const res = await this.send('/mailbox-get-email', params);
        if (!res.success)
            throw new KopeechkaError(res.message);
        this.id = res.data.id;
        this.address = res.data.mail;
        return this.address;
    }
    /** Re-uses an email address (creates new task). */
    async reuseAddress(options) {
        var _a;
        const params = this.cleanParams({
            site: options.website,
            email: (_a = options.address) !== null && _a !== void 0 ? _a : this.address
        });
        const res = await this.send('/mailbox-reorder', params);
        if (!res.success)
            throw new KopeechkaError(res.message);
        this.id = res.data.id;
        this.address = res.data.mail;
        return true;
    }
    /** Releases the email address (cancels task). */
    async releaseAddress(id) {
        const params = this.cleanParams({ id: id !== null && id !== void 0 ? id : this.id });
        const res = await this.send('/mailbox-cancel', params);
        if (!res.success)
            throw new KopeechkaError(res.message);
        this.id = '';
        this.address = '';
        return true;
    }
    // Message
    /** Retrieves the message resource. */
    async getMessage(options = {}) {
        var _a;
        const { timeout = 120000, delay = 10000, full = 0 } = options;
        const params = { id: (_a = options.id) !== null && _a !== void 0 ? _a : this.id, full: full };
        const timings = { timeout, delay };
        const res = await this.waitMessage(params, timings);
        if (!res.success)
            throw new KopeechkaError(res.message);
        if (full === 1) {
            return res.data.fullmessage;
        }
        else {
            return res.data.value;
        }
    }
    async waitMessage(params, timings) {
        let { start = 0, end = 0, delay, timeout } = timings;
        start !== null && start !== void 0 ? start : (start = Date.now());
        end !== null && end !== void 0 ? end : (end = start + timeout);
        const res = await this.send('/mailbox-get-message', params);
        if (res.message === 'WAIT_LINK' && end > Date.now() + delay) {
            await this.wait(delay);
            return await this.waitMessage(params, timings);
        }
        return res;
    }
    // Domain
    /** Returns a list of domains. */
    async getDomains(options = {
        temp: true,
        popular: true
    }) {
        let tempDomains = [];
        if (options.temp === true) {
            tempDomains = await this.getTempDomains(options.website);
            tempDomains = tempDomains.map((d) => ({ name: d }));
        }
        let popularDomains = [];
        if (options.popular === true) {
            popularDomains = await this.getPopularDomains(options.website);
        }
        return [...popularDomains, ...tempDomains];
    }
    /** Retrieves popular domains resource. */
    async getPopularDomains(website) {
        const params = this.cleanParams({
            site: website,
            popular: 1
        });
        const res = await this.send('/mailbox-zones', params);
        if (!res.success)
            throw new KopeechkaError(res.message);
        return res.data.popular;
    }
    /** Retrieves temporary domains resource. */
    async getTempDomains(website) {
        const params = this.cleanParams({
            site: website
        });
        const res = await this.send('/mailbox-get-domains', params);
        if (!res.success)
            throw new KopeechkaError(res.message);
        return res.data.domains;
    }
    // Task
    /** Finds the task id. */
    async findTaskId(options) {
        const params = this.cleanParams({
            site: options.website,
            email: options.address
        });
        const res = await this.send('/mailbox-get-fresh-id', params);
        if (!res.success)
            throw new KopeechkaError(res.message);
        return res.data.id;
    }
    /** Finds tasks. */
    async findTasks(options = {}) {
        const params = this.cleanParams({
            site: options.website,
            comment: options.comment,
            email: options.address,
            count: options.limit
        });
        const res = await this.send('/mailbox-get-bulk', params);
        if (!res.success)
            throw new KopeechkaError(res.message);
        return res.data.items;
    }
    // Helper
    async wait(ms = 0) {
        return await new Promise((resolve) => setTimeout(resolve, ms));
    }
    cleanParams(params = {}) {
        return Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null));
    }
    async send(path, params = {}) {
        const options = { method: 'GET', retry: { limit: 3 }, compress: true };
        const query = new URLSearchParams({
            ...params,
            token: this.token,
            type: 'JSON',
            api: '2.0'
        }).toString();
        const url = `${this.baseUrl}${path}?${query}`;
        const res = await this.request(url, options);
        const data = await res.json().catch(() => null);
        if (data == null)
            throw new Error('Incorrect server response received');
        return {
            success: data.status === StatusCodes.ok,
            message: data.status === StatusCodes.ok ? 'ok' : data.value,
            data
        };
    }
    async request(url, options) {
        var _a;
        const { retry = { limit: 3 }, ...requestOptions } = options;
        (_a = retry.attempts) !== null && _a !== void 0 ? _a : (retry.attempts = 0);
        retry.attempts++;
        const timeout = {};
        timeout.controller = new AbortController();
        timeout.id = setTimeout(() => timeout.controller.abort(), 10000);
        requestOptions.signal = timeout.controller.signal;
        const res = await fetch(url, requestOptions)
            .then((res) => {
            clearTimeout(timeout.id);
            return res;
        })
            .catch(() => null);
        if ((res === null || res === void 0 ? void 0 : res.ok) === true)
            return res;
        if (retry.attempts < retry.limit) {
            await this.wait(Math.pow(2, retry.attempts) * 1000 + 100);
            return await this.request(url, { retry, ...requestOptions });
        }
        throw new Error('Request failed');
    }
}

export { Kopeechka as default };
