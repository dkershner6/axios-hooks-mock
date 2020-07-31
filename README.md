# axios-hooks-mock

A library that simplifies mocking for [axios-hooks](https://github.com/simoneb/axios-hooks), especially when multiple hooks are used together.

This library has full test coverage to ensure each scenario works and is written in TypeScript.

## Installation

```
npm i axios axios-hooks
npm i -D axios-hooks-mock
```

## Usage

There are a few ways to use this library to achieve your complex mocking goals. Examples will use `jest`, but this could also be used with other testing libraries. Any usage of `mocked` is using `ts-jest/utils`.

The library matches on a combination of `method`, `url`, and `params`. You must create one implementation per each combination you want to satisfy.

Each method of adding implementations accepts either a string (the url) or an `AxiosRequestConfig` object (this is the object you are used to, including url, method, params, data, etc.). The convenience methods only accept the url string (for hopefully obvious reasons).

You can use any combination of the below.

### Always

```typescript
jest.mock('axios-hooks');
```

Having the library do this would make it far less flexible.

### Convenience Methods

```typescript
import AxiosHooksMock from 'axios-hooks-mock';

const refetch = jest.fn();
mocked(useAxios).mockImplementation(
    new AxiosHooksMock()
        .get('https://testapi.com', [
            { data: { testData: 'theData' }, loading: false },
            refetch
        ])
        // Chain as many as you want
        .implement()
);
```

### addImplementation()

```typescript
import AxiosHooksMock from 'axios-hooks-mock';

const refetch = jest.fn();
mocked(useAxios).mockImplementation(
    new AxiosHooksMock()
        .addImplementation({ url: 'https://testapi.com', method: 'GET' }, [
            { data: { testData: 'theData' }, loading: false },
            refetch
        ])
        // Chain as many as you want
        .implement()
);
```

### AxiosHooksMockItem Array + Constructor

This allows for a configuration array to be handed into the constructor like so:

```typescript
import AxiosHooksMock from 'axios-hooks-mock';

const refetch = jest.fn();

const implementations: AxiosHooksMockItem[] = [
    {
        config: { url: 'https://testapi.com', method: 'GET' },
        implementation: [
            { data: { testData: 'theData' }, loading: false },
            refetch
        ]
    }
    // As many as you want
];

mocked(useAxios).mockImplementation(
    new AxiosHooksMock(implementations).implement()
);
```

## Alternate constructor

If you like: `AxiosHooksMock.construct(implementations).implement();`

## API

### AxiosHooksTuple

This is what is returned from `useAxios()`.

```typescript
type AxiosHooksTuple = [
    ResponseValues<unknown>,
    (
        config?: AxiosRequestConfig | string,
        options?: RefetchOptions
    ) => AxiosPromise<unknown>
];
```

### Constructor

| Param           | Required | Type                                                                          |
| --------------- | -------- | ----------------------------------------------------------------------------- |
| implementations | false    | `{ config: AxiosRequestConfig | string; implementation: AxiosHooksTuple; }[]` |

### addImplementation()

| Param          | Required | Type                           |
| -------------- | -------- | ------------------------------ |
| config         | true     | `AxiosRequestConfig | string;` |
| implementation | true     | `AxiosHooksTuple`              |

### get(), post(), patch(), delete()

| Param          | Required | Type              |
| -------------- | -------- | ----------------- |
| url            | true     | `string;`         |
| implementation | true     | `AxiosHooksTuple` |

### implement()

No Params

## Q & A

#### Can this library give me a loading status, then change to a data response, like in real life?

No. This would vastly increase the complexity of your test, including async waiting, a Provider that would need to wrap your code and intercept useAxios requests, and more. It is much easier to test each state separately.
