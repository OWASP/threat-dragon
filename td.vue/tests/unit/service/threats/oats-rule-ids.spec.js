import { GetContextSuggestions } from '@/service/threats/oats/context-generator.js';

describe('service/threats/oats context rule IDs', () => {
    it('reuses the v1 rule ID for an automated threat', () => {
        expect(GetContextSuggestions({
            type: 'tm.Actor',
            providesAuthentication: true
        }, 'STRIDE')[0].ruleId).toEqual('5b0d4c4e-8245-4bea-a2ad-cf0be0a441f5');
    });

    it('uses the scalping rule ID for goods and services footprinting', () => {
        expect(GetContextSuggestions({
            type: 'tm.Process',
            handlesGoodsOrServices: true
        }, 'STRIDE')[0].ruleId).toEqual('ea1adb4d-097d-45a8-8e48-b728a996f487');
        expect(GetContextSuggestions({
            type: 'tm.Process',
            handlesGoodsOrServices: true
        }, 'STRIDE').find((suggestion) => suggestion.title === 'Footprinting').ruleId)
            .toEqual('c50e8d53-5e0a-45e7-8c69-be92492ad7dc');
    });

    it('uses the footprinting rule ID for web application footprinting', () => {
        expect(GetContextSuggestions({
            type: 'tm.Process',
            isWebApplication: true
        }, 'STRIDE').find((suggestion) => suggestion.title === 'Footprinting').ruleId)
            .toEqual('20527bee-aae7-4593-acac-7a07169ccc4f');
    });
});
