import { BootstrapVue, BContainer, BJumbotron, BListGroup, BListGroupItem } from 'bootstrap-vue';
import { mount, createLocalVue } from '@vue/test-utils';

import Datasource from '@/views/Datasource.vue';

describe('Datasource.vue', () => {
    let wrapper, localVue;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        wrapper = mount(Datasource, {
            localVue
        });
    });

    it('renders the datasource view', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('has a b-container', () => {
        expect(wrapper.findComponent(BContainer).exists()).toBe(true);
    });

    it('has a jumbotron with instructions', () => {
        expect(wrapper.findComponent(BJumbotron).text()).toContain('from the list below');
    });

    it('uses a b-list-group', () => {
        expect(wrapper.findComponent(BListGroup).exists()).toBe(true);
    });

    it('lists the data sources', () => {
        expect(wrapper.findAllComponents(BListGroupItem).length).toBeGreaterThan(1);
    });
});
