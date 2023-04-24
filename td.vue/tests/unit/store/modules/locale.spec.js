import { LOCALE_SELECTED } from '@/stores/actions/locale.js';
import localeModule from '@/stores/locale.js';

describe('stores/modules/locale.js', () => {
  const mocks = {
    commit: () => {}
  };

  beforeEach(() => {
    jest.spyOn(mocks, 'commit');
  });

  describe('state', () => {
    it('defines a state object', () => {
      expect(localeModule.state).toBeInstanceOf(Object);
    });
  });

  describe('actions', () => {
    it('commits the selected action', () => {
      localeModule.actions[LOCALE_SELECTED](mocks, 'blah');
      expect(mocks.commit).toHaveBeenCalledWith(LOCALE_SELECTED, 'blah');
    });
  });

  describe('mutations', () => {
    describe('selected', () => {
      beforeEach(() => {
        localeModule.mutations[LOCALE_SELECTED](localeModule.state, 'foobar');
      });

      it('sets the locale', () => {
        expect(localeModule.state.locale).toEqual('foobar');
      });
    });
  });

  it('defines a getters object', () => {
    expect(localeModule.getters).toBeInstanceOf(Object);
  });
});
