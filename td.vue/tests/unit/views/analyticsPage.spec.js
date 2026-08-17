import { shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import { createLocalVue } from '../helpers/vueTestUtils';

jest.mock('@/service/analyticsEvents', () => ({
    analyticsEvents: {
        TEST_EVENT: 'test_event',
        NO_DESC_EVENT: 'no_desc_event'
    },
    analyticsEventDescriptions: {
        test_event: 'Test Event Description'
    }
}));

import AnalyticsPage from '@/views/AnalyticsPage.vue';
import TdHero from '@/components/Hero.vue';

describe('views/AnalyticsPage.vue', () => {
    let localVue;
    let store;
    let plausibleConfig;

    const createWrapper = () => {
        return shallowMount(AnalyticsPage, {
            localVue,
            store,
            stubs: {
                'b-container': true,
                'b-row': true,
                'b-col': true,
                'b-table-simple': true,
                'b-thead': true,
                'b-tbody': true,
                'b-tr': true,
                'b-th': true,
                'b-td': true
            },
            mocks: {
                $t: (key) => key
            }
        });
    };

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(Vuex);

        plausibleConfig = {
            enabled: false,
            url: 'https://plausible.io',
            domain: ''
        };

        store = new Vuex.Store({
            getters: {
                plausibleConfig: () => plausibleConfig
            }
        });
    });

    it('renders the view', () => {
        const wrapper = createWrapper();
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.findComponent(TdHero).exists()).toBe(true);
    });

    describe('when analytics are disabled', () => {
        it('shows the disabled status message', () => {
            const wrapper = createWrapper();
            expect(wrapper.find('#analytics-status-disabled').exists()).toBe(true);
            expect(wrapper.find('#analytics-status-enabled').exists()).toBe(false);
        });
    });

    describe('when analytics are enabled', () => {
        beforeEach(() => {
            plausibleConfig.enabled = true;
            plausibleConfig.domain = 'example.com';
        });

        it('shows the enabled status message and instance details', () => {
            const wrapper = createWrapper();
            expect(wrapper.find('#analytics-status-enabled').exists()).toBe(true);
            expect(wrapper.find('#analytics-status-disabled').exists()).toBe(false);

            const instanceLink = wrapper.find('#analytics-instance-url');
            expect(instanceLink.exists()).toBe(true);
            expect(instanceLink.attributes('href')).toBe('https://plausible.io');
            expect(instanceLink.text()).toBe('https://plausible.io');

            const domainSpan = wrapper.find('#analytics-tracked-domain');
            expect(domainSpan.exists()).toBe(true);
            expect(domainSpan.text()).toBe('example.com');
        });

        it('includes data policy link', () => {
            const wrapper = createWrapper();
            const policyLink = wrapper.find('#analytics-data-policy-link');
            expect(policyLink.exists()).toBe(true);
            expect(policyLink.attributes('href')).toBe('https://plausible.io/data-policy');
        });

        it('lists all tracked events in table', () => {
            const wrapper = createWrapper();
            const table = wrapper.find('#analytics-events-table');
            expect(table.exists()).toBe(true);
        });
    });
});
