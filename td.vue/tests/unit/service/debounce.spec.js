import debounce from '@/service/debounce';

jest.useFakeTimers();

describe('service/debounce.js', () => {
    const callback = jest.fn();
    const timeout = 100;
    let debounced;

    beforeEach(() => {
        jest.spyOn(global, 'setTimeout');
        debounced = debounce(callback, timeout);
    });

    it('provides the debounce function', () => {
        expect(typeof debounced).toEqual('function');
    });

    it('sets the time out', () => {
        debounced();
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), timeout);
    });
});
