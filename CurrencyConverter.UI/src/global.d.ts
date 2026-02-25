declare namespace jest {
    interface Matchers<R> {
        toBeInTheDocument(): R;
        toHaveValue(value?: string | number | Array<string | number>): R;
    }
}

export { };
