import { BootstrapVue, BFormInput, BFormTextarea } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import ExportTemplate from '@/views/ExportTemplate.vue';
import TdFormButton from '@/components/FormButton.vue';
import tmActions from '@/store/actions/threatmodel.js';

describe('ExportTemplate.vue', () => {
    let wrapper, localVue, mockRouter, mockStore, toast;

    beforeEach(() => {
        toast = { error: jest.fn(), warning: jest.fn() };
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.use(Vuex);
        mockStore = new Vuex.Store({
            state: {
                provider: { selected: 'local' },
                threatmodel: {
                    data: {
                        summary: {
                            title: 'Test Model',
                            description: 'Test description',
                        },
                    },
                },
            },
        });
        mockStore.dispatch = jest.fn();
        mockRouter = { push: jest.fn() };
        wrapper = shallowMount(ExportTemplate, {
            localVue,
            store: mockStore,
            mocks: {
                $t: (key) => key,
                $toast: toast,
                $route: { params: {} },
                $router: mockRouter,
            },
        });
    });

    it('has the save template button and cancel button', () => {
        expect(wrapper.findAllComponents(TdFormButton)).toHaveLength(2);
    });
    it('has the input fields for template name', () => {
        expect(wrapper.findComponent(BFormInput).exists()).toEqual(true);
    });
    it('has a text field for template description', () => {
        expect(wrapper.findComponent(BFormTextarea).exists()).toEqual(true);
    });
    describe('onSaveClick', () => {
        const mockEvt = { preventDefault: jest.fn() };

        beforeEach(async () => {
            await wrapper.vm.onSaveClick(mockEvt);
        });

        it('prevents default form submission', () => {
            expect(mockEvt.preventDefault).toHaveBeenCalledTimes(1);
        });

        it('dispatches templateDownload with the template metadata', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(
                tmActions.templateDownload,
                {
                    name: 'Test Model',
                    description: 'Test description',
                    tags: [],
                }
            );
        });

        it('navigates to the threat model view', () => {
            expect(mockRouter.push).toHaveBeenCalledWith({
                name: 'localThreatModel',
                params: {},
            });
        });
    });

    describe('onCancelClick', () => {
        const mockEvt = { preventDefault: jest.fn() };

        beforeEach(() => {
            wrapper.vm.onCancelClick(mockEvt);
        });

        it('prevents default', () => {
            expect(mockEvt.preventDefault).toHaveBeenCalledTimes(1);
        });

        it('navigates to the threat model route', () => {
            expect(mockRouter.push).toHaveBeenCalledWith({
                name: 'localThreatModel',
                params: {},
            });
        });
    });
});
