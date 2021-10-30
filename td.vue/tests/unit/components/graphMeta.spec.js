import { BootstrapVue, BCardText } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Vuex from 'vuex';

import TdGraphMeta from '@/components/GraphMeta.vue';
import TdThreatCard from '@/components/ThreatCard.vue';

describe('components/GraphMeta.vue', () => {
    let wrapper;

    describe('emptyState', () => {
        beforeEach(() => {
            const localVue = createLocalVue();
            localVue.use(Vuex);
            localVue.use(BootstrapVue);
            localVue.component('font-awesome-icon', FontAwesomeIcon);
            localVue.use(Vuex);
            const mockStore = new Vuex.Store({
                state: {
                    cell: {
                        ref: null
                    }
                }
            });
            wrapper = shallowMount(TdGraphMeta, {
                localVue,
                store: mockStore,
                mocks: {
                    $t: key => key
                }
            });
        });

        it('displays the empty state message', () => {
            expect(wrapper.findComponent(BCardText).text()).toContain('threatmodel.properties.emptyState');
        });
    });

    describe('with data', () => {
        let entityData;

        beforeEach(() => {
            entityData = {
                threats: [{
                    status: 'Open',
                    severity: 'Medium',
                    description: 'describing the thing',
                    title: 'Some Threat',
                    type: 'Spoofing',
                    mitigation: 'Unmitigated'
                }]
            };
            const localVue = createLocalVue();
            localVue.use(Vuex);
            localVue.use(BootstrapVue);
            localVue.component('font-awesome-icon', FontAwesomeIcon);
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
            wrapper = shallowMount(TdGraphMeta, {
                localVue,
                store: mockStore,
                mocks: {
                    $t: key => key
                }
            });
        });

        it('displays the threat card', () => {
            expect(wrapper.findComponent(TdThreatCard).exists()).toEqual(true);
        });
    });

});
