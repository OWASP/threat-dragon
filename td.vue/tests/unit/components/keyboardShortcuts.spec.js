import { BootstrapVue, BModal, BTable } from 'bootstrap-vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';

import TdKeyboardShortcuts from '@/components/KeyboardShortcuts.vue';

describe('components/KeyboardShortcuts.vue', () => {
    let localVue, modal, wrapper;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        wrapper = shallowMount(TdKeyboardShortcuts, {
            localVue,
            mocks: {
                $t: (t) => t
            }
        });
        modal = wrapper.findComponent(BModal);
    });

    it('creates a bootstrap modal', () => {
        expect(modal.exists()).toEqual(true);
    });

    it('uses a translation for the title', () => {
        expect(modal.attributes('title')).toEqual('threatmodel.shortcuts.title');
    });

    it('creates a table from the data', () => {
        expect(wrapper.findComponent(BTable).exists()).toEqual(true);
    });
});
