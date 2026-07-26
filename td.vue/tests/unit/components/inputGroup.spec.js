import { shallowMount } from '@vue/test-utils';

import TdInputGroup from '@/components/InputGroup.vue';

describe('components/InputGroup.vue', () => {
    it('renders the default slot in a Bootstrap-compatible input group', () => {
        const wrapper = shallowMount(TdInputGroup, {
            slots: {
                default: '<input class="form-control td-control" />'
            }
        });

        expect(wrapper.find('.td-control').exists()).toEqual(true);
    });

    it('renders prepend content when provided', () => {
        const wrapper = shallowMount(TdInputGroup, {
            slots: {
                prepend: '<button class="prepend-action">Before</button>',
                default: '<input class="form-control" />'
            }
        });

        expect(wrapper.find('.input-group-prepend .prepend-action').exists()).toEqual(true);
    });

    it('renders append content when provided', () => {
        const wrapper = shallowMount(TdInputGroup, {
            slots: {
                default: '<input class="form-control" />',
                append: '<button class="append-action">After</button>'
            }
        });

        expect(wrapper.find('.input-group-append .append-action').exists()).toEqual(true);
    });

    it('does not render empty addon wrappers', () => {
        const wrapper = shallowMount(TdInputGroup, {
            slots: {
                default: '<input class="form-control" />'
            }
        });

        expect(wrapper.find('.input-group-prepend').exists()).toEqual(false);
        expect(wrapper.find('.input-group-append').exists()).toEqual(false);
    });

    it('passes attributes and classes through to the input group', () => {
        const wrapper = shallowMount(TdInputGroup, {
            attrs: {
                id: 'diagram-group-0',
                class: 'mb-3',
                'label-for': 'diagram-0'
            }
        });

        expect(wrapper.attributes('id')).toEqual('diagram-group-0');
        expect(wrapper.attributes('label-for')).toEqual('diagram-0');
        expect(wrapper.classes()).toContain('input-group');
        expect(wrapper.classes()).toContain('td-input-group');
        expect(wrapper.classes()).toContain('mb-3');
    });

    it('uses a group role for parity with BootstrapVue input groups', () => {
        const wrapper = shallowMount(TdInputGroup);

        expect(wrapper.attributes('role')).toEqual('group');
    });
});
