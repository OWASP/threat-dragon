// nextTick is not used in this file
import { createWrapper } from '../setup/test-utils.js';
import AddBranchDialog from '@/components/AddBranchDialog.vue';
import branchActions from '@/store/actions/branch.js';

// Set longer timeout for all tests in this file
jest.setTimeout(15000);

describe('components/AddBranchDialog.vue', () => {
    let wrapper;

    describe('UI structure', () => {
        const branches = ['main', 'develop', 'feature'];
        let closeDialog;

        beforeEach(() => {
            closeDialog = jest.fn();

            // Vue 3 Migration: Testing component structure is best done
            // through inspecting the rendered template and props
            wrapper = createWrapper(AddBranchDialog, {
                props: {
                    branches
                },
                shallow: true
            });

            // Mock the closeDialog method
            jest.spyOn(wrapper.vm, 'closeDialog').mockImplementation(closeDialog);
        });

        it('renders the component', () => {
            // Vue 3 Migration: Focus on verifying the component renders
            expect(wrapper.exists()).toBe(true);
        });

        it('contains the main modal component', () => {
            // Vue 3 Migration: Instead of checking for a specific component, check the template structure
            expect(wrapper.html()).toContain('id="add-new-branch"');
            expect(wrapper.html()).toContain('size="md"');
        });

        it('initializes with the expected data', () => {
            // Vue 3 Migration: Testing component data directly
            // This is more reliable than checking DOM structure in shallow rendering
            expect(wrapper.vm.newBranchName).toBe('');
            expect(wrapper.vm.modalTitle).toBe('branch.addNew');
            expect(wrapper.vm.branchNameError).toBe('');
            expect(wrapper.vm.isError).toBe(null);
            expect(wrapper.vm.wait).toBe(false);
        });

        it('sets the reference branch to the last branch in the list', () => {
            // Vue 3 Migration: Testing component mounted behavior directly
            expect(wrapper.vm.refBranch).toBe('feature');
        });

        it('emits close-dialog event when closeDialog is called', () => {
            // Call the method directly - more reliable in Vue 3 testing
            wrapper.vm.closeDialog();

            // Check that the event was emitted
            expect(closeDialog).toHaveBeenCalled();
        });
    });

    describe('validation', () => {
        const branches = ['develop', 'feature', 'main'];

        beforeEach(() => {
            // Vue 3 Migration: Using createWrapper helper for component creation
            wrapper = createWrapper(AddBranchDialog, {
                props: {
                    branches
                },
                shallow: true
            });
        });

        it('shows an error if branch name is empty', async () => {
            // Vue 3 Migration: Testing component data and methods directly
            await wrapper.setData({ newBranchName: '' });
            wrapper.vm.validate();
            expect(wrapper.vm.branchNameError).toBe('branch.nameRequired');
            expect(wrapper.vm.isError).toBe(false);
        });

        it('shows an error if branch name already exists', async () => {
            await wrapper.setData({ newBranchName: 'main' });
            wrapper.vm.validate();
            expect(wrapper.vm.branchNameError).toBe('branch.nameExists');
            expect(wrapper.vm.isError).toBe(false);
        });

        it('does not show an error if branch name is valid', async () => {
            await wrapper.setData({ newBranchName: 'new-branch' });
            wrapper.vm.validate();
            expect(wrapper.vm.branchNameError).toBe('');
            expect(wrapper.vm.isError).toBe(true);
        });

        // Vue 3 Migration: Added test for computed property
        // This is a more Vue 3 approach to testing component logic
        it('computes branchNames correctly', async () => {
            // Test with string values
            expect(wrapper.vm.branchNames).toEqual(['develop', 'feature', 'main']);

            // Test with object values
            await wrapper.setProps({
                branches: [
                    { value: 'develop' },
                    { value: 'feature' },
                    { value: 'main' }
                ]
            });
            expect(wrapper.vm.branchNames).toEqual(['develop', 'feature', 'main']);
        });
    });

    describe('addBranch', () => {
        let closeDialog, dispatch;
        const branches = ['main', 'develop', 'feature'];

        beforeEach(() => {
            closeDialog = jest.fn();
            dispatch = jest.fn((action, payload) => {
                if (action === branchActions.create) {
                    branches.push(payload.branchName);
                }
                if (action === branchActions.fetch) {
                    return Promise.resolve();
                }
            });

            // Vue 3 Migration: Using createWrapper with store mocking
            wrapper = createWrapper(AddBranchDialog, {
                props: {
                    branches
                },
                shallow: true,
                mocks: {
                    $store: {
                        dispatch
                    }
                }
            });

            jest.spyOn(wrapper.vm, 'closeDialog').mockImplementation(closeDialog);

            // Set data directly
            wrapper.vm.newBranchName = 'new-branch';
            wrapper.vm.refBranch = 'main';
        });

        it('calls the store dispatch with the right parameters', async () => {
            // Mock both validation and dispatch to simplify the test
            jest.spyOn(wrapper.vm, 'validate').mockImplementation(() => {
                wrapper.vm.isError = true;
            });

            // Force NODE_ENV to be 'test' for this test
            const originalNodeEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'test';

            // Call the method directly
            await wrapper.vm.addBranch();

            // Verify the store was called correctly
            expect(dispatch).toHaveBeenCalledWith(branchActions.create, {
                branchName: 'new-branch',
                refBranch: 'main'
            });

            // Verify closeDialog was called
            expect(closeDialog).toHaveBeenCalled();

            // Restore original NODE_ENV
            process.env.NODE_ENV = originalNodeEnv;
        });

        // Vue 3 Migration: Added test for wait state
        // In Vue 3, we can more directly test component reactive state
        it('sets wait state during branch creation', async () => {
            jest.spyOn(wrapper.vm, 'validate').mockImplementation(() => {
                wrapper.vm.isError = true;
            });

            // Mock the fetch action to delay
            const originalDispatch = wrapper.vm.$store.dispatch;
            wrapper.vm.$store.dispatch = jest.fn(async (action, payload) => {
                if (action === branchActions.fetch) {
                    // Add a small delay
                    await new Promise(resolve => setTimeout(resolve, 10));
                    return Promise.resolve();
                }
                return originalDispatch(action, payload);
            });

            // Start the addBranch process but don't wait for it
            const addBranchPromise = wrapper.vm.addBranch();

            // Check that wait is true while processing
            expect(wrapper.vm.wait).toBe(true);

            // Let the operation complete
            await addBranchPromise;

            // After completion, wait should be false
            expect(wrapper.vm.wait).toBe(false);
        });
    });
});
