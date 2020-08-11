import React from 'react';
import MethodsTestComponent, {
    GET_API_ROUTE,
    POST_API_ROUTE,
    PATCH_API_ROUTE,
    DELETE_API_ROUTE,
    PUT_API_ROUTE
} from '.';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { mocked } from 'ts-jest/utils';
import useAxios from 'axios-hooks';
import AxiosHooksMock, { AxiosHooksMockItem } from '../../';

jest.mock('axios-hooks');

describe('Methods', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('Convenience Methods', () => {
        it('Should render four different responses', () => {
            const refetchGet = jest.fn();
            const refetchPost = jest.fn();
            const refetchPut = jest.fn();
            const refetchPatch = jest.fn();
            const refetchDelete = jest.fn();

            mocked(useAxios).mockImplementation(
                new AxiosHooksMock()
                    .get('https://api.com/api/123', [
                        { data: 'dataGet', loading: false },
                        refetchGet
                    ])
                    .post('https://api.com/api/123', [
                        { data: 'dataPost', loading: false },
                        refetchPost
                    ])
                    .put('https://api.com/api/123', [
                        { data: 'dataPut', loading: false },
                        refetchPut
                    ])
                    .patch('https://api.com/api/123', [
                        { data: 'dataPatch', loading: false },
                        refetchPatch
                    ])
                    .delete('https://api.com/api/123', [
                        { data: 'dataDelete', loading: false },
                        refetchDelete
                    ])
                    .implement()
            );

            const { getByTestId } = render(<MethodsTestComponent />);

            [
                'dataGet',
                'dataPost',
                'dataPut',
                'dataPatch',
                'dataDelete'
            ].forEach((dataString) => {
                expect(getByTestId(dataString)).toContainHTML(dataString);
            });
        });

        it('Should fire four different functions on refetches', () => {
            const refetchGet = jest.fn();
            const refetchPost = jest.fn();
            const refetchPut = jest.fn();
            const refetchPatch = jest.fn();
            const refetchDelete = jest.fn();

            mocked(useAxios).mockImplementation(
                new AxiosHooksMock()
                    .get('https://api.com/api/123', [
                        { data: 'dataGet', loading: false },
                        refetchGet
                    ])
                    .post('https://api.com/api/123', [
                        { data: 'dataPost', loading: false },
                        refetchPost
                    ])
                    .put('https://api.com/api/123', [
                        { data: 'dataPut', loading: false },
                        refetchPut
                    ])
                    .patch('https://api.com/api/123', [
                        { data: 'dataPatch', loading: false },
                        refetchPatch
                    ])
                    .delete('https://api.com/api/123', [
                        { data: 'dataDelete', loading: false },
                        refetchDelete
                    ])
                    .implement()
            );

            const { getByTestId } = render(<MethodsTestComponent />);

            expect(refetchGet).not.toHaveBeenCalled();
            expect(refetchPost).not.toHaveBeenCalled();
            expect(refetchPut).not.toHaveBeenCalled();
            expect(refetchPatch).not.toHaveBeenCalled();
            expect(refetchDelete).not.toHaveBeenCalled();

            fireEvent.click(getByTestId('refetchGet'));

            expect(refetchGet).toHaveBeenCalledTimes(1);
            expect(refetchPost).not.toHaveBeenCalled();
            expect(refetchPut).not.toHaveBeenCalled();
            expect(refetchPatch).not.toHaveBeenCalled();
            expect(refetchDelete).not.toHaveBeenCalled();

            fireEvent.click(getByTestId('refetchPost'));

            expect(refetchGet).toHaveBeenCalledTimes(1);
            expect(refetchPost).toHaveBeenCalledTimes(1);
            expect(refetchPut).not.toHaveBeenCalled();
            expect(refetchPatch).not.toHaveBeenCalled();
            expect(refetchDelete).not.toHaveBeenCalled();

            fireEvent.click(getByTestId('refetchPut'));

            expect(refetchGet).toHaveBeenCalledTimes(1);
            expect(refetchPost).toHaveBeenCalledTimes(1);
            expect(refetchPut).toHaveBeenCalledTimes(1);
            expect(refetchPatch).not.toHaveBeenCalled();
            expect(refetchDelete).not.toHaveBeenCalled();

            fireEvent.click(getByTestId('refetchPatch'));

            expect(refetchGet).toHaveBeenCalledTimes(1);
            expect(refetchPost).toHaveBeenCalledTimes(1);
            expect(refetchPut).toHaveBeenCalledTimes(1);
            expect(refetchPatch).toHaveBeenCalledTimes(1);
            expect(refetchDelete).not.toHaveBeenCalled();

            fireEvent.click(getByTestId('refetchDelete'));

            expect(refetchGet).toHaveBeenCalledTimes(1);
            expect(refetchPost).toHaveBeenCalledTimes(1);
            expect(refetchPut).toHaveBeenCalledTimes(1);
            expect(refetchPatch).toHaveBeenCalledTimes(1);
            expect(refetchDelete).toHaveBeenCalledTimes(1);
        });
    });

    describe('Implementations Array', () => {
        it('Should render four different responses', () => {
            const refetchGet = jest.fn();
            const refetchPost = jest.fn();
            const refetchPut = jest.fn();
            const refetchPatch = jest.fn();
            const refetchDelete = jest.fn();
            const implementations: AxiosHooksMockItem[] = [
                {
                    config: GET_API_ROUTE,
                    implementation: [
                        { data: 'dataGet', loading: false },
                        refetchGet
                    ]
                },
                {
                    config: POST_API_ROUTE,
                    implementation: [
                        { data: 'dataPost', loading: false },
                        refetchPost
                    ]
                },
                {
                    config: PUT_API_ROUTE,
                    implementation: [
                        { data: 'dataPut', loading: false },
                        refetchPut
                    ]
                },
                {
                    config: PATCH_API_ROUTE,
                    implementation: [
                        { data: 'dataPatch', loading: false },
                        refetchPatch
                    ]
                },
                {
                    config: DELETE_API_ROUTE,
                    implementation: [
                        { data: 'dataDelete', loading: false },
                        refetchDelete
                    ]
                }
            ];

            mocked(useAxios).mockImplementation(
                new AxiosHooksMock(implementations).implement()
            );

            const { getByTestId } = render(<MethodsTestComponent />);

            ['dataGet', 'dataPost', 'dataPatch', 'dataDelete'].forEach(
                (dataString) => {
                    expect(getByTestId(dataString)).toContainHTML(dataString);
                }
            );
        });

        it('Should fire four different functions on refetches', () => {
            const refetchGet = jest.fn();
            const refetchPost = jest.fn();
            const refetchPut = jest.fn();
            const refetchPatch = jest.fn();
            const refetchDelete = jest.fn();
            const implementations: AxiosHooksMockItem[] = [
                {
                    config: GET_API_ROUTE,
                    implementation: [
                        { data: 'dataGet', loading: false },
                        refetchGet
                    ]
                },
                {
                    config: POST_API_ROUTE,
                    implementation: [
                        { data: 'dataPost', loading: false },
                        refetchPost
                    ]
                },
                {
                    config: PUT_API_ROUTE,
                    implementation: [
                        { data: 'dataPut', loading: false },
                        refetchPut
                    ]
                },
                {
                    config: PATCH_API_ROUTE,
                    implementation: [
                        { data: 'dataPatch', loading: false },
                        refetchPatch
                    ]
                },
                {
                    config: DELETE_API_ROUTE,
                    implementation: [
                        { data: 'dataDelete', loading: false },
                        refetchDelete
                    ]
                }
            ];

            mocked(useAxios).mockImplementation(
                new AxiosHooksMock(implementations).implement()
            );

            const { getByTestId } = render(<MethodsTestComponent />);

            expect(refetchGet).not.toHaveBeenCalled();
            expect(refetchPost).not.toHaveBeenCalled();
            expect(refetchPut).not.toHaveBeenCalled();
            expect(refetchPatch).not.toHaveBeenCalled();
            expect(refetchDelete).not.toHaveBeenCalled();

            fireEvent.click(getByTestId('refetchGet'));

            expect(refetchGet).toHaveBeenCalledTimes(1);
            expect(refetchPost).not.toHaveBeenCalled();
            expect(refetchPut).not.toHaveBeenCalled();
            expect(refetchPatch).not.toHaveBeenCalled();
            expect(refetchDelete).not.toHaveBeenCalled();

            fireEvent.click(getByTestId('refetchPost'));

            expect(refetchGet).toHaveBeenCalledTimes(1);
            expect(refetchPost).toHaveBeenCalledTimes(1);
            expect(refetchPut).not.toHaveBeenCalled();
            expect(refetchPatch).not.toHaveBeenCalled();
            expect(refetchDelete).not.toHaveBeenCalled();

            fireEvent.click(getByTestId('refetchPut'));

            expect(refetchGet).toHaveBeenCalledTimes(1);
            expect(refetchPost).toHaveBeenCalledTimes(1);
            expect(refetchPut).toHaveBeenCalledTimes(1);
            expect(refetchPatch).not.toHaveBeenCalled();
            expect(refetchDelete).not.toHaveBeenCalled();

            fireEvent.click(getByTestId('refetchPatch'));

            expect(refetchGet).toHaveBeenCalledTimes(1);
            expect(refetchPost).toHaveBeenCalledTimes(1);
            expect(refetchPut).toHaveBeenCalledTimes(1);
            expect(refetchPatch).toHaveBeenCalledTimes(1);
            expect(refetchDelete).not.toHaveBeenCalled();

            fireEvent.click(getByTestId('refetchDelete'));

            expect(refetchGet).toHaveBeenCalledTimes(1);
            expect(refetchPost).toHaveBeenCalledTimes(1);
            expect(refetchPut).toHaveBeenCalledTimes(1);
            expect(refetchPatch).toHaveBeenCalledTimes(1);
            expect(refetchDelete).toHaveBeenCalledTimes(1);
        });
    });
});
