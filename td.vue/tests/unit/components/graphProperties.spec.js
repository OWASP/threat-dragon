import { BootstrapVue, BFormTextarea, BFormGroup } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import TdGraphProperties from '@/components/GraphProperties.vue';

describe('components/GraphProperties.vue', () => {
    let wrapper;

    describe('emptyState', () => {
        beforeEach(() => {
            const localVue = createLocalVue();
            localVue.use(Vuex);
            localVue.use(BootstrapVue);
            localVue.use(Vuex);
            const mockStore = new Vuex.Store({
                state: {
                    cell: {
                        ref: null
                    }
                }
            });
            wrapper = shallowMount(TdGraphProperties, {
                localVue,
                store: mockStore,
                mocks: {
                    $t: key => key
                }
            });
        });

        it('displays the empty state message', () => {
            expect(wrapper.find('p').text()).toContain('threatmodel.properties.emptyState');
        });
    });

    describe('with data', () => {
        let entityData;

        beforeEach(() => {
            entityData = {
                type: 'tm.Flow',
                name: 'some flow',
                description: 'describing the thing',
                outOfScope: true,
                isBidirectional: true,
                reasonOutOfScope: 'someone thought so'
            };
            const localVue = createLocalVue();
            localVue.use(Vuex);
            localVue.use(BootstrapVue);
            localVue.use(Vuex);
            const mockStore = new Vuex.Store({
                state: {
                    cell: {
                        ref: {
                            data: entityData,
                            getData: () => entityData,
                            updateStyle: jest.fn(),
                            isEdge: () => false,
                            setData: jest.fn()
                        }
                    }
                }
            });
            wrapper = shallowMount(TdGraphProperties, {
                localVue,
                store: mockStore,
                mocks: {
                    $t: key => key
                }
            });
        });

        it('has a label for name', () => {
            const group = wrapper.findAllComponents(BFormGroup)
                .filter(x => x.attributes('id') === 'name-group')
                .at(0);
            expect(group.attributes('label')).toEqual('threatmodel.properties.name');
        });

        it('displays the name in a textarea', () => {
            const input = wrapper.findAllComponents(BFormTextarea)
                .filter(x => x.attributes('id') === 'name')
                .at(0);
            expect(input.attributes('value')).toEqual(entityData.name);
        });

        it('shows the description', () => {
            const input = wrapper.findAllComponents(BFormTextarea)
                .filter(x => x.attributes('id') === 'description')
                .at(0);
            expect(input.attributes('value')).toEqual(entityData.description);
        });

        it('has an out of scope checkbox', () => {
            const input = wrapper.find('#flowoutofscope');
            expect(input.exists()).toEqual(true);
            expect(input.element.checked).toEqual(true);
        });

        it('has a reason for out of scope', () => {
            const input = wrapper.findAllComponents(BFormTextarea)
                .filter(x => x.attributes('id') === 'reasonoutofscope')
                .at(0);
            expect(input.attributes('value')).toEqual(entityData.reasonOutOfScope);
        });

        it('has a bidirectional checkbox', () => {
            const input = wrapper.find('#bidirection');
            expect(input.exists()).toEqual(true);
            expect(input.element.checked).toEqual(true);
        });

        it('updates out of scope when toggled', async () => {
            jest.spyOn(wrapper.vm, 'onChangeScope').mockImplementation(() => {});

            const input = wrapper.find('#flowoutofscope');
            await input.setChecked(false);

            expect(entityData.outOfScope).toEqual(false);
            expect(wrapper.vm.onChangeScope).toHaveBeenCalledTimes(1);
        });

        it('updates bidirectional when toggled', async () => {
            jest.spyOn(wrapper.vm, 'onChangeBidirection').mockImplementation(() => {});

            const input = wrapper.find('#bidirection');
            await input.setChecked(false);

            expect(entityData.isBidirectional).toEqual(false);
            expect(wrapper.vm.onChangeBidirection).toHaveBeenCalledTimes(1);
        });
    });

});
