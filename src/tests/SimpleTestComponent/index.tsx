import React, { ReactElement } from 'react';
import useAxios from 'axios-hooks';

export const SIMPLE_API_ROUTE = 'https://api.com/api/123';

const SimpleTestComponent = (): ReactElement => {
    const [{ data, loading, error }, refetch] = useAxios(SIMPLE_API_ROUTE);

    return (
        <div>
            {data ? <p data-testid="data">{JSON.stringify(data)}</p> : null}
            {loading ? (
                <p data-testid="loading">{JSON.stringify(loading)}</p>
            ) : null}
            {error ? <p data-testid="error">{error.message}</p> : null}
            <button onClick={() => refetch()} data-testid="refetch">
                Refetch
            </button>
        </div>
    );
};

export default SimpleTestComponent;
