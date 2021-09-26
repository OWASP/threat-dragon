import { BootstrapVue } from 'bootstrap-vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils';

import TdDashboardAction from '@/components/DashboardAction.vue';

describe('components/DashboardAction.vue', () => {
    const to = '/somewhere',
        icon = 'icon',
        iconPreface = 'foo',
        description = 'bar';
    let wrapper, localVue;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.component('font-awesome-icon', FontAwesomeIcon);
        wrapper = shallowMount(TdDashboardAction, {
            localVue,
            propsData: {
                to,
                icon,
                iconPreface,
                description
            },
            stubs: {
                'router-link': RouterLinkStub
            },
            mocks: {
                $t: key => key
            }
        });
    });

    it('reads the to value', () => {
        expect(wrapper.props().to).toEqual(to);
    });

    it('requires the to prop', () => {
        expect(TdDashboardAction.props.to.required).toBe(true);
    });

    it('sets the to value on the router link', () => {
        const stub = wrapper.findComponent(RouterLinkStub);
        expect(stub.props().to).toEqual(to);
    });

    it('reads the icon value', () => {
        expect(wrapper.props().icon).toEqual(icon);
    });

    it('requires the icon prop', () => {
        expect(TdDashboardAction.props.icon.required).toBe(true);
    });

    it('reads the iconPreface value', () => {
        expect(wrapper.props().iconPreface).toEqual(iconPreface);
    });

    it('does not require the iconPreface value', () => {
        expect(TdDashboardAction.props.iconPreface.required).toBe(false);
    });

    it('has a default value for iconPreface', () => {
        expect(TdDashboardAction.props.iconPreface.default).toEqual('fas');
    });
    
    it('sets the font awesome icon value', () => {
        const fa = wrapper.findComponent(FontAwesomeIcon);
        expect(fa.attributes(icon)).toEqual(`${iconPreface},${icon}`);
    });

    it('reads the description value', () => {
        expect(wrapper.props().description).toEqual(description);
    });

    it('requires the description', () => {
        expect(TdDashboardAction.props.description.required).toBe(true);
    });
});
