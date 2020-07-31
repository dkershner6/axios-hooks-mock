import { ResponseValues, RefetchOptions } from 'axios-hooks';
import { AxiosRequestConfig, AxiosPromise, Method } from 'axios';
import querystring from 'querystring';
import AxiosHooksTuple from './AxiosHooksTuple';
import AxiosHooksArray from './AxiosHooksArray';

export default class AxiosHooksMock {
    private implementations = new Map<string, AxiosHooksTuple>();

    constructor(
        mockItems?: {
            config: AxiosRequestConfig | string;
            implementation: AxiosHooksTuple | AxiosHooksArray;
        }[]
    ) {
        if (mockItems) {
            mockItems.forEach((mockItem) => {
                this.addImplementation(
                    mockItem.config,
                    mockItem.implementation as AxiosHooksTuple
                );
            });
        }
    }

    /** Alternate constructor for those who hate the 'new' keyword. */
    public static construct(
        mockItems?: {
            config: AxiosRequestConfig | string;
            implementation: AxiosHooksTuple | AxiosHooksArray;
        }[]
    ): AxiosHooksMock {
        return new AxiosHooksMock(mockItems);
    }

    private detectUrlAndMethod = (
        config: AxiosRequestConfig | string
    ): { url: string; method: Method } => {
        if (typeof config === 'string') {
            return { url: config, method: 'GET' };
        }
        const queryParamsString = config.params
            ? `?${querystring.stringify(config.params)}`
            : '';
        return {
            url: `${
                !config.url.startsWith('http') ? config.baseURL ?? '' : ''
            }${config.url}${queryParamsString}`,
            method: config.method ?? 'GET'
        };
    };

    private buildCompositeKey = (url: string, method: Method = 'GET') =>
        `${method.toUpperCase()}|${url}`;

    public addImplementation(
        config: AxiosRequestConfig | string,
        implementation: AxiosHooksTuple
    ): AxiosHooksMock {
        const { url, method } = this.detectUrlAndMethod(config);
        const compositeKey = this.buildCompositeKey(url, method);

        this.implementations.set(compositeKey, implementation);
        return this;
    }

    public get(url: string, implementation: AxiosHooksTuple): AxiosHooksMock {
        return this.addImplementation(url, implementation);
    }

    public post(url: string, implementation: AxiosHooksTuple): AxiosHooksMock {
        return this.addImplementation({ url, method: 'POST' }, implementation);
    }

    public patch(url: string, implementation: AxiosHooksTuple): AxiosHooksMock {
        return this.addImplementation({ url, method: 'PATCH' }, implementation);
    }

    public delete(
        url: string,
        implementation: AxiosHooksTuple
    ): AxiosHooksMock {
        return this.addImplementation(
            { url, method: 'DELETE' },
            implementation
        );
    }

    public implement() {
        return (
            config: AxiosRequestConfig | string
        ): [
            ResponseValues<unknown>,
            (
                config?: string | AxiosRequestConfig,
                options?: RefetchOptions
            ) => AxiosPromise<unknown>
        ] => {
            const { url, method } = this.detectUrlAndMethod(config);
            const compositeKey = this.buildCompositeKey(url, method);

            const response = this.implementations.get(compositeKey);
            return response;
        };
    }
}
