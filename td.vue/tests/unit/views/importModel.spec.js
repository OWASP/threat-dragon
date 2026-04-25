import { createBootstrap } from 'bootstrap-vue-next';
import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';

import { createLocalVue, mountOptions } from '../helpers/vueTestUtils';
import ImportModel from '@/views/ImportModel.vue';
import TdFormButton from '@/components/FormButton.vue';

describe('ImportModel.vue', () => {
    let wrapper, localVue, mockRouter, mockStore, toast;

    beforeEach(() => {
        toast = { error: jest.fn(), warning: jest.fn() };
        localVue = createLocalVue();
        localVue.use(createBootstrap());
        mockStore = createStore({
            state: {
                provider: {
                    selected: 'local'
                }
            }
        });
        mockStore.dispatch = jest.fn();
        mockRouter = { push: jest.fn() };
        wrapper = mount(ImportModel, mountOptions(localVue, {
            store: mockStore,
            mocks: {
                $t: key => key,
                $toast: toast,
                $route: { params: { }},
                $router: mockRouter
            }
        }));
    });

    it('shows the jumbotron text', () => {
        expect(wrapper.text()).toContain('forms.open');
        expect(wrapper.text()).toContain('dashboard.actions.importExisting');
    });

    it('has the textarea input', () => {
        expect(wrapper.find('#json-input').exists()).toEqual(true);
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
                params: { threatmodel: 'foo' }
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
