import { BBadge, BCard, BootstrapVue } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Vuex from 'vuex';

import TdGraphThreats from '@/components/GraphThreats.vue';

describe('components/GraphThreats.vue', () => {
    let emitter, localVue, wrapper;

    const getDefaultPropsData = () => ({
        status: 'Open',
        severity: 'High',
        description: 'Some description',
        title: 'My terrifying threat',
        type: 'Information Disclosure',
        mitigation: 'we will mitigate it eventually',
        modelType: 'CIA',
        number: 42,
        id: 'asdf-asdf-asdf-asdf'
    });

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(Vuex);
        localVue.use(BootstrapVue);
        localVue.component('font-awesome-icon', FontAwesomeIcon);
    });

    const getWrapper = (propsData) => shallowMount(TdGraphThreats, {
        localVue,
        mocks: {
            $t: key => key,
            $emit: emitter = jest.fn()
        },
        propsData
    });

    describe('props', () => {
        it('has the status prop', () => {
            expect(TdGraphThreats.props.status).toBeDefined();
        });

        it('has the severity prop', () => {
            expect(TdGraphThreats.props.severity).toBeDefined();
        });

        it('has the description prop', () => {
            expect(TdGraphThreats.props.description).toBeDefined();
        });

        it('has the title prop', () => {
            expect(TdGraphThreats.props.title).toBeDefined();
        });

        it('has the type prop', () => {
            expect(TdGraphThreats.props.type).toBeDefined();
        });

        it('has the mitigation prop', () => {
            expect(TdGraphThreats.props.mitigation).toBeDefined();
        });

        it('has the model type', () => {
            expect(TdGraphThreats.props.modelType).toBeDefined();
        });
    });

    describe('icons', () => {
        it('displays a red exclamation triangle for open', () => {
            const propsData = getDefaultPropsData();
            wrapper = getWrapper(propsData);
            const icon = wrapper.findAllComponents(FontAwesomeIcon)
                .filter(x => x.attributes('icon') === 'exclamation-triangle')
                .filter(x => x.classes('red-icon'))
                .at(0);
            expect(icon.exists()).toEqual(true);
        });

        it('displays a green check for mitigated', () => {
            const propsData = getDefaultPropsData();
            propsData.status = 'Mitigated';
            wrapper = getWrapper(propsData);
            const icon = wrapper.findAllComponents(FontAwesomeIcon)
                .filter(x => x.attributes('icon') === 'check')
                .filter(x => x.classes('green-icon'))
                .at(0);
            expect(icon.exists()).toEqual(true);
        });

        it('displays a gray check for not applicable', () => {
            const propsData = getDefaultPropsData();
            propsData.status = 'NotApplicable';
            wrapper = getWrapper(propsData);
            const icon = wrapper.findAllComponents(FontAwesomeIcon)
                .filter(x => x.attributes('icon') === 'check')
                .filter(x => x.classes('gray-icon'))
                .at(0);
            expect(icon.exists()).toEqual(true);
        });

        it('displays a darkred circle for critical severity', () => {
            const propsData = getDefaultPropsData();
            propsData.severity = 'Critical';
            wrapper = getWrapper(propsData);
            const icon = wrapper.findAllComponents(FontAwesomeIcon)
                .filter(x => x.attributes('icon') === 'circle')
                .filter(x => x.classes('darkred-icon'))
                .at(0);
            expect(icon.exists()).toEqual(true);
        });

        it('displays a red circle for high severity', () => {
            const propsData = getDefaultPropsData();
            propsData.severity = 'High';
            wrapper = getWrapper(propsData);
            const icon = wrapper.findAllComponents(FontAwesomeIcon)
                .filter(x => x.attributes('icon') === 'circle')
                .filter(x => x.classes('red-icon'))
                .at(0);
            expect(icon.exists()).toEqual(true);
        });

        it('displays a orange circle for medium severity', () => {
            const propsData = getDefaultPropsData();
            propsData.severity = 'Medium';
            wrapper = getWrapper(propsData);
            const icon = wrapper.findAllComponents(FontAwesomeIcon)
                .filter(x => x.attributes('icon') === 'circle')
                .filter(x => x.classes('orange-icon'))
                .at(0);
            expect(icon.exists()).toEqual(true);
        });

        it('displays a yellow circle for low severity', () => {
            const propsData = getDefaultPropsData();
            propsData.severity = 'Low';
            wrapper = getWrapper(propsData);
            const icon = wrapper.findAllComponents(FontAwesomeIcon)
                .filter(x => x.attributes('icon') === 'circle')
                .filter(x => x.classes('yellow-icon'))
                .at(0);
            expect(icon.exists()).toEqual(true);
        });

        it('displays a gray circle for TBD severity', () => {
            const propsData = getDefaultPropsData();
            propsData.severity = 'TBD';
            wrapper = getWrapper(propsData);
            const icon = wrapper.findAllComponents(FontAwesomeIcon)
                .filter(x => x.attributes('icon') === 'circle')
                .filter(x => x.classes('gray-icon'))
                .at(0);
            expect(icon.exists()).toEqual(true);
        });
    });

    describe('threat info', () => {
        let propsData;
        beforeEach(() => {
            propsData = getDefaultPropsData();
            wrapper = getWrapper(propsData);
        });

        it('has a link for the threat title', () => {
            expect(wrapper.find('a').text()).toEqual('#42 My terrifying threat');
        });

        it('displays the type', () => {
            expect(wrapper.findComponent(BCard).text()).toContain(propsData.type);
        });

        it('displays the model type', () => {
            expect(wrapper.findComponent(BBadge).text()).toEqual('CIA');
        });
    });

    describe('threat selected', () => {
        let propsData;
        beforeEach(async () => {
            propsData = getDefaultPropsData();
            wrapper = getWrapper(propsData);
            await wrapper.find('a').trigger('click');
        });

        it('emits the threatSelected event with the threat id', () => {
            expect(emitter).toHaveBeenCalledWith('threatSelected', propsData.id,'old');
        });
    });
});
