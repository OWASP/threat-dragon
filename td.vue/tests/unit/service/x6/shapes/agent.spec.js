import { AgentShape } from '@/service/x6/shapes/agent.js';

describe('service/x6/shapes/agent.js', () => {
    let victim;

    beforeEach(() => {
        victim = new AgentShape();
    });

    it('creates an agent shape', () => {
        expect(victim.constructor.name).toEqual('AgentShape');
    });

    it('has the correct type', () => {
        expect(victim.type).toEqual('tm.Agent');
    });

    it('sets the name', () => {
        const name = 'test agent';
        victim.setName(name);
        expect(victim.label).toEqual(name);
    });

    it('updates the style', () => {
        const color = '#ff0000';
        const dash = '5 5';
        const width = 2;

        victim.updateStyle(color, dash, width);

        expect(victim.getAttrByPath('body/stroke')).toEqual(color);
        expect(victim.getAttrByPath('body/strokeDasharray')).toEqual(dash);
        expect(victim.getAttrByPath('body/strokeWidth')).toEqual(width);
    });
});