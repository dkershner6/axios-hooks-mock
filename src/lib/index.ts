import { ResponseValues, RefetchOptions } from 'axios-hooks';
import { AxiosRequestConfig, AxiosPromise, Method } from 'axios';
import querystring from 'querystring';
import AxiosHooksTuple from './AxiosHooksTuple';
import AxiosHooksArray from './AxiosHooksArray';

/**
 * The main class for the library.
 * 1. Instantiate: new AxiosHooksMock(implementations)
 * 2. Add more implementations (if needed): .get('url', implementation)
 * 3. Implement (completes the chain, creates mock implementation): .implement();
 *
 * This class is chainable, and aside from implement(), always returns itself.
 */
export default class AxiosHooksMock {
    private implementations = new Map<string, AxiosHooksTuple>();

    /**
     * Standard constructor for the class
     * @param mockItems Optional, @see AxiosHooksMockItem
     */
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

    /**
     * The only method of adding mock implementations to the greater mock class.
     * All constructors and convenience methods call this method, but this can also be called externally.
     * @param config @see AxiosRequestConfig or string
     * @param implementation @see AxiosHooksTuple - The standard output from useAxios
     */
    public addImplementation(
        config: AxiosRequestConfig | string,
        implementation: AxiosHooksTuple
    ): AxiosHooksMock {
        const { url, method } = this.detectUrlAndMethod(config);
        const compositeKey = this.buildCompositeKey(url, method);

        this.implementations.set(compositeKey, implementation);
        return this;
    }

    /**
     * Convenience method to add a get implementation
     * @param url as string
     * @param implementation @see AxiosHooksTuple - The standard output from useAxios
     */
    public get(url: string, implementation: AxiosHooksTuple): AxiosHooksMock {
        return this.addImplementation(url, implementation);
    }

    /**
     * Convenience method to add a post implementation
     * @param url as string
     * @param implementation @see AxiosHooksTuple - The standard output from useAxios
     */
    public post(url: string, implementation: AxiosHooksTuple): AxiosHooksMock {
        return this.addImplementation({ url, method: 'POST' }, implementation);
    }

    /**
     * Convenience method to add a patch implementation
     * @param url as string
     * @param implementation @see AxiosHooksTuple - The standard output from useAxios
     */
    public put(url: string, implementation: AxiosHooksTuple): AxiosHooksMock {
        return this.addImplementation({ url, method: 'PUT' }, implementation);
    }

    /**
     * Convenience method to add a patch implementation
     * @param url as string
     * @param implementation @see AxiosHooksTuple - The standard output from useAxios
     */
    public patch(url: string, implementation: AxiosHooksTuple): AxiosHooksMock {
        return this.addImplementation({ url, method: 'PATCH' }, implementation);
    }

    /**
     * Convenience method to add a delete implementation
     * @param url as string
     * @param implementation @see AxiosHooksTuple - The standard output from useAxios
     */
    public delete(
        url: string,
        implementation: AxiosHooksTuple
    ): AxiosHooksMock {
        return this.addImplementation(
            { url, method: 'DELETE' },
            implementation
        );
    }

    /**
     * Calling this completes the chain, and returns a function that can be used as a mock implementation in jest (or elsewhere).
     */
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
