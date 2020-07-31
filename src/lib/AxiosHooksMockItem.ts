import { AxiosRequestConfig } from 'axios';
import AxiosHooksTuple from './AxiosHooksTuple';
import AxiosHooksArray from './AxiosHooksArray';

/** This is a convenience interface for those using TypeScript to cast as needed */
export default interface AxiosHooksMockItem {
    config: AxiosRequestConfig | string;
    implementation: AxiosHooksTuple | AxiosHooksArray;
}
