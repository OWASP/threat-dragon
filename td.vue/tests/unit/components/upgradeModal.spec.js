import BootstrapVue, { BModal } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';

import TdUpgradeModal from '@/components/UpgradeModal.vue';

describe('components/UpgradeModal.vue', () => {
    let wrapper;

    beforeEach(() => {
        const localVue = createLocalVue();
        localVue.use(BootstrapVue);
        wrapper = shallowMount(TdUpgradeModal, {
            localVue,
            mocks: {
                $t: t => t
            }
        });
    });

    it('has the upgrade modal header', () => {
        expect(wrapper.findComponent(BModal).attributes('title'))
            .toEqual('upgrade.modal.header');
    });

    it('displays the welcome message', () => {
        expect(wrapper.find('h4').text())
            .toEqual('upgrade.modal.welcome');
    });

    it('dispplays paragrah 1', () => {
        expect(wrapper.find('.td-p1').text())
            .toEqual('upgrade.modal.p1');
    });

    it('dispplays paragrah 2', () => {
        expect(wrapper.find('.td-p2').text())
            .toEqual('upgrade.modal.p2');
    });
    
    it('shows the modal', () => {
        jest.spyOn(wrapper.vm.$bvModal, 'show');
        wrapper.vm.$bvModal.show.mockImplementation(() => {});
        wrapper.vm.show();
        expect(wrapper.vm.$bvModal.show).toHaveBeenCalled();
    });
});
