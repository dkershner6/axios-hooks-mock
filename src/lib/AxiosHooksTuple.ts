import { ResponseValues, RefetchOptions } from 'axios-hooks';
import { AxiosRequestConfig, AxiosPromise } from 'axios';

/** This is the actual type of the response to a call to useAxios() */
type AxiosHooksTuple = [
    ResponseValues<unknown>,
    (
        config?: AxiosRequestConfig | string,
        options?: RefetchOptions
    ) => AxiosPromise<unknown>
];

export default AxiosHooksTuple;
