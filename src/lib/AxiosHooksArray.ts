import { ResponseValues, RefetchOptions } from 'axios-hooks';
import { AxiosRequestConfig, AxiosPromise } from 'axios';

/**
 * This exists only to save people from having to properly type or cast implementations in TS testing
 * Do not use for anything besides in a Union Type
 */
type AxiosHooksArray = (
    | ResponseValues<unknown>
    | ((
          config?: AxiosRequestConfig | string,
          options?: RefetchOptions
      ) => AxiosPromise<unknown>)
)[];

export default AxiosHooksArray;
