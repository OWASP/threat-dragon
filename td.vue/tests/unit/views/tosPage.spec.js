import { createWrapper } from '../setup/test-utils.js';
import ToSPage from '@/views/ToSPage.vue';
import { useI18n } from '@/i18n';

// Mock i18n
jest.mock('@/i18n', () => {
    // Create a mock function for useI18n
    const mockT = jest.fn(key => {
        if (key === 'tos.title') return 'Terms of Service Title';
        if (key === 'tos.lastUpdated') return 'Last updated: Mock Date';
        if (key === 'tos.introduction') return 'Terms of Service introduction text';
        if (key === 'operator.operatedby') return 'Operated by';
        if (key === 'operator.name') return 'Operator Name';
        if (key === 'operator.contact') return 'Contact Info';
        if (key === 'tos.contact') return 'Contact us for questions';
        return key;
    });

    return {
        useI18n: jest.fn(() => ({
            t: mockT,
            locale: { value: 'eng' }
        })),
        __esModule: true,
        default: {
            get: jest.fn().mockReturnValue({
                global: {
                    messages: {
                        value: {
                            eng: {
                                tos: {
                                    sections: [
                                        { heading: 'Section 1', content: 'Content 1' },
                                        { heading: 'Section 2', content: 'Content 2' }
                                    ]
                                }
                            }
                        }
                    }
                }
            })
        }
    };
});

describe('ToSPage.vue', () => {
    let wrapper;
    let mockT;

    beforeEach(() => {
        // Create mock for translation function
        mockT = jest.fn(key => {
            if (key === 'tos.title') return 'Terms of Service Title';
            if (key === 'tos.lastUpdated') return 'Last updated: Mock Date';
            if (key === 'tos.introduction') return 'Terms of Service introduction text';
            if (key === 'operator.operatedby') return 'Operated by';
            if (key === 'operator.name') return 'Operator Name';
            if (key === 'operator.contact') return 'Contact Info';
            if (key === 'tos.contact') return 'Contact us for questions';
            return key;
        });
        
        // Setup the mock implementation
        useI18n.mockReturnValue({
            t: mockT,
            locale: { value: 'eng' }
        });
        
        // Create wrapper with mocks and shallow: false to render child components
        wrapper = createWrapper(ToSPage, {
            shallow: false // Need to render child components to test properly
        });
    });

    it('renders the Terms of Service page', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('has the correct component name', () => {
        expect(wrapper.vm.$options.name).toBe('ToSPage');
    });
    
    it('translates the title and content', () => {
        // Check that translations were requested
        expect(mockT).toHaveBeenCalledWith('tos.title');
        expect(mockT).toHaveBeenCalledWith('tos.lastUpdated');
        expect(mockT).toHaveBeenCalledWith('tos.introduction');
        // tos.sections is no longer directly called with t() in the component
        // expect(mockT).toHaveBeenCalledWith('tos.sections');
        expect(mockT).toHaveBeenCalledWith('tos.contact');
        expect(mockT).toHaveBeenCalledWith('operator.operatedby');
        expect(mockT).toHaveBeenCalledWith('operator.name');
        expect(mockT).toHaveBeenCalledWith('operator.contact');
        
        // Check that translated content appears in the DOM
        expect(wrapper.find('h1').text()).toBe('Terms of Service Title');
        
        // Check for structured content
        const paragraphs = wrapper.findAll('.td-description p');
        expect(paragraphs.length).toBeGreaterThan(1);
        // Not checking the date text which may change
        expect(paragraphs.at(1).text()).toBe('Terms of Service introduction text');
        
        // Check for sections
        const headings = wrapper.findAll('.td-description h2');
        expect(headings.length).toBeGreaterThan(1);
        expect(headings.at(1).text()).toBe('Section 1');
        expect(headings.at(2).text()).toBe('Section 2');
        
        // Check for contact info
        const contactParagraph = paragraphs.at(paragraphs.length - 1);
        expect(contactParagraph.text()).toBe('Contact us for questions');
    });
    
    it('applies the correct CSS classes', () => {
        // Check for jumbotron container
        expect(wrapper.find('.welcome-jumbotron').exists()).toBe(true);
        
        // Check for all content containers
        expect(wrapper.find('.td-description').exists()).toBe(true);
        expect(wrapper.find('.td-operator').exists()).toBe(true);
        // .td-contact class is defined in CSS but not actually used in the template
        // expect(wrapper.find('.td-contact').exists()).toBe(true);
        
        // Check for bootstrap classes
        expect(wrapper.find('.text-center').exists()).toBe(true);
        expect(wrapper.find('.text-left').exists()).toBe(true);
    });
    
    it('has the expected structure', () => {
        // Skip checking for container element since it might be rendered differently
        // in different test environments
        
        // Check the essential elements that should be there regardless of how the stubs are set up
        expect(wrapper.find('h1').exists()).toBe(true);
        expect(wrapper.find('.td-description').exists()).toBe(true);
    });
});