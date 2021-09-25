import { BootstrapVue, BJumbotron } from 'bootstrap-vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import Dashboard from '@/views/Dashboard.vue';
import DashboardAction from '@/components/DashboardAction.vue';

describe('Dashboard.vue', () => {
    let wrapper, localVue, mockStore;

    beforeEach(() => {
        const template = '<div />';
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.use(Vuex);
        localVue.component('font-awesome-icon', FontAwesomeIcon);
        mockStore = new Vuex.Store({
            state: {
                provider: {
                    selected: 'github'
                }
            }
        });
        wrapper = mount(Dashboard, {
            localVue,
            stubs: {
                'font-awesome-icon': { template },
                'router-link': { template }
            },
            mocks: {
                $t: key => key
            },
            store: mockStore
        });
    });

    it('renders the dashboard view', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('has a jumbotron welcoming the user', () => {
        expect(wrapper.findComponent(BJumbotron).text()).toContain('dashboard.welcome.title');
    });

    it('has multiple actions', () => {
        expect(wrapper.findAllComponents(DashboardAction).length).toBeGreaterThan(1);
    });
});
