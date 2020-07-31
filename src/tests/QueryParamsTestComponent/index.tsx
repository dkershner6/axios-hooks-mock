import React, { ReactElement } from 'react';
import useAxios from 'axios-hooks';

export const QUERY_PARAMS_API_ROUTE_ONE = {
    baseUrl: 'https://api.com/api',
    url: '/123',
    params: { param: 'one' }
};
export const QUERY_PARAMS_API_ROUTE_TWO = {
    baseUrl: 'https://api.com/api',
    url: '/123',
    params: { param: 'two' }
};
export const QUERY_PARAMS_API_ROUTE_THREE = {
    baseUrl: 'https://api.com/api',
    url: '/123',
    params: { param: 'three' }
};

const QueryParamsTestComponent = (): ReactElement => {
    const [{ data: dataOne }, refetchOne] = useAxios(
        QUERY_PARAMS_API_ROUTE_ONE
    );
    const [{ data: dataTwo }, refetchTwo] = useAxios(
        QUERY_PARAMS_API_ROUTE_TWO
    );
    const [{ data: dataThree }, refetchThree] = useAxios(
        QUERY_PARAMS_API_ROUTE_THREE
    );

    return (
        <div>
            {dataOne ? (
                <p data-testid="dataOne">{JSON.stringify(dataOne)}</p>
            ) : null}
            <button onClick={() => refetchOne()} data-testid="refetchOne">
                Refetch One
            </button>
            {dataTwo ? (
                <p data-testid="dataTwo">{JSON.stringify(dataTwo)}</p>
            ) : null}
            <button onClick={() => refetchTwo()} data-testid="refetchTwo">
                Refetch Two
            </button>
            {dataThree ? (
                <p data-testid="dataThree">{JSON.stringify(dataThree)}</p>
            ) : null}
            <button onClick={() => refetchThree()} data-testid="refetchThree">
                Refetch Three
            </button>
        </div>
    );
};

export default QueryParamsTestComponent;
