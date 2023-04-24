import App from '@/App.vue';
import { BContainer } from 'bootstrap-vue';
import Navbar from '@/components/Navbar.vue';
import { createTestingPinia } from '@pinia/testing';
import { shallowMount } from '@vue/test-utils';
import { useI18n } from 'vue-i18n';

vi.mock('vue-i18n');

useI18n.mockReturnValue({
  t: key => key
});

describe('App.vue', () => {
  let wrapper, mockToast;

  beforeEach(() => {
    console.log = vi.fn();
    mockToast = {
      warning: vi.fn()
    };
    wrapper = shallowMount(App, {
      global: {
        mocks: {
          $t: key => key,
          $toast: mockToast
        },
        plugins: [createTestingPinia()],
        stubs: ['router-view']
      }
    });
  });

  it('renders the app', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('has the navbar', () => {
    expect(wrapper.findComponent(Navbar).exists()).toBe(true);
  });

  it('has a b-container', () => {
    expect(wrapper.findComponent(BContainer).exists()).toBe(true);
  });

  it('shows a warning toast for v2', () => {
    expect(mockToast.warning).toHaveBeenCalled();
  });
});
