import { BootstrapVue, BJumbotron, BListGroupItem } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';

import SelectionPage from '@/components/SelectionPage.vue';

describe('components/SelectionPage.vue', () => {
    let localVue, wrapper;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
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
            expect(wrapper.findComponent(BJumbotron).text()).toEqual('Hello, world!');
        });

        it('displays the items', () => {
            expect(wrapper.findAllComponents(BListGroupItem).at(1).text()).toEqual(items[1]);
        });

        it('filters items based on the search bar', async () => {
            await wrapper.setData({ filter: 'FOUR' });
            expect(wrapper.findComponent(BListGroupItem).text()).toEqual('four');
        });

        it('calls the action on click', async () => {
            await wrapper.findComponent(BListGroupItem).trigger('click');
            expect(onItemClick).toHaveBeenCalledTimes(1);
        });

        it('display the icon only on the last item', () => {
            expect(wrapper.findAllComponents(BListGroupItem).at(3).find('b-icon-stub').exists()).toBeFalsy();
            expect(wrapper.findAllComponents(BListGroupItem).at(3).find('span').text()).toEqual(items[3]);
            expect(wrapper.findAllComponents(BListGroupItem).at(4).html()).toMatch(`<font-awesome-icon icon="${items[4].icon}" title="${items[4].iconTooltip}"></font-awesome-icon>`);
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
            expect(wrapper.findComponent(BListGroupItem).text()).toEqual(emptyStateText);
        });

        it('calls the onEmptyStateClick action', async () => {
            await wrapper.findComponent(BListGroupItem).trigger('click');
            expect(onEmptyStateClick).toHaveBeenCalledTimes(1);
        });

        it('does not call the onItemClick action', async () => {
            await wrapper.findComponent(BListGroupItem).trigger('click');
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
            await wrapper.findComponent(BListGroupItem).trigger('click');
            expect(onItemClick).not.toHaveBeenCalled();
        });
    });

});

