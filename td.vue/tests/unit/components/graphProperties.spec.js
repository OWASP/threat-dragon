import { BootstrapVue, BFormTextarea, BFormGroup, BFormCheckbox } from 'bootstrap-vue';
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
                            data: entityData
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
            const input = wrapper.findAllComponents(BFormCheckbox)
                .filter(x => x.attributes('id') === 'flowoutofscope')
                .at(0);
            expect(input.attributes('value')).toEqual(entityData.outOfScope.toString());
        });

        it('has a reason for out of scope', () => {
            const input = wrapper.findAllComponents(BFormTextarea)
                .filter(x => x.attributes('id') === 'reasonoutofscope')
                .at(0);
            expect(input.attributes('value')).toEqual(entityData.reasonOutOfScope);
        });

        it('has a bidirectional checkbox', () => {
            const input = wrapper.findAllComponents(BFormCheckbox)
                .filter(x => x.attributes('id') === 'bidirection')
                .at(0);
            expect(input.attributes('value')).toEqual(entityData.isBidirectional.toString());
        });
    });

});
