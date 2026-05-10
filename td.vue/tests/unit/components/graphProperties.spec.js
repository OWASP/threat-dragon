import { BootstrapVue, BForm, BFormTextarea, BFormGroup } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import TdGraphProperties from '@/components/GraphProperties.vue';

describe('components/GraphProperties.vue', () => {
    let wrapper;

    const mountComponent = (cellRef, mutations) => {
        const localVue = createLocalVue();
        localVue.use(Vuex);
        localVue.use(BootstrapVue);
        const mockStore = new Vuex.Store({
            state: {
                cell: {
                    ref: cellRef
                }
            },
            mutations
        });

        wrapper = shallowMount(TdGraphProperties, {
            localVue,
            store: mockStore,
            mocks: {
                $t: key => key
            }
        });

        return mockStore;
    };

    const findNameInput = () => wrapper.findAllComponents(BFormTextarea)
        .filter(x => x.attributes('id') === 'name')
        .at(0);

    describe('emptyState', () => {
        beforeEach(() => {
            mountComponent(null);
        });

        it('displays the empty state message', () => {
            expect(wrapper.find('p').text()).toContain('threatmodel.properties.emptyState');
        });
    });

    describe('with data', () => {
        let entityData;
        let cellRef;

        beforeEach(() => {
            entityData = {
                type: 'tm.Flow',
                name: 'some flow',
                description: 'describing the thing',
                outOfScope: true,
                isBidirectional: true,
                reasonOutOfScope: 'someone thought so'
            };
            cellRef = {
                data: entityData,
                getData: () => entityData,
                updateStyle: jest.fn(),
                isEdge: () => false,
                setData: jest.fn(),
                setName: jest.fn()
            };
            mountComponent(cellRef);
        });

        it('has a label for name', () => {
            const group = wrapper.findAllComponents(BFormGroup)
                .filter(x => x.attributes('id') === 'name-group')
                .at(0);
            expect(group.attributes('label')).toEqual('threatmodel.properties.name');
        });

        it('displays the name in a textarea', () => {
            expect(findNameInput().attributes('value')).toEqual(entityData.name);
        });

        it('updates the diagram label with the current textarea value', () => {
            wrapper.vm.onChangeName('some flow updated');

            expect(entityData.name).toEqual('some flow updated');
            expect(cellRef.setName).toHaveBeenCalledWith('some flow updated');
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

    describe('when selection changes while editing', () => {
        let firstForm;
        let secondCell;
        let secondForm;
        let selectedName;

        const createCellRef = (id, name) => ({
            id,
            data: {
                type: 'tm.Process',
                name,
                description: '',
                outOfScope: false,
                isTrustBoundary: false,
                reasonOutOfScope: '',
                handlesCardPayment: false,
                handlesGoodsOrServices: false,
                isWebApplication: false,
                privilegeLevel: '',
                threats: []
            },
            getData() {
                return this.data;
            },
            updateStyle: jest.fn(),
            isEdge: () => false,
            setData: jest.fn(),
            setName: jest.fn(function (name) {
                this.data.name = name;
            })
        });

        beforeEach(async () => {
            const firstCell = createCellRef('first-cell', 'first process');
            secondCell = createCellRef('second-cell', 'second process');
            const mockStore = mountComponent(firstCell, {
                selectCell(state, ref) {
                    state.cell.ref = ref;
                }
            });

            firstForm = wrapper.findComponent(BForm).element;

            mockStore.commit('selectCell', secondCell);
            await wrapper.vm.$nextTick();

            secondForm = wrapper.findComponent(BForm).element;
            selectedName = findNameInput().attributes('value');
        });

        it('recreates form controls when the selected cell changes', () => {
            expect(secondForm).not.toBe(firstForm);
        });

        it('displays the newly selected cell name', () => {
            expect(selectedName).toEqual(secondCell.data.name);
        });
    });

});
