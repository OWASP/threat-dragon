import { BootstrapVue, BJumbotron } from 'bootstrap-vue';
import { expect } from 'chai';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { mount, createLocalVue } from '@vue/test-utils';

import Dashboard from '@/views/Dashboard.vue';
import DashboardAction from '@/components/DashboardAction.vue';

describe('Dashboard.vue', () => {
    let wrapper, localVue;

    beforeEach(() => {
        const template = '<div />';
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.component('font-awesome-icon', FontAwesomeIcon);
        wrapper = mount(Dashboard, {
            localVue,
            stubs: {
                'font-awesome-icon': { template },
                'router-link': { template }
            }
        });
    });

    it('renders the home view', () => {
        expect(wrapper.exists()).to.be.true;
    });

    it('has a jumbotron welcoming the user', () => {
        expect(wrapper.findComponent(BJumbotron).exists()).to.be.true;
    });

    it('has multiple actions', () => {
        expect(wrapper.findAllComponents(DashboardAction).length).to.be.greaterThan(1);
    });
});
