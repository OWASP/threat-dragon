import debounce from '@/service/debounce.js';

describe('service/debounce.js', () => {
    let fn;
    let debouncedFn;
    const delay = 100;

    beforeEach(() => {
        jest.useFakeTimers();
        fn = jest.fn();
        debouncedFn = debounce(fn, delay);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should not call the function immediately', () => {
        debouncedFn();
        expect(fn).not.toHaveBeenCalled();
    });

    it('should call the function after the specified delay', () => {
        debouncedFn();
        jest.advanceTimersByTime(delay);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should reset the timer when called multiple times', () => {
        debouncedFn();
        jest.advanceTimersByTime(50);
        debouncedFn();
        jest.advanceTimersByTime(50);
        expect(fn).not.toHaveBeenCalled();
        jest.advanceTimersByTime(50);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to the debounced function', () => {
        const arg1 = 'test';
        const arg2 = { value: 42 };
        debouncedFn(arg1, arg2);
        jest.advanceTimersByTime(delay);
        expect(fn).toHaveBeenCalledWith(arg1, arg2);
    });

    it('should preserve the context (this) when called', () => {
        const context = { value: 'test' };
        function testFn() {
            this.called = true;
        }
        
        const debouncedTestFn = debounce(testFn, delay);
        debouncedTestFn.call(context);
        jest.advanceTimersByTime(delay);
        
        expect(context.called).toBe(true);
    });
});