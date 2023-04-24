import debounce from '@/service/debounce.js';

describe('service/debounce.js', () => {
  it('only calls the function once if run in under the delay time', (done) => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 200);
    for (let i = 0; i < 5; i++) {
      debouncedFn();
    }
    setTimeout(() => {
      expect(fn).toHaveBeenCalledTimes(1);
      done();
    }, 250);
  });
});
