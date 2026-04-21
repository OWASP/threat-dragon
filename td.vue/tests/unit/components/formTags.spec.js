import { mount } from '@vue/test-utils';

import TdFormTags from '@/components/FormTags.vue';

const firstArrayPayload = (wrapper, eventName) => wrapper
    .emitted(eventName)
    ?.find(([payload]) => Array.isArray(payload))?.[0];

describe('components/FormTags.vue', () => {
    it('adds separated tags and keeps the unfinished tag in the input', async () => {
        const wrapper = mount(TdFormTags, {
            propsData: {
                id: 'contributors',
                value: [],
                separator: ',;'
            }
        });

        const input = wrapper.find('input');
        await input.setValue('alice,bob');

        expect(firstArrayPayload(wrapper, 'input')).toEqual(['alice']);
        expect(input.element.value).toBe('bob');
    });

    it('adds all tags and clears the input when the value ends with a separator', async () => {
        const wrapper = mount(TdFormTags, {
            propsData: {
                value: [],
                separator: [';', ',']
            }
        });

        const input = wrapper.find('input');
        await input.setValue('alice,bob,');

        expect(firstArrayPayload(wrapper, 'input')).toEqual(['alice', 'bob']);
        expect(input.element.value).toBe('');
    });

    it('does not add tags on input when no separator is configured', async () => {
        const wrapper = mount(TdFormTags, {
            propsData: {
                value: []
            }
        });

        await wrapper.find('input').setValue('alice,bob');

        expect(firstArrayPayload(wrapper, 'input')).toBeUndefined();
    });

    it('does not add tags on input until a configured separator is typed', async () => {
        const wrapper = mount(TdFormTags, {
            propsData: {
                value: [],
                separator: ','
            }
        });

        await wrapper.find('input').setValue('alice');

        expect(firstArrayPayload(wrapper, 'input')).toBeUndefined();
    });

    it('commits the current input on enter', async () => {
        const wrapper = mount(TdFormTags, {
            propsData: {
                value: ['alice'],
                separator: ',;'
            }
        });

        const input = wrapper.find('input');
        await input.setValue('bob');
        await input.trigger('keydown.enter');

        expect(firstArrayPayload(wrapper, 'input')).toEqual(['alice', 'bob']);
        expect(firstArrayPayload(wrapper, 'change')).toEqual(['alice', 'bob']);
        expect(input.element.value).toBe('');
    });

    it('does not emit duplicate tags', async () => {
        const wrapper = mount(TdFormTags, {
            propsData: {
                value: ['alice'],
                separator: ','
            }
        });

        await wrapper.find('input').setValue('alice,');

        expect(firstArrayPayload(wrapper, 'input')).toBeUndefined();
    });

    it('removes an existing tag', async () => {
        const wrapper = mount(TdFormTags, {
            propsData: {
                value: ['alice', 'bob']
            }
        });

        await wrapper.find('button').trigger('click');

        expect(firstArrayPayload(wrapper, 'input')).toEqual(['bob']);
        expect(firstArrayPayload(wrapper, 'change')).toEqual(['bob']);
    });

    it('does not remove tags when disabled', async () => {
        const wrapper = mount(TdFormTags, {
            propsData: {
                disabled: true,
                value: ['alice', 'bob']
            }
        });

        await wrapper.find('button').trigger('click');

        expect(wrapper.emitted('input')).toBeUndefined();
    });

    it('renders optional tag controls without coercing tag input behavior', () => {
        const wrapper = mount(TdFormTags, {
            propsData: {
                noTagRemove: true,
                placeholder: 'Add contributor',
                tagClass: ['mr-1', 'text-monospace'],
                tagRemoveLabel: 'Remove contributor',
                value: ['alice'],
                variant: 'info'
            }
        });

        expect(wrapper.find('input').attributes('placeholder')).toBe('Add contributor');
        expect(wrapper.find('.b-form-tag').classes()).toEqual(expect.arrayContaining(['mr-1', 'text-monospace', 'badge-info']));
        expect(wrapper.find('button').exists()).toBe(false);
    });

    it('escapes regex separator characters when splitting tags', async () => {
        const wrapper = mount(TdFormTags, {
            propsData: {
                value: [],
                separator: '$'
            }
        });

        await wrapper.find('input').setValue('alice$bob$');

        expect(firstArrayPayload(wrapper, 'input')).toEqual(['alice', 'bob']);
    });

    it('ignores empty separators and normalizes duplicate tag values', async () => {
        const wrapper = mount(TdFormTags, {
            propsData: {
                value: ['alice', 'alice', ' bob '],
                separator: ['', ',']
            }
        });

        expect(wrapper.vm.tags).toEqual(['alice', 'bob']);

        await wrapper.find('input').setValue('carol,dave,');

        expect(firstArrayPayload(wrapper, 'input')).toEqual(['alice', 'bob', 'carol', 'dave']);
    });
});
