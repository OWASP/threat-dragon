import { shallowMount, createLocalVue } from '@vue/test-utils';

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

    const setup = (data) => {
        const localVue = createLocalVue();
        wrapper = shallowMount(TdReportEntity, {
            localVue,
            propsData: {
                outOfScope: data.outOfScope,
                entity: data.entity
            },
            mocks: {
                $t: t => t
            }
        });
    };

    beforeEach(() => {
        propsData = getData();
        setup(propsData);
    });

    const tableHasCellWithText = (expectedText) => {
        return wrapper.findAll('td')
            .filter(x => x.text().toLowerCase() === expectedText.toLowerCase())
            .exists();
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
        expect(tableHasCellWithText('1')).toEqual(true);
    });

    it('shows the second threat', () => {
        expect(tableHasCellWithText('2')).toEqual(true);
    });

    it('shows the first threat title', () => {
        expect(tableHasCellWithText('t1')).toEqual(true);
    });

    it('shows the second threat title', () => {
        expect(tableHasCellWithText('t2')).toEqual(true);
    });

    it('shows the high severity', () => {
        expect(tableHasCellWithText('High')).toEqual(true);
    });

    it('shows the medium severity', () => {
        expect(tableHasCellWithText('Medium')).toEqual(true);
    });

    it('shows the first score', () => {
        expect(tableHasCellWithText('10')).toEqual(true);
    });

    it('shows the second score', () => {
        expect(tableHasCellWithText('20')).toEqual(true);
    });

    it('shows the open status', () => {
        expect(tableHasCellWithText('Open')).toEqual(true);
    });

    it('shows the mitigated status', () => {
        expect(tableHasCellWithText('Mitigated')).toEqual(true);
    });

    it('shows the first type', () => {
        expect(tableHasCellWithText('type1')).toEqual(true);
    });

    it('shows the second type', () => {
        expect(tableHasCellWithText('type2')).toEqual(true);
    });

    it('shows the threat description for t1', () => {
        expect(tableHasCellWithText('Threat 1')).toEqual(true);
    });

    it('shows the threat description for t2', () => {
        expect(tableHasCellWithText('Threat 2')).toEqual(true);
    });

    it('shows the threat mitigation for t1', () => {
        expect(tableHasCellWithText('We did things')).toEqual(true);
    });

    it('shows the threat mitigation for t2', () => {
        expect(tableHasCellWithText('We did other things')).toEqual(true);
    });
});
