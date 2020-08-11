import React, { ReactElement } from 'react';
import useAxios from 'axios-hooks';
import { AxiosRequestConfig } from 'axios';

export const GET_API_ROUTE: AxiosRequestConfig = {
    url: 'https://api.com/api/123',
    method: 'GET'
};
export const POST_API_ROUTE: AxiosRequestConfig = {
    url: 'https://api.com/api/123',
    method: 'POST',
    data: 'test'
};
export const PUT_API_ROUTE: AxiosRequestConfig = {
    url: 'https://api.com/api/123',
    method: 'PUT',
    data: 'test'
};
export const PATCH_API_ROUTE: AxiosRequestConfig = {
    url: 'https://api.com/api/123',
    method: 'PATCH',
    data: 'test'
};
export const DELETE_API_ROUTE: AxiosRequestConfig = {
    url: 'https://api.com/api/123',
    method: 'DELETE'
};

const MethodsTestComponent = (): ReactElement => {
    const [{ data: dataGet }, refetchGet] = useAxios(GET_API_ROUTE);
    const [{ data: dataPost }, refetchPost] = useAxios(POST_API_ROUTE);
    const [{ data: dataPut }, refetchPut] = useAxios(PUT_API_ROUTE);
    const [{ data: dataPatch }, refetchPatch] = useAxios(PATCH_API_ROUTE);
    const [{ data: dataDelete }, refetchDelete] = useAxios(DELETE_API_ROUTE);

    return (
        <div>
            {dataGet ? (
                <p data-testid="dataGet">{JSON.stringify(dataGet)}</p>
            ) : null}
            <button onClick={() => refetchGet()} data-testid="refetchGet">
                Refetch Get
            </button>
            {dataPost ? (
                <p data-testid="dataPost">{JSON.stringify(dataPost)}</p>
            ) : null}
            <button onClick={() => refetchPost()} data-testid="refetchPost">
                Refetch Post
            </button>
            {dataPut ? (
                <p data-testid="dataPut">{JSON.stringify(dataPut)}</p>
            ) : null}
            <button onClick={() => refetchPut()} data-testid="refetchPut">
                Refetch Put
            </button>
            {dataPatch ? (
                <p data-testid="dataPatch">{JSON.stringify(dataPatch)}</p>
            ) : null}
            <button onClick={() => refetchPatch()} data-testid="refetchPatch">
                Refetch Patch
            </button>
            {dataDelete ? (
                <p data-testid="dataDelete">{JSON.stringify(dataDelete)}</p>
            ) : null}
            <button onClick={() => refetchDelete()} data-testid="refetchDelete">
                Refetch Delete
            </button>
        </div>
    );
};

export default MethodsTestComponent;
