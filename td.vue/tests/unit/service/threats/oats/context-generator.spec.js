import cia from '@/service/threats/models/cia';
import linddun from '@/service/threats/models/linddun';
import stride from '@/service/threats/models/stride';

import { GetContextSuggestions } from '@/service/threats/oats/context-generator';

describe('service/threats/oats/context-generator.js', () => {
    describe('suggestions for Actor elements', () => {
        const elementType = 'tm.Actor';

        describe('suggestions when an unauthenticated Actor', () => {
            const element = {type: elementType, providesAuthentication: false};

            it('provides default suggestion for STRIDE', () => {
                const suggestions = GetContextSuggestions(element, 'STRIDE');
                expect(suggestions).toHaveLength(1);
                expect(suggestions[0].type).toBe('');
            });

            it('provides default suggestion for LINDDUN', () => {
                const suggestions = GetContextSuggestions(element, 'LINDDUN');
                expect(suggestions).toHaveLength(1);
                expect(suggestions[0].type).toBe('');
            });

            it('provides default suggestion for CIA', () => {
                const suggestions = GetContextSuggestions(element, 'CIA');
                expect(suggestions).toHaveLength(1);
                expect(suggestions[0].type).toBe('');
            });

            it('provides default suggestion for EoP', () => {
                const suggestions = GetContextSuggestions(element, 'EoP');
                expect(suggestions).toHaveLength(1);
                expect(suggestions[0].type).toBe('');
            });
        });

        describe('suggestions when Actor provides Authentication', () => {
            const element = {type: elementType, providesAuthentication: true};

            it('provides suggestion for STRIDE', () => {
                const suggestions = GetContextSuggestions(element, 'STRIDE');
                const typeCheck = stride.all.spoofing;
                expect(suggestions).toHaveLength(2);
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestion for LINDDUN', () => {
                const suggestions = GetContextSuggestions(element, 'LINDDUN');
                const typeCheck = linddun.actor.identifiability;
                expect(suggestions.length).toBeGreaterThan(1);
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestion for CIA', () => {
                const suggestions = GetContextSuggestions(element, 'CIA');
                const typeCheck = cia.integrity;
                expect(suggestions.length).toBeGreaterThan(1);
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });
        
            it('provides default suggestion for EoP', () => {
                const suggestions = GetContextSuggestions(element, 'EoP');
                expect(suggestions).toHaveLength(1);
                expect(suggestions[0].type).toBe('');
            });
        });
    });

    describe('suggestions for Flow elements', () => {
        const elementType = 'tm.Flow';

        describe('suggestions for private unencrypted network', () => {
            const element = {type: elementType, isPublicNetwork: false, isEncrypted: false};

            it('provides default suggestion for STRIDE', () => {
                const suggestions = GetContextSuggestions(element, 'STRIDE');
                expect(suggestions).toHaveLength(1);
                expect(suggestions[0].type).toBe('');
            });

            it('provides default suggestion for LINDDUN', () => {
                const suggestions = GetContextSuggestions(element, 'LINDDUN');
                expect(suggestions).toHaveLength(1);
                expect(suggestions[0].type).toBe('');
            });

            it('provides default suggestion for CIA', () => {
                const suggestions = GetContextSuggestions(element, 'CIA');
                expect(suggestions).toHaveLength(1);
                expect(suggestions[0].type).toBe('');
            });
        });

        describe('suggestions for public unencrypted network', () => {
            const element = {type: elementType, isPublicNetwork: true, isEncrypted: false};

            it('provides suggestion for STRIDE', () => {
                const suggestions = GetContextSuggestions(element, 'STRIDE');
                const typeCheck = stride.flow.informationDisclosure;
                expect(suggestions).toHaveLength(2);
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestion for LINDDUN', () => {
                const suggestions = GetContextSuggestions(element, 'LINDDUN');
                const typeCheck = linddun.default.disclosureOfInformation;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestion for CIA', () => {
                const suggestions = GetContextSuggestions(element, 'CIA');
                const typeCheck = cia.confidentiality;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });
        });

        describe('suggestions for encrypted network', () => {
            const element = {type: elementType, isEncrypted: true};

            it('provides suggestion for STRIDE', () => {
                const suggestions = GetContextSuggestions(element, 'STRIDE');
                const typeCheck = stride.flow.informationDisclosure;
                expect(suggestions).toHaveLength(1);
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestion for LINDDUN', () => {
                const suggestions = GetContextSuggestions(element, 'LINDDUN');
                const typeCheck = linddun.default.disclosureOfInformation;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestion for CIA', () => {
                const suggestions = GetContextSuggestions(element, 'CIA');
                const typeCheck = cia.confidentiality;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });
        });

        describe('suggestions for public network', () => {
            const element = {type: elementType, isPublicNetwork: true, isEncrypted: false};
    
            it('provides suggestion for STRIDE', () => {
                const suggestions = GetContextSuggestions(element, 'STRIDE');
                const typeCheck = stride.flow.informationDisclosure;
                expect(suggestions).toHaveLength(2);
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });
    
            it('provides suggestion for LINDDUN', () => {
                const suggestions = GetContextSuggestions(element, 'LINDDUN');
                const typeCheck = linddun.default.linkability;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });
    
            it('provides suggestion for CIA', () => {
                const suggestions = GetContextSuggestions(element, 'CIA');
                const typeCheck = cia.confidentiality;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });
        });
    });

    describe('suggestions for Process elements', () => {
        const elementType = 'tm.Process';

        describe('suggestions for all processes', () => {
            const element = {type: elementType};

            it('provides suggestions for STRIDE', () => {
                const suggestions = GetContextSuggestions(element, 'STRIDE');
                const typeCheck = stride.process.tampering;
                expect(suggestions).toHaveLength(3);
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestions for LINDDUN', () => {
                const suggestions = GetContextSuggestions(element, 'LINDDUN');
                const typeCheck = linddun.default.disclosureOfInformation;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestions for CIA', () => {
                const suggestions = GetContextSuggestions(element, 'CIA');
                const typeCheck = cia.confidentiality;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });
        });

        describe('suggestions for Card Payment processes', () => {
            const element = {type: elementType, handlesCardPayment: true};

            it('provides suggestions for STRIDE', () => {
                const suggestions = GetContextSuggestions(element, 'STRIDE');
                const typeCheck = stride.process.repudiation;
                expect(suggestions.length).toBeGreaterThan(3);
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestions for LINDDUN', () => {
                const suggestions = GetContextSuggestions(element, 'LINDDUN');
                const typeCheck = linddun.default.nonRepudiation;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestions for CIA', () => {
                const suggestions = GetContextSuggestions(element, 'CIA');
                const typeCheck = cia.integrity;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });
        });

        describe('suggestions for web application processes', () => {
            const element = {type: elementType, isWebApplication: true};

            it('provides suggestions for STRIDE', () => {
                const suggestions = GetContextSuggestions(element, 'STRIDE');
                const typeCheck = stride.process.informationDisclosure;
                expect(suggestions.length).toBeGreaterThan(3);
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestions for LINDDUN', () => {
                const suggestions = GetContextSuggestions(element, 'LINDDUN');
                const typeCheck = linddun.default.disclosureOfInformation;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestions for CIA', () => {
                const suggestions = GetContextSuggestions(element, 'CIA');
                const typeCheck = cia.confidentiality;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });
        });

        describe('suggestions for processes handling Goods/Services', () => {
            const element = {type: elementType, handlesGoodsOrServices: true};

            it('provides suggestions for STRIDE', () => {
                const suggestions = GetContextSuggestions(element, 'STRIDE');
                const typeCheck = stride.process.informationDisclosure;
                expect(suggestions.length).toBeGreaterThanOrEqual(6);
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestions for LINDDUN', () => {
                const suggestions = GetContextSuggestions(element, 'LINDDUN');
                const typeCheck = linddun.default.disclosureOfInformation;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestions for CIA', () => {
                const suggestions = GetContextSuggestions(element, 'CIA');
                const typeCheck = cia.integrity;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });
        });

        describe('suggestions for privileged processes', () => {
            const element = {type: elementType, privilegeLevel: 'privileged'};

            it('provides suggestions for STRIDE', () => {
                const suggestions = GetContextSuggestions(element, 'STRIDE');
                const typeCheck = stride.process.informationDisclosure;
                expect(suggestions.length).toBeGreaterThanOrEqual(4);
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestions for LINDDUN', () => {
                const suggestions = GetContextSuggestions(element, 'LINDDUN');
                const typeCheck = linddun.default.detectability;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestions for CIA', () => {
                const suggestions = GetContextSuggestions(element, 'CIA');
                const typeCheck = cia.integrity;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });
        });

        describe('suggestions for processes with indeterminate privilege', () => {
            const element = {type: elementType, privilegeLevel: ''};
    
            it('provides suggestions for STRIDE', () => {
                const suggestions = GetContextSuggestions(element, 'STRIDE');
                const typeCheck = stride.process.informationDisclosure;
                expect(suggestions.length).toBeGreaterThanOrEqual(3);
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });
    
            it('provides suggestions for LINDDUN', () => {
                const suggestions = GetContextSuggestions(element, 'LINDDUN');
                const typeCheck = linddun.default.disclosureOfInformation;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });
    
            it('provides suggestions for CIA', () => {
                const suggestions = GetContextSuggestions(element, 'CIA');
                const typeCheck = cia.confidentiality;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });
        });
    });

    describe('suggestions for Store elements', () => {
        const elementType = 'tm.Store';

        describe('suggestions for all stores', () => {
            const element = {type: elementType};

            it('provides suggestions for STRIDE', () => {
                const suggestions = GetContextSuggestions(element, 'STRIDE');
                const typeCheck = stride.store.informationDisclosure;
                expect(suggestions).toHaveLength(3);
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestions for LINDDUN', () => {
                const suggestions = GetContextSuggestions(element, 'LINDDUN');
                const typeCheck = linddun.default.linkability;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestions for CIA', () => {
                const suggestions = GetContextSuggestions(element, 'CIA');
                const typeCheck = cia.confidentiality;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });
        });

        describe('suggestions for credential stores', () => {
            const element = {type: elementType, storesCredentials: true};

            it('provides suggestions for STRIDE', () => {
                const suggestions = GetContextSuggestions(element, 'STRIDE');
                const typeCheck = stride.store.informationDisclosure;
                expect(suggestions.length).toBeGreaterThanOrEqual(6);
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestions for LINDDUN', () => {
                const suggestions = GetContextSuggestions(element, 'LINDDUN');
                const typeCheck = linddun.default.identifiability;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestions for CIA', () => {
                const suggestions = GetContextSuggestions(element, 'CIA');
                const typeCheck = cia.confidentiality;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });
        });

        describe('suggestions for inventory stores', () => {
            const element = {type: elementType, storesInventory: true};
    
            it('provides suggestions for STRIDE', () => {
                const suggestions = GetContextSuggestions(element, 'STRIDE');
                const typeCheck = stride.store.informationDisclosure;
                expect(suggestions.length).toBeGreaterThanOrEqual(5);
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });
    
            it('provides suggestions for LINDDUN', () => {
                const suggestions = GetContextSuggestions(element, 'LINDDUN');
                const typeCheck = linddun.default.detectability;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });
    
            it('provides suggestions for CIA', () => {
                const suggestions = GetContextSuggestions(element, 'CIA');
                const typeCheck = cia.confidentiality;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });
        });

        describe('suggestions for encrypted stores', () => {
            const element = {type: elementType, isEncrypted: true};

            it('provides suggestions for STRIDE', () => {
                const suggestions = GetContextSuggestions(element, 'STRIDE');
                const typeCheck = stride.store.informationDisclosure;
                expect(suggestions.length).toBeGreaterThanOrEqual(4);
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestions for LINDDUN', () => {
                const suggestions = GetContextSuggestions(element, 'LINDDUN');
                const typeCheck = linddun.default.disclosureOfInformation;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestions for CIA', () => {
                const suggestions = GetContextSuggestions(element, 'CIA');
                const typeCheck = cia.confidentiality;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });
        });

        describe('suggestions for signed stores', () => {
            const element = {type: elementType, isSigned: true};

            it('provides suggestions for STRIDE', () => {
                const suggestions = GetContextSuggestions(element, 'STRIDE');
                const typeCheck = stride.store.informationDisclosure;
                expect(suggestions.length).toBeGreaterThanOrEqual(4);
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestions for LINDDUN', () => {
                const suggestions = GetContextSuggestions(element, 'LINDDUN');
                const typeCheck = linddun.default.disclosureOfInformation;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestions for CIA', () => {
                const suggestions = GetContextSuggestions(element, 'CIA');
                const typeCheck = cia.confidentiality;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });
        });

        describe('suggestions for log stores', () => {
            const element = {type: elementType, isALog: true};

            it('provides suggestions for STRIDE', () => {
                const suggestions = GetContextSuggestions(element, 'STRIDE');
                const typeCheck = stride.store.informationDisclosure;
                expect(suggestions.length).toBeGreaterThanOrEqual(4);
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestions for LINDDUN', () => {
                const suggestions = GetContextSuggestions(element, 'LINDDUN');
                const typeCheck = linddun.default.disclosureOfInformation;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });

            it('provides suggestions for CIA', () => {
                const suggestions = GetContextSuggestions(element, 'CIA');
                const typeCheck = cia.confidentiality;
                expect(suggestions.some((suggestion) => suggestion.type === typeCheck)).toBe(true);
            });
        });
    });
});
