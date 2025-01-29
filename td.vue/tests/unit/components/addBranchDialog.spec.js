import { BootstrapVue, BModal, BFormInput, BFormSelect, BButton } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import AddBranchDialog from '@/components/AddBranchDialog.vue';

describe('components/AddBranchDialog.vue', () => {
    let localVue, wrapper;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
    });

    describe('with data', () => {
        const branches = ['main', 'develop', 'feature'];
        let closeAddBranchDialog;

        beforeEach(() => {
            closeAddBranchDialog = jest.fn();
            wrapper = shallowMount(AddBranchDialog, {
                localVue,
                propsData: {
                    branches
                },
                mocks: {
                    $t: key => key
                }
            });
            wrapper.vm.closeAddBranchDialog = closeAddBranchDialog;
        });

        it('displays the modal', () => {
            expect(wrapper.findComponent(BModal).exists()).toBe(true);
        });

        it('displays the branch name input', () => {
            expect(wrapper.findComponent(BFormInput).exists()).toBe(true);
        });

        it('displays the reference branch select', () => {
            expect(wrapper.findComponent(BFormSelect).exists()).toBe(true);
        });

        it('displays the add button', () => {
            expect(wrapper.findAllComponents(BButton).at(0).text()).toBe('branch.add');
        });

        it('displays the cancel button', () => {
            expect(wrapper.findAllComponents(BButton).at(1).text()).toBe('branch.cancel');
        });

        it('calls closeAddBranchDialog on cancel button click', async () => {
            await wrapper.findAllComponents(BButton).at(1).trigger('click');
            expect(closeAddBranchDialog).toHaveBeenCalled();
        });
    });

    describe('validation', () => {
        const branches = ['main', 'develop', 'feature'];

        beforeEach(() => {
            wrapper = shallowMount(AddBranchDialog, {
                localVue,
                propsData: {
                    branches
                },
                mocks: {
                    $t: key => key
                }
            });
        });

        it('shows an error if branch name is empty', async () => {
            await wrapper.setData({ newBranchName: '' });
            wrapper.vm.validate();
            expect(wrapper.vm.branchNameError).toBe('branch.nameRequired');
        });

        it('shows an error if branch name already exists', async () => {
            await wrapper.setData({ newBranchName: 'main' });
            wrapper.vm.validate();
            expect(wrapper.vm.branchNameError).toBe('branch.nameExists');
        });

        it('does not show an error if branch name is valid', async () => {
            await wrapper.setData({ newBranchName: 'new-branch' });
            wrapper.vm.validate();
            expect(wrapper.vm.branchNameError).toBe('');
        });
    });

    describe('addBranch', () => {
        let closeAddBranchDialog, dispatch;

        beforeEach(() => {
            const branches = ['main', 'develop', 'feature'];
            closeAddBranchDialog = jest.fn();
            dispatch = jest.fn((branchActions, {branchName}) => {
                branches.push(branchName);
            });
            wrapper = shallowMount(AddBranchDialog, {
                localVue,
                propsData: {
                    branches
                },
                mocks: {
                    $t: key => key,
                    $store: {
                        dispatch
                    }
                }
            });
            wrapper.vm.closeAddBranchDialog = closeAddBranchDialog;
        });

        it('dispatches the create action with correct payload', async () => {
            await wrapper.setData({ newBranchName: 'new-branch', refBranch: 'main' });
            await wrapper.vm.addBranch();
        });

        it('closes the dialog after adding the branch', async () => {
            const newBranchName = 'new-branch';
            await wrapper.setData({ newBranchName, refBranch: 'main'});
            await wrapper.vm.addBranch();
            expect(closeAddBranchDialog).toHaveBeenCalled();
        });
    });
});
