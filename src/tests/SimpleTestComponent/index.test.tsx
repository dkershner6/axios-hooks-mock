import React from 'react';
import SimpleTestComponent from '.';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { mocked } from 'ts-jest/utils';
import useAxios from 'axios-hooks';
import { AxiosError } from 'axios';
import AxiosHooksMock from '../../lib';

jest.mock('axios-hooks');

describe('AxiosHooksMock', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('With Data', () => {
        it('Should render correctly when using a simple string as the axios config', async () => {
            const reload = jest.fn();
            mocked(useAxios).mockImplementation(
                new AxiosHooksMock()
                    .addImplementation('https://api.com/api/123', [
                        { data: 'test', loading: false },
                        reload
                    ])
                    .implement()
            );

            const { getByTestId, queryByTestId } = render(
                <SimpleTestComponent />
            );

            expect(getByTestId('data')).toContainHTML('test');
            expect(queryByTestId('loading')).toBeNull();
            expect(queryByTestId('error')).toBeNull();

            expect(reload).not.toHaveBeenCalled();

            fireEvent.click(getByTestId('refetch'));

            expect(reload).toHaveBeenCalledTimes(1);
        });

        it('Should render correctly when using a convenience method (get)', async () => {
            const reload = jest.fn();
            mocked(useAxios).mockImplementation(
                new AxiosHooksMock()
                    .get('https://api.com/api/123', [
                        { data: 'test', loading: false },
                        reload
                    ])
                    .implement()
            );

            const { getByTestId, queryByTestId } = render(
                <SimpleTestComponent />
            );

            expect(getByTestId('data')).toContainHTML('test');
            expect(queryByTestId('loading')).toBeNull();
            expect(queryByTestId('error')).toBeNull();

            expect(reload).not.toHaveBeenCalled();

            fireEvent.click(getByTestId('refetch'));

            expect(reload).toHaveBeenCalledTimes(1);
        });

        it('Should render correctly even with a bunch of unused implementations', async () => {
            const reload = jest.fn();
            mocked(useAxios).mockImplementation(
                new AxiosHooksMock()
                    .get('https://api.com/api/123', [
                        { data: 'test', loading: false },
                        reload
                    ])
                    .post('https://api.com/api/123', [
                        { data: {}, loading: true },
                        jest.fn()
                    ])
                    .patch('https://api.com/api/123', [
                        { data: {}, loading: true },
                        jest.fn()
                    ])
                    .delete('https://api.com/api/123', [
                        { data: {}, loading: true },
                        jest.fn()
                    ])
                    .implement()
            );

            const { getByTestId, queryByTestId } = render(
                <SimpleTestComponent />
            );

            expect(getByTestId('data')).toContainHTML('test');
            expect(queryByTestId('loading')).toBeNull();
            expect(queryByTestId('error')).toBeNull();

            expect(reload).not.toHaveBeenCalled();

            fireEvent.click(getByTestId('refetch'));

            expect(reload).toHaveBeenCalledTimes(1);
        });

        it('Should render correctly using constructor, with simple string config', () => {
            const reload = jest.fn();
            const implementations = [
                {
                    config: 'https://api.com/api/123',
                    implementation: [{ data: 'test', loading: false }, reload]
                }
            ];
            mocked(useAxios).mockImplementation(
                new AxiosHooksMock(implementations).implement()
            );

            const { getByTestId, queryByTestId } = render(
                <SimpleTestComponent />
            );

            expect(getByTestId('data')).toContainHTML('test');
            expect(queryByTestId('loading')).toBeNull();
            expect(queryByTestId('error')).toBeNull();

            expect(reload).not.toHaveBeenCalled();

            fireEvent.click(getByTestId('refetch'));

            expect(reload).toHaveBeenCalledTimes(1);
        });

        it('Should render correctly using alternate constructor, with simple string config', () => {
            const reload = jest.fn();
            const implementations = [
                {
                    config: 'https://api.com/api/123',
                    implementation: [{ data: 'test', loading: false }, reload]
                }
            ];
            mocked(useAxios).mockImplementation(
                AxiosHooksMock.construct(implementations).implement()
            );

            const { getByTestId, queryByTestId } = render(
                <SimpleTestComponent />
            );

            expect(getByTestId('data')).toContainHTML('test');
            expect(queryByTestId('loading')).toBeNull();
            expect(queryByTestId('error')).toBeNull();

            expect(reload).not.toHaveBeenCalled();

            fireEvent.click(getByTestId('refetch'));

            expect(reload).toHaveBeenCalledTimes(1);
        });
    });

    it('Should render correctly with a loading state', () => {
        const reload = jest.fn();
        mocked(useAxios).mockImplementation(
            new AxiosHooksMock()
                .addImplementation('https://api.com/api/123', [
                    { data: undefined, loading: true },
                    reload
                ])
                .implement()
        );

        const { queryByTestId } = render(<SimpleTestComponent />);

        expect(queryByTestId('data')).toBeNull();
        expect(queryByTestId('loading')).not.toBeNull();
        expect(queryByTestId('error')).toBeNull();

        expect(reload).not.toHaveBeenCalled();
    });

    it('Should render correctly with an error state', () => {
        const reload = jest.fn();
        mocked(useAxios).mockImplementation(
            new AxiosHooksMock()
                .addImplementation('https://api.com/api/123', [
                    {
                        data: undefined,
                        loading: false,
                        error: new Error('Not good') as AxiosError
                    },
                    reload
                ])
                .implement()
        );

        const { queryByTestId } = render(<SimpleTestComponent />);

        expect(queryByTestId('data')).toBeNull();
        expect(queryByTestId('loading')).toBeNull();
        expect(queryByTestId('error')).toContainHTML('Not good');

        expect(reload).not.toHaveBeenCalled();
    });

    describe('Default', () => {
        it('Should return default with no match (convenience method)', () => {
            const testData = { testDefault: true };
            const reload = jest.fn();
            mocked(useAxios).mockImplementation(
                new AxiosHooksMock()
                    .addImplementation('not_correct', [
                        { data: undefined, loading: true },
                        reload
                    ])
                    .default([{ data: testData, loading: false }, jest.fn()])
                    .implement()
            );

            const { queryByTestId } = render(<SimpleTestComponent />);

            expect(queryByTestId('data')).toContainHTML(
                JSON.stringify(testData)
            );
            expect(queryByTestId('loading')).toBeNull();
            expect(queryByTestId('error')).toBeNull();

            expect(reload).not.toHaveBeenCalled();
        });

        it('Should return default with no match (constructor method)', () => {
            const testData = { testDefault: true };
            const reload = jest.fn();
            const implementations = [
                {
                    config: 'not_correct',
                    implementation: [{ data: 'test', loading: false }, reload]
                }
            ];
            mocked(useAxios).mockImplementation(
                new AxiosHooksMock(implementations, [
                    { data: testData, loading: false },
                    jest.fn()
                ]).implement()
            );

            const { queryByTestId } = render(<SimpleTestComponent />);

            expect(queryByTestId('data')).toContainHTML(
                JSON.stringify(testData)
            );
            expect(queryByTestId('loading')).toBeNull();
            expect(queryByTestId('error')).toBeNull();

            expect(reload).not.toHaveBeenCalled();
        });
    });
});
