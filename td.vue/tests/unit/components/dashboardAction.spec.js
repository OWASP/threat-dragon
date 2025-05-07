import { RouterLinkStub } from '@vue/test-utils';
import { createWrapper } from '../setup/test-utils.js';

import TdDashboardAction from '@/components/DashboardAction.vue';

describe('components/DashboardAction.vue', () => {
    const to = '/somewhere',
        icon = 'icon',
        iconPreface = 'foo',
        description = 'bar';
    let wrapper;

    beforeEach(() => {
        // Vue 3 Migration: When using shallow mount in Vue 3, we need to be more selective
        // about which components to stub and how
        wrapper = createWrapper(TdDashboardAction, {
            props: {
                to,
                icon,
                iconPreface,
                description
            },
            shallow: false, // Changed to false for proper nested component rendering
            stubs: {
                'router-link': RouterLinkStub,
                // Font awesome icon needs to be stubbed to avoid actual imports
                'font-awesome-icon': {
                    template: '<div class="fa-icon" :data-icon="icon.join(\',\')"><slot /></div>',
                    props: ['icon', 'size']
                }
            }
        });
    });

    // Vue 3 Migration: Grouped tests by prop for better organization
    describe('props validation', () => {
        it('has correct to prop configuration', () => {
            // Testing both prop value and definition in one test
            expect(wrapper.props().to).toEqual(to);
            expect(TdDashboardAction.props.to.required).toBe(true);
            expect(TdDashboardAction.props.to.type).toBe(String);
        });

        it('has correct icon prop configuration', () => {
            expect(wrapper.props().icon).toEqual(icon);
            expect(TdDashboardAction.props.icon.required).toBe(true);
            expect(TdDashboardAction.props.icon.type).toBe(String);
        });

        it('has correct iconPreface prop configuration', () => {
            expect(wrapper.props().iconPreface).toEqual(iconPreface);
            expect(TdDashboardAction.props.iconPreface.required).toBe(false);
            expect(TdDashboardAction.props.iconPreface.default).toEqual('fas');
            expect(TdDashboardAction.props.iconPreface.type).toBe(String);
        });

        it('has correct description prop configuration', () => {
            expect(wrapper.props().description).toEqual(description);
            expect(TdDashboardAction.props.description.required).toBe(true);
            expect(TdDashboardAction.props.description.type).toBe(String);
        });
    });

    // Vue 3 Migration: Tests for component structure and behavior
    describe('component structure', () => {
        it('passes the to prop to router-link', () => {
            // Vue 3 Migration: Using RouterLinkStub to test router-link behavior
            const link = wrapper.findComponent(RouterLinkStub);
            expect(link.exists()).toBe(true);
            expect(link.props().to).toEqual(to);
        });
        
        it('contains a container with the action content', () => {
            // Vue 3 Migration: Testing structure with class selectors
            expect(wrapper.find('.action-pane').exists()).toBe(true);
        });
        
        it('displays the icon with the correct props', () => {
            // Vue 3 Migration: Using our custom stub's data attribute for verification
            const iconEl = wrapper.find('.fa-icon');
            expect(iconEl.exists()).toBe(true);
            expect(iconEl.attributes('data-icon')).toBe(`${iconPreface},${icon}`);
        });
        
        it('displays the translated description', () => {
            // Vue 3 Migration: Since $t is mocked to return the key itself,
            // we can verify the translation was requested properly
            const expectedKey = `dashboard.actions.${description}`;
            const html = wrapper.html();
            expect(html).toContain(expectedKey);
        });
    });
    
    // Vue 3 Migration: Added tests for CSS classes and styling
    describe('component styling', () => {
        it('has the correct action-pane class', () => {
            const container = wrapper.find('.action-pane');
            expect(container.exists()).toBe(true);
            expect(container.classes()).toContain('action-pane');
            expect(container.classes()).toContain('bg-light');
            expect(container.classes()).toContain('rounded');
        });
        
        it('has the correct action-icon class on the icon', () => {
            const icon = wrapper.find('.fa-icon');
            expect(icon.exists()).toBe(true);
            expect(icon.classes()).toContain('action-icon');
        });
    });
});
