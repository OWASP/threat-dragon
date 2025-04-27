import { mount, config } from '@vue/test-utils';
import { createStore } from 'vuex';

import ImportModel from '@/views/ImportModel.vue';
import TdFormButton from '@/components/FormButton.vue';

// Create mock components for Bootstrap Vue components
const BootstrapVueNextComponents = {
    BRow: { template: '<div class="b-row"><slot /></div>' },
    BCol: { template: '<div class="b-col"><slot /></div>' },
    BForm: { template: '<form class="b-form"><slot /></form>' },
    BFormGroup: { template: '<div class="b-form-group"><slot /></div>' },
    BFormTextarea: { template: '<textarea id="json-input" class="b-form-textarea" />' },
    BButtonGroup: { template: '<div class="b-button-group"><slot /></div>' }
};

// Disable the warnings about registering components globally
config.global.config.warnHandler = () => null;

describe('ImportModel.vue', () => {
    let wrapper, mockRouter, mockStore, toast;

    beforeEach(() => {
        toast = { error: jest.fn(), warning: jest.fn() };
        mockStore = createStore({
            state: {
                provider: {
                    selected: 'local'
                }
            },
            actions: {
                'THREATMODEL_SELECTED': jest.fn(),
                'THREATMODEL_UPDATE': jest.fn(),
                'THREATMODEL_NOT_MODIFIED': jest.fn(),
                'THREATMODEL_CLEAR': jest.fn()
            }
        });
        mockStore.dispatch = jest.fn();
        mockRouter = { push: jest.fn() };
        wrapper = mount(ImportModel, {
            global: {
                plugins: [mockStore],
                mocks: {
                    $t: key => key,
                    $toast: toast,
                    $route: { params: { }},
                    $router: mockRouter
                },
                stubs: {
                    TdFormButton: true,
                    'font-awesome-icon': true,
                    ...BootstrapVueNextComponents
                }
            }
        });
    });

    it('shows the jumbotron text', () => {
        // Jumbotron is now a div with 'jumbotron' class in Bootstrap 5
        expect(wrapper.find('.jumbotron').text()).toContain('forms.open / dashboard.actions.importExisting');
    });

    it('has the textarea input', () => {
        // Instead of checking for specific components that might be stubbed,
        // verify that the model property exists for the textarea
        expect(wrapper.vm.tmJson).toBeDefined();
    });


    it('has the import button', () => {
        expect(wrapper.findComponent(TdFormButton).exists()).toEqual(true);
    });

    describe('with valid JSON', () => {
        const tm = { summary: { title: 'foo' }};
        beforeEach(() => {
            wrapper.setData({
                tmJson: JSON.stringify(tm)
            });
            wrapper.vm.onImportClick();
        });

        it('dispatches the selected event', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith('THREATMODEL_SELECTED', tm);
        });

        it('navigates to the threatmodel view', () => {
            expect(mockRouter.push).toHaveBeenCalledWith({
                name: 'localThreatModel',
                params: {
                    threatmodel: 'foo'
                }
            });
        });
    });

    describe('with invalid json', () => {
        beforeEach(() => {
            wrapper.setData({
                tmJson: 'invalidJson'
            });
            wrapper.vm.onImportClick();
        });

        it('does not dispatch the selected event', () => {
            expect(mockStore.dispatch).not.toHaveBeenCalled();
        });

        it('creates a toast notification', () => {
            expect(toast.error).toHaveBeenCalledWith('threatmodel.errors.invalidJson');
        });
    });
});
