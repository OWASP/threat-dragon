import { BootstrapVue, BListGroupItem } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';

import SelectionPage from '@/components/SelectionPage.vue';
import TdHero from '@/components/Hero.vue';

const tMock = key => key;

describe('components/SelectionPage.vue', () => {
    let localVue;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
    });

    const createWrapper = (props = {}, options = {}) => shallowMount(SelectionPage, {
        localVue,
        propsData: { items: [], onItemClick: jest.fn(), ...props },
        mocks: { $t: tMock },
        ...options,
    });

    describe('with data', () => {
        const items = ['one', 'two', 'three', 'four', {
            value: 'five', icon: 'lock', iconTooltip: 'foobar',
        }];
        let onItemClick, wrapper;

        beforeEach(() => {
            onItemClick = jest.fn();
            wrapper = createWrapper({ items, onItemClick }, {
                scopedSlots: { default() { return 'Hello, world!'; } },
            });
        });

        it('shows the hero text', () => {
            expect(wrapper.findComponent(TdHero).text()).toBe('Hello, world!');
        });

        it('displays the items', () => {
            expect(wrapper.findAllComponents(BListGroupItem).at(1).text()).toBe(items[1]);
        });

        it('filters items based on the search bar', async () => {
            await wrapper.setData({ filter: 'FOUR' });
            expect(wrapper.findComponent(BListGroupItem).text()).toBe('four');
        });

        it('emits filter updates from the search bar model', async () => {
            await wrapper.setData({ localFilter: 'two' });
            expect(wrapper.emitted('update:filter').at(-1)).toEqual(['two']);
        });

        it('calls the action on click', async () => {
            await wrapper.findComponent(BListGroupItem).trigger('click');
            expect(onItemClick).toHaveBeenCalledTimes(1);
        });

        it('displays the icon only on the last (object) item', () => {
            const listItems = wrapper.findAllComponents(BListGroupItem);
            expect(listItems.at(3).find('b-icon-stub').exists()).toBe(false);
            expect(listItems.at(3).find('span').text()).toBe(items[3]);
            expect(listItems.at(4).html()).toMatch(
                `<font-awesome-icon icon="${items[4].icon}" title="${items[4].iconTooltip}"></font-awesome-icon>`,
            );
        });
    });

    describe('empty state', () => {
        let onEmptyStateClick, onItemClick, wrapper;

        beforeEach(() => {
            onItemClick = jest.fn();
            onEmptyStateClick = jest.fn();
        });

        describe('with onEmptyStateClick handler', () => {
            beforeEach(() => {
                wrapper = createWrapper({
                    items: [], emptyStateText: 'foobar',
                    onItemClick, onEmptyStateClick,
                });
            });

            it('shows the empty state text', () => {
                expect(wrapper.findComponent(BListGroupItem).text()).toBe('foobar');
            });

            it('calls onEmptyStateClick on click', async () => {
                await wrapper.findComponent(BListGroupItem).trigger('click');
                expect(onEmptyStateClick).toHaveBeenCalledTimes(1);
            });

            it('does not call onItemClick on click', async () => {
                await wrapper.findComponent(BListGroupItem).trigger('click');
                expect(onItemClick).not.toHaveBeenCalled();
            });
        });

        describe('without onEmptyStateClick handler', () => {
            beforeEach(() => {
                wrapper = createWrapper({ items: [], emptyStateText: 'foobar', onItemClick });
            });

            it('does not call onItemClick on click', async () => {
                await wrapper.findComponent(BListGroupItem).trigger('click');
                expect(onItemClick).not.toHaveBeenCalled();
            });
        });
    });

    describe('page prop', () => {
        let wrapper;

        beforeEach(() => {
            wrapper = createWrapper({
                items: ['repo1', 'repo2', 'repo3'],
                page: 1, pageNext: true, pagePrev: false,
            });
        });

        it('initializes pageRef from the page prop', () => {
            expect(wrapper.vm.pageRef).toBe(1);
        });

        it('updates pageRef when the page prop changes', async () => {
            await wrapper.setProps({ page: 3 });
            expect(wrapper.vm.pageRef).toBe(3);
        });

        it('renders the page number in the pagination button', () => {
            expect(wrapper.findAll('button').at(1).text()).toBe('1');
        });

        it('updates rendered page number when page prop changes', async () => {
            await wrapper.setProps({ page: 5 });
            expect(wrapper.findAll('button').at(1).text()).toBe('5');
        });
    });

    describe('pagination buttons', () => {
        let paginate, wrapper;

        beforeEach(() => {
            paginate = jest.fn();
            wrapper = createWrapper({
                items: ['repo1', 'repo2'],
                paginate, page: 3, pageNext: true, pagePrev: true,
            });
        });

        const prevBtn = () => wrapper.findAll('button').at(0);
        const nextBtn = () => wrapper.findAll('button').at(2);

        it('renders Previous, page number, and Next buttons', () => {
            const buttons = wrapper.findAll('button');
            expect(buttons).toHaveLength(3);
            expect(buttons.at(0).text()).toBe('Previous');
            expect(buttons.at(1).text()).toBe('3');
            expect(buttons.at(2).text()).toBe('Next');
        });

        it('disables Previous when pagePrev is false', async () => {
            await wrapper.setProps({ pagePrev: false });
            expect(prevBtn().attributes('disabled')).toBeDefined();
        });

        it('disables Next when pageNext is false', async () => {
            await wrapper.setProps({ pageNext: false });
            expect(nextBtn().attributes('disabled')).toBeDefined();
        });

        it('enables Previous when pagePrev is true', () => {
            expect(prevBtn().attributes('disabled')).toBeUndefined();
        });

        it('enables Next when pageNext is true', () => {
            expect(nextBtn().attributes('disabled')).toBeUndefined();
        });

        it('calls paginate with pageRef-1 when Previous is clicked', () => {
            prevBtn().trigger('click');
            expect(paginate).toHaveBeenCalledWith(2);
        });

        it('calls paginate with pageRef+1 when Next is clicked', () => {
            nextBtn().trigger('click');
            expect(paginate).toHaveBeenCalledWith(4);
        });

        it('updates pageRef when Previous is clicked', () => {
            prevBtn().trigger('click');
            expect(wrapper.vm.pageRef).toBe(2);
        });

        it('updates pageRef when Next is clicked', () => {
            nextBtn().trigger('click');
            expect(wrapper.vm.pageRef).toBe(4);
        });
    });

    describe('onBackClick', () => {

        let onBackClick, wrapper;

        beforeEach(() => {
            onBackClick = jest.fn();
        });

        it('displays the back item when showBackItem is true', () => {
            wrapper = createWrapper({ items: ['item1', 'item2'], showBackItem: true, onBackClick });
            expect(wrapper.text()).toContain('...');
        });

        it('does not display the back item when showBackItem is false', () => {
            wrapper = createWrapper({ items: ['item1', 'item2'] });
            expect(wrapper.text()).not.toContain('...');
        });

        it('calls onBackClick when the back item is clicked', () => {
            wrapper = createWrapper({ items: ['item1', 'item2'], showBackItem: true, onBackClick });
            wrapper.find('a').trigger('click');
            expect(onBackClick).toHaveBeenCalledTimes(1);
        });
    });

    describe('items prop validator', () => {
        const validator = SelectionPage.props.items.validator;

        it('accepts an array of strings', () => {
            expect(validator(['a', 'b', 'c'])).toBe(true);
        });

        it('accepts an array of objects with value string', () => {
            expect(validator([{ value: 'a' }, { value: 'b' }])).toBe(true);
        });

        it('accepts objects with value, icon, and iconTooltip', () => {
            expect(validator([{ value: 'a', icon: 'lock', iconTooltip: 'locked' }])).toBe(true);
        });

        it('throws on a non-array', () => {
            expect(() => validator('not-array')).toThrow();
        });

        it('rejects an item that is not string or object with value', () => {
            expect(validator([42])).toBe(false);
        });

        it('rejects an object with icon but missing value', () => {
            expect(validator([{ icon: 'lock' }])).toBe(false);
        });
    });

    describe('filter (client-side search)', () => {
        const items = [
            { value: 'alpha-repo', icon: 'lock', iconTooltip: 'protected' },
            'beta-repo',
            'gamma-service',
        ];
        let wrapper;

        beforeEach(() => {
            wrapper = createWrapper({ items, filter: '' });
        });

        it('shows all items when filter is empty', () => {
            expect(wrapper.vm.displayedItems).toHaveLength(3);
        });

        it('filters by name matching the filter string', async () => {
            await wrapper.setProps({ filter: 'beta' });
            expect(wrapper.vm.displayedItems).toHaveLength(1);
            expect(wrapper.vm.displayedItems[0]).toContain('beta-repo');
        });

        it('is case-insensitive when filtering', async () => {
            await wrapper.setProps({ filter: 'ALPHA' });
            expect(wrapper.vm.displayedItems).toHaveLength(1);
            expect(wrapper.vm.displayedItems[0].value).toContain('alpha-repo');
        });

        it('filters based on value property for object items', async () => {
            await wrapper.setProps({ filter: 'alpha' });
            expect(wrapper.vm.displayedItems).toHaveLength(1);
        });

        it('shows empty list when filter matches nothing', async () => {
            await wrapper.setProps({ filter: 'zzznonexistent' });
            expect(wrapper.vm.displayedItems).toHaveLength(0);
        });
    });
});
