import React from 'react';
import QueryParamsTestComponent, {
    QUERY_PARAMS_API_ROUTE_ONE,
    QUERY_PARAMS_API_ROUTE_TWO,
    QUERY_PARAMS_API_ROUTE_THREE
} from '.';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { mocked } from 'ts-jest/utils';
import useAxios from 'axios-hooks';
import AxiosHooksMock, { AxiosHooksMockItem } from '../../';

jest.mock('axios-hooks');

describe('QueryParams', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('Should render three different responses', () => {
        const refetchOne = jest.fn();
        const refetchTwo = jest.fn();
        const refetchThree = jest.fn();
        const implementations: AxiosHooksMockItem[] = [
            {
                config: QUERY_PARAMS_API_ROUTE_ONE,
                implementation: [
                    { data: 'dataOne', loading: false },
                    refetchOne
                ]
            },
            {
                config: QUERY_PARAMS_API_ROUTE_TWO,
                implementation: [
                    { data: 'dataTwo', loading: false },
                    refetchTwo
                ]
            },
            {
                config: QUERY_PARAMS_API_ROUTE_THREE,
                implementation: [
                    { data: 'dataThree', loading: false },
                    refetchThree
                ]
            }
        ];

        mocked(useAxios).mockImplementation(
            new AxiosHooksMock(implementations).implement()
        );

        const { getByTestId } = render(<QueryParamsTestComponent />);

        ['dataOne', 'dataTwo', 'dataThree'].forEach((dataString) => {
            expect(getByTestId(dataString)).toContainHTML(dataString);
        });
    });

    it('Should fire three different functions on refetches', () => {
        const refetchOne = jest.fn();
        const refetchTwo = jest.fn();
        const refetchThree = jest.fn();
        const implementations: AxiosHooksMockItem[] = [
            {
                config: QUERY_PARAMS_API_ROUTE_ONE,
                implementation: [
                    { data: 'dataOne', loading: false },
                    refetchOne
                ]
            },
            {
                config: QUERY_PARAMS_API_ROUTE_TWO,
                implementation: [
                    { data: 'dataTwo', loading: false },
                    refetchTwo
                ]
            },
            {
                config: QUERY_PARAMS_API_ROUTE_THREE,
                implementation: [
                    { data: 'dataThree', loading: false },
                    refetchThree
                ]
            }
        ];

        mocked(useAxios).mockImplementation(
            new AxiosHooksMock(implementations).implement()
        );

        const { getByTestId } = render(<QueryParamsTestComponent />);

        expect(refetchOne).not.toHaveBeenCalled();
        expect(refetchTwo).not.toHaveBeenCalled();
        expect(refetchThree).not.toHaveBeenCalled();

        fireEvent.click(getByTestId('refetchOne'));

        expect(refetchOne).toHaveBeenCalledTimes(1);
        expect(refetchTwo).not.toHaveBeenCalled();
        expect(refetchThree).not.toHaveBeenCalled();

        fireEvent.click(getByTestId('refetchTwo'));

        expect(refetchOne).toHaveBeenCalledTimes(1);
        expect(refetchTwo).toHaveBeenCalledTimes(1);
        expect(refetchThree).not.toHaveBeenCalled();

        fireEvent.click(getByTestId('refetchThree'));

        expect(refetchOne).toHaveBeenCalledTimes(1);
        expect(refetchTwo).toHaveBeenCalledTimes(1);
        expect(refetchThree).toHaveBeenCalledTimes(1);
    });
});
