import { BootstrapVue, BJumbotron } from 'bootstrap-vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import MainDashboard from '@/views/MainDashboard.vue';
import DashboardAction from '@/components/DashboardAction.vue';

describe('MainDashboard.vue', () => {
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
        wrapper = shallowMount(MainDashboard, {
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

    it('renders the main dashboard view', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('has a jumbotron welcoming the user', () => {
        expect(wrapper.findComponent(BJumbotron).text()).toContain('dashboard.welcome.description');
    });

    it('has multiple actions', () => {
        expect(wrapper.findAllComponents(DashboardAction).length).toBeGreaterThan(1);
    });
});
