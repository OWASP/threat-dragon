import { BootstrapVue } from 'bootstrap-vue';
import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';

import { createLocalVue, mountOptions } from '../helpers/vueTestUtils';
import ImportModel from '@/views/ImportModel.vue';
import TdFormButton from '@/components/FormButton.vue';

import demoThreatModel from '../service/migration/td-test-model';
import otmModel from '../service/migration/otm-test-model';
import tmBomModel from '../service/migration/tmbom-test-model';
import v1ThreatModel from '../service/migration/v1-test-model';
import { importOtm } from '@/service/migration/otm/otm';
import threatDragonV1 from '@/service/migration/tdV1/threatDragonV1';
import { importTmbom } from '@/service/migration/tmBom/tmBom';

jest.mock('@/service/migration/otm/otm');
jest.mock('@/service/migration/tdV1/threatDragonV1');
jest.mock('@/service/migration/tmBom/tmBom');

describe('views/ImportModel.vue', () => {
    let wrapper, localVue, mockRouter, mockStore, toast;

    beforeEach(() => {
        toast = { error: jest.fn(), warning: jest.fn() };
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
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

    describe('importing valid JSON', () => {
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

        it('creates a toast notification', () => {
            expect(toast.warning).toHaveBeenCalledWith('threatmodel.warnings.jsonSchema');
        });
    });

    describe('importing valid threat model', () => {
        const tm = demoThreatModel;
        beforeEach(() => {
            wrapper.setData({
                tmJson: JSON.stringify(tm)
            });
            wrapper.vm.onImportClick();
        });

        it('dispatches the selected event', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith('THREATMODEL_SELECTED', tm);
        });

        it('does not provide a toast warning', () => {
            expect(toast.warning).not.toHaveBeenCalled();
        });
    });

    describe('migrating Vi threat model', () => {
        const newFileName = '';
        const tm = v1ThreatModel;
        beforeEach(() => {
            wrapper.setData({
                tmJson: JSON.stringify(tm)
            });
            wrapper.vm.onImportClick();
        });

        it('migrates the V1 threat model to V2', () => {
            expect(threatDragonV1.read).toHaveBeenCalledWith(tm);
        });

        it('provides a toast warning', () => {
            expect(toast.warning).toHaveBeenCalledWith('threatmodel.warnings.v1Translate', {'timeout': false});
        });

        it('dispatches the update event for new file name', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith('THREATMODEL_UPDATE', { fileName: newFileName });
        });
    });

    describe('converting OTM threat model', () => {
        const newFileName = '';
        const tm = otmModel;
        beforeEach(() => {
            wrapper.setData({
                tmJson: JSON.stringify(tm)
            });
            wrapper.vm.onImportClick();
        });

        it('converts the model from OTM', () => {
            expect(importOtm).toHaveBeenCalledWith(tm);
        });

        it('provides a toast warning', () => {
            expect(toast.warning).toHaveBeenCalledWith('threatmodel.warnings.otmImported', {'timeout': false});
        });

        it('dispatches the update event for new file name', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith('THREATMODEL_UPDATE', { fileName: newFileName });
        });
    });

    describe('converting TM-BOM threat model', () => {
        const newFileName = '';
        const tm = tmBomModel;
        beforeEach(() => {
            wrapper.setData({
                tmJson: JSON.stringify(tm)
            });
            wrapper.vm.onImportClick();
        });

        it('converts the model from TM-BOM', () => {
            expect(importTmbom).toHaveBeenCalledWith(tm);
        });

        it('provides a toast warning', () => {
            expect(toast.warning).toHaveBeenCalledWith('threatmodel.warnings.tmBomImported', {'timeout': false});
        });

        it('dispatches the update event for new file name', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith('THREATMODEL_UPDATE', { fileName: newFileName });
        });
    });

    describe('with desktop application', () => {
        const tm = { summary: { title: 'foo' }};
        beforeEach(() => {
            mockStore.state.provider.selected = 'desktop';
            wrapper.setData({
                tmJson: JSON.stringify(tm)
            });
            window.electronAPI = {
                modelOpened: jest.fn()
            };
            wrapper.vm.onImportClick();
        });

        it('notifies the desktop server', () => {
            expect(window.electronAPI.modelOpened).toHaveBeenCalled();
        });

        it('dispatches the threatmodel selected event', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith('THREATMODEL_SELECTED', tm);
        });

        it('navigates to desktop threatmodel view', () => {
            expect(mockRouter.push).toHaveBeenCalledWith({
                name: 'desktopThreatModel', 
                params: { threatmodel: 'foo' }
            });
        });
    });

    describe('importing invalid json', () => {
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

    describe('importing model with missing title', () => {
        const tm = { project: { description: 'foo' }};
	    beforeEach(() => {
	        wrapper.setData({
	            tmJson: JSON.stringify(tm)
	        });
	        wrapper.vm.onImportClick();
	    });
	
	    it('dispatches the selected event', () => {
	        expect(mockStore.dispatch).toHaveBeenCalled();
	    });
	
	    it('creates a toast error notification', () => {
	        expect(toast.error).toHaveBeenCalled();
	    });

        it('does not change the threatmodel view', () => {
		    expect(mockRouter.push).not.toHaveBeenCalled();
        });
    });
});
