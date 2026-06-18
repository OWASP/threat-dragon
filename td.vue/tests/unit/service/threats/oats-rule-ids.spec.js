import { GetContextSuggestions } from '@/service/threats/oats/context-generator.js';

const suggestionKey = ({ title, ruleId }) => `${title}:${ruleId}`;

const expectSuggestions = (element, model, expectedSuggestions) => {
    const suggestions = GetContextSuggestions(element, model);
    const actual = Object.fromEntries(
        suggestions.map((suggestion) => [suggestionKey(suggestion), suggestion])
    );

    expectedSuggestions.forEach((expectedSuggestion) => {
        expect(actual[suggestionKey(expectedSuggestion)])
            .toEqual(expect.objectContaining(expectedSuggestion));
    });

    suggestions.forEach((suggestion) => {
        expect(suggestion.ruleId).toEqual(expect.any(String));
    });
};

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

    it('adds a rule ID to the no suggestions fallback', () => {
        expect.hasAssertions();

        expectSuggestions({ type: 'tm.Actor', providesAuthentication: false }, 'STRIDE', [{
            title: 'No Suggestions available',
            type: '',
            ruleId: 'eeb8d742-5213-44b2-bfc3-c454e4e03fbf'
        }]);
    });

    it('adds rule IDs to all actor context suggestions', () => {
        expect.hasAssertions();

        expectSuggestions({ type: 'tm.Actor', providesAuthentication: true }, 'STRIDE', [{
            title: 'CAPTCHA defeat',
            type: 'threats.model.stride.elevationOfPrivilege',
            ruleId: '5b0d4c4e-8245-4bea-a2ad-cf0be0a441f5'
        }, {
            title: 'Credential stuffing',
            type: 'threats.model.stride.informationDisclosure',
            ruleId: 'da483c51-1891-46ac-8453-6b1706b2a3d6'
        }]);
    });

    it('adds rule IDs to all public flow context suggestions', () => {
        expect.hasAssertions();

        expectSuggestions({
            type: 'tm.Flow',
            isPublicNetwork: true,
            isEncrypted: false
        }, 'STRIDE', [{
            title: 'Use encryption',
            type: 'threats.model.stride.informationDisclosure',
            ruleId: '021ab22d-8d51-4501-9bb8-6dabf9c27f0d'
        }, {
            title: 'Fingerprinting',
            type: 'threats.model.stride.informationDisclosure',
            ruleId: 'f5f817d5-a067-4415-a40a-b500cb2ab9ad'
        }]);
    });

    it('adds rule IDs to encrypted flow context suggestions', () => {
        expect.hasAssertions();

        expectSuggestions({
            type: 'tm.Flow',
            isPublicNetwork: false,
            isEncrypted: true
        }, 'STRIDE', [{
            title: 'Vulnerable transport protocol',
            type: 'threats.model.stride.informationDisclosure',
            ruleId: 'ff2fca4d-dedf-46f2-b9ac-aed70055bb4d'
        }]);
    });

    it('adds rule IDs to all process context suggestions', () => {
        expect.hasAssertions();

        expectSuggestions({
            type: 'tm.Process',
            privilegeLevel: 'user',
            handlesCardPayment: true,
            handlesGoodsOrServices: true,
            isWebApplication: true
        }, 'STRIDE', [{
            title: 'Least privilege',
            type: 'threats.model.stride.elevationOfPrivilege',
            ruleId: '6463e063-e7c5-4305-9d8d-0c8e978ab86b'
        }, {
            title: 'Expedition',
            type: 'threats.model.stride.tampering',
            ruleId: 'ea1adb4d-097d-45a8-8e48-b728a996f487'
        }, {
            title: 'Vulnerability scanning',
            type: 'threats.model.stride.informationDisclosure',
            ruleId: 'd97bcb80-f96d-44af-869a-d0441761be05'
        }, {
            title: 'Denial of Service',
            type: 'threats.model.stride.elevationOfPrivilege',
            ruleId: 'ce2fe37e-0742-4278-8915-40dc2226150e'
        }, {
            title: 'Carding',
            type: 'threats.model.stride.informationDisclosure',
            ruleId: '6cc27f83-ae03-4589-8e9b-24d4c2d4d8cd'
        }, {
            title: 'Card cracking',
            type: 'threats.model.stride.informationDisclosure',
            ruleId: '505afd31-7b3f-4733-b91c-71abb488d2eb'
        }, {
            title: 'Cashing out',
            type: 'threats.model.stride.repudiation',
            ruleId: 'c7b098d3-34df-432a-ad52-8f10c4ef6b07'
        }, {
            title: 'Footprinting',
            type: 'threats.model.stride.informationDisclosure',
            ruleId: '20527bee-aae7-4593-acac-7a07169ccc4f'
        }, {
            title: 'Footprinting',
            type: 'threats.model.stride.elevationOfPrivilege',
            ruleId: 'c50e8d53-5e0a-45e7-8c69-be92492ad7dc'
        }, {
            title: 'Sniping',
            type: 'threats.model.stride.elevationOfPrivilege',
            ruleId: 'd6d15882-15d5-4da1-88a5-dc3eae0b4a64'
        }, {
            title: 'Denial of inventory',
            type: 'threats.model.stride.elevationOfPrivilege',
            ruleId: '7403fdb4-9d89-4fb7-be5c-c37ce142af5e'
        }]);
    });

    it('adds rule IDs to all store context suggestions', () => {
        expect.hasAssertions();

        expectSuggestions({
            type: 'tm.Store',
            storesCredentials: true,
            storesInventory: true,
            isEncrypted: true,
            isSigned: true,
            isALog: true
        }, 'STRIDE', [{
            title: 'Scraping',
            type: 'threats.model.stride.informationDisclosure',
            ruleId: '80f32309-4f8a-4676-993b-7a37cbf62df1'
        }, {
            title: 'Skewing',
            type: 'threats.model.stride.elevationOfPrivilege',
            ruleId: '40aee5ad-37ff-4c70-91d4-9ab6d91d1463'
        }, {
            title: 'Spamming',
            type: 'threats.model.stride.elevationOfPrivilege',
            ruleId: 'fe90a897-3ff2-47a5-94db-2a4d6f17bb57'
        }, {
            title: 'Credential cracking',
            type: 'threats.model.stride.informationDisclosure',
            ruleId: 'dc09cecf-cb06-455d-9e77-b9372bf6c8eb'
        }, {
            title: 'Account creation',
            type: 'threats.model.stride.elevationOfPrivilege',
            ruleId: 'd960d589-80da-41dc-a7c2-33136bdda7e0'
        }, {
            title: 'Account aggregation',
            type: 'threats.model.stride.spoofing',
            ruleId: '7b1c36b3-104a-4d82-97bb-a64c12284641'
        }, {
            title: 'Coupon cracking',
            type: 'threats.model.stride.tampering',
            ruleId: '3853aaed-f262-4310-98df-484c5ef6609a'
        }, {
            title: 'Scalping',
            type: 'threats.model.stride.elevationOfPrivilege',
            ruleId: 'c50e8d53-5e0a-45e7-8c69-be92492ad7dc'
        }, {
            title: 'Vulnerable encryption algorithms',
            type: 'threats.model.stride.informationDisclosure',
            ruleId: '4fb623f6-2896-4209-8689-ff1b8a932105'
        }, {
            title: 'Vulnerable cryptography',
            type: 'threats.model.stride.informationDisclosure',
            ruleId: '034095d9-9012-4cb5-a7a8-1e19ab72bba3'
        }, {
            title: 'Log contains sensetive data',
            type: 'threats.model.stride.informationDisclosure',
            ruleId: '7942656e-51dd-4b15-a38d-deab704878e1'
        }]);
    });

    it('keeps direct rule IDs when context fixup changes types for LINDDUN', () => {
        expect.hasAssertions();

        expectSuggestions({
            type: 'tm.Process',
            handlesCardPayment: true
        }, 'LINDDUN', [{
            title: 'Expedition',
            type: 'threats.model.linddun.nonCompliance',
            ruleId: 'ea1adb4d-097d-45a8-8e48-b728a996f487'
        }, {
            title: 'Cashing out',
            type: 'threats.model.linddun.nonRepudiation',
            ruleId: 'c7b098d3-34df-432a-ad52-8f10c4ef6b07'
        }]);
    });

    it('keeps direct rule IDs when context fixup changes types for CIA', () => {
        expect.hasAssertions();

        expectSuggestions({
            type: 'tm.Process',
            handlesCardPayment: true
        }, 'CIA', [{
            title: 'Cashing out',
            type: 'threats.model.cia.integrity',
            ruleId: 'c7b098d3-34df-432a-ad52-8f10c4ef6b07'
        }]);

        expectSuggestions({
            type: 'tm.Store',
            storesInventory: true,
            storesCredentials: true
        }, 'CIA', [{
            title: 'Coupon cracking',
            type: 'threats.model.cia.integrity',
            ruleId: '3853aaed-f262-4310-98df-484c5ef6609a'
        }, {
            title: 'Account aggregation',
            type: 'threats.model.cia.confidentiality',
            ruleId: '7b1c36b3-104a-4d82-97bb-a64c12284641'
        }]);
    });
});
