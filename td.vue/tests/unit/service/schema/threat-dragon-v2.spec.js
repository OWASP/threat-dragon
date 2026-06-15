import schema from '@/assets/schema/threat-dragon-v2.schema.json';

describe('assets/schema/threat-dragon-v2.schema.json', () => {
    it('allows generated threats to include a rule ID', () => {
        const threatProperties = schema.properties.detail.properties.diagrams
            .items.properties.cells.items.properties.threats.items.properties;

        expect(threatProperties.ruleId).toEqual({
            description: 'The stable ID of the rule that generated the threat',
            type: 'string',
            minLength: 2
        });
    });
});
