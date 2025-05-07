import { shallowMount } from '@vue/test-utils';
import TdReportEntity from '@/components/printed-report/ReportEntity.vue';

describe('components/printed-report/ReportEntity.vue', () => {
    let propsData, wrapper;

    const getData = () => ({
        outOfScope: false,
        entity: {
            data: {
                name: 'Some threat',
                type: 'td.Actor',
                description: 'Some actor doing some things',
                threats: [
                    {
                        number: '1',
                        title: 't1',
                        severity: 'High',
                        score: '10',
                        status: 'Open',
                        type: 'type1',
                        description: 'Threat 1',
                        mitigation: 'We did things'
                    },
                    {
                        number: '2',
                        title: 't2',
                        severity: 'Medium',
                        score: '20',
                        status: 'Mitigated',
                        type: 'type2',
                        description: 'Threat 2',
                        mitigation: 'We did other things'
                    },
                ]
            }
        }
    });

    /**
     * Vue 3 Migration: Updated to use Vue Test Utils 2.x patterns
     * Removed createLocalVue() in favor of global config
     */
    const setup = (data) => {
        wrapper = shallowMount(TdReportEntity, {
            props: {
                outOfScope: data.outOfScope,
                entity: data.entity
            },
            global: {
                mocks: {
                    $t: t => t
                }
            }
        });
    };

    beforeEach(() => {
        propsData = getData();
        setup(propsData);
    });

    /**
     * Vue 3 Migration: Updated how we check for table cell content
     * In Vue 3 Test Utils, we need a different approach to filter the elements
     */
    const tableHasCellWithText = (expectedText) => {
        const cells = wrapper.findAll('td');
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].text().toLowerCase() === expectedText.toLowerCase()) {
                return true;
            }
        }
        return false;
    };

    it('converts things to camel case', () => {
        expect(wrapper.vm.toCamelCase('FooBar')).toEqual('fooBar');
    });

    it('displays the name and data type', () => {
        expect(wrapper.find('.entity-title').text())
            .toEqual(`${propsData.entity.data.name} (threatmodel.shapes.actor)`);
    });

    it('displays the entity description', () => {
        expect(wrapper.find('.entity-description').text())
            .toContain(propsData.entity.data.description);
    });

    it('shows the first threat', () => {
        expect(tableHasCellWithText('1')).toBe(true);
    });

    it('shows the second threat', () => {
        expect(tableHasCellWithText('2')).toBe(true);
    });

    it('shows the first threat title', () => {
        expect(tableHasCellWithText('t1')).toBe(true);
    });

    it('shows the second threat title', () => {
        expect(tableHasCellWithText('t2')).toBe(true);
    });

    it('shows the high severity', () => {
        expect(tableHasCellWithText('High')).toBe(true);
    });

    it('shows the medium severity', () => {
        expect(tableHasCellWithText('Medium')).toBe(true);
    });

    it('shows the first score', () => {
        expect(tableHasCellWithText('10')).toBe(true);
    });

    it('shows the second score', () => {
        expect(tableHasCellWithText('20')).toBe(true);
    });

    it('shows the open status', () => {
        expect(tableHasCellWithText('Open')).toBe(true);
    });

    it('shows the mitigated status', () => {
        expect(tableHasCellWithText('Mitigated')).toBe(true);
    });

    it('shows the first type', () => {
        expect(tableHasCellWithText('type1')).toBe(true);
    });

    it('shows the second type', () => {
        expect(tableHasCellWithText('type2')).toBe(true);
    });

    it('shows the threat description for t1', () => {
        expect(tableHasCellWithText('Threat 1')).toBe(true);
    });

    it('shows the threat description for t2', () => {
        expect(tableHasCellWithText('Threat 2')).toBe(true);
    });

    it('shows the threat mitigation for t1', () => {
        expect(tableHasCellWithText('We did things')).toBe(true);
    });

    it('shows the threat mitigation for t2', () => {
        expect(tableHasCellWithText('We did other things')).toBe(true);
    });
});
