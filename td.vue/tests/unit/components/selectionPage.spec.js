import { createBootstrap } from 'bootstrap-vue-next';
import { createLocalVue, shallowMount } from '@vue/test-utils';

import SelectionPage from '@/components/SelectionPage.vue';

describe('components/SelectionPage.vue', () => {
    let localVue, wrapper;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(createBootstrap());
    });

    describe('with data', () => {
        const items = [ 'one', 'two', 'three', 'four', ({
            value: 'five',
            icon: 'lock',
            iconTooltip: 'foobar',
        }) ];
        let onItemClick;

        beforeEach(() => {
            onItemClick = jest.fn();
            wrapper = shallowMount(SelectionPage, {
                localVue,
                propsData: {
                    items,
                    onItemClick
                },
                scopedSlots: {
                    default: function () {
                        return 'Hello, world!';
                    }
                },
                mocks: {
                    $t: key => key
                }
            });
        });

        it('shows the jumbotron text', () => {
            expect(wrapper.text()).toContain('Hello, world!');
        });

        it('displays the items', () => {
            expect(wrapper.findAll('.list-group-item').at(1).text()).toEqual(items[1]);
        });

        it('filters items based on the search bar', async () => {
            await wrapper.setData({ filter: 'FOUR' });
            expect(wrapper.find('.list-group-item').text()).toEqual('four');
        });

        it('emits filter updates from the search bar model', async () => {
            await wrapper.setData({ localFilter: 'two' });
            expect(wrapper.emitted('update:filter').at(-1)).toEqual(['two']);
        });

        it('calls the action on click', async () => {
            wrapper.vm.onItemClick(items[0]);
            expect(onItemClick).toHaveBeenCalledTimes(1);
        });

        it('display the icon only on the last item', () => {
            expect(wrapper.findAll('.list-group-item').at(3).find('b-icon-stub').exists()).toBeFalsy();
            expect(wrapper.findAll('.list-group-item').at(3).find('span').text()).toEqual(items[3]);
            expect(wrapper.findAll('.list-group-item').at(4).html()).toMatch(`<font-awesome-icon icon="${items[4].icon}" title="${items[4].iconTooltip}"></font-awesome-icon>`);
        });
    });

    describe('empty state with action', () => {
        const items = [];
        let emptyStateText = 'foobar', onEmptyStateClick, onItemClick;

        beforeEach(() => {
            onEmptyStateClick = jest.fn();
            onItemClick = jest.fn();
            wrapper = shallowMount(SelectionPage, {
                localVue,
                propsData: {
                    emptyStateText,
                    items,
                    onItemClick,
                    onEmptyStateClick,
                },
                mocks: {
                    $t: key => key
                }
            });
        });

        it('shows the empty state', () => {
            expect(wrapper.find('.list-group-item').text()).toEqual(emptyStateText);
        });

        it('calls the onEmptyStateClick action', async () => {
            wrapper.vm.onEmptyStateClick();
            expect(onEmptyStateClick).toHaveBeenCalledTimes(1);
        });

        it('does not call the onItemClick action', async () => {
            wrapper.vm.onEmptyStateClick();
            expect(onItemClick).not.toHaveBeenCalled();
        });
    });

    describe('empty state with default click', () => {
        const items = [];
        let emptyStateText = 'foobar', onItemClick;

        beforeEach(() => {
            onItemClick = jest.fn();
            wrapper = shallowMount(SelectionPage, {
                localVue,
                propsData: {
                    emptyStateText,
                    items,
                    onItemClick
                },
                mocks: {
                    $t: key => key
                }
            });
        });

        it('does not call the onItemClick action', async () => {
            await wrapper.find('.list-group-item').trigger('click');
            expect(onItemClick).not.toHaveBeenCalled();
        });
    });

});
