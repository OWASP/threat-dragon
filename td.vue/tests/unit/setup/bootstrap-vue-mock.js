// Mock for bootstrap-vue to prevent Vue.extend errors in tests
// This file provides a shim for bootstrap-vue components used in tests

// Create empty component stubs for all Bootstrap-Vue components
const componentFactory = (name) => ({
    name,
    render() { return null; }
});

// Common Bootstrap Vue components used in tests
const componentNames = [
    'BAlert',
    'BButton',
    'BCard',
    'BCardBody',
    'BCardHeader',
    'BCardText',
    'BCol',
    'BCollapse',
    'BContainer',
    'BDropdown',
    'BDropdownItem',
    'BForm',
    'BFormCheckbox',
    'BFormGroup',
    'BFormInput', 
    'BFormRadioGroup',
    'BFormSelect',
    'BFormTags',
    'BFormTextarea',
    'BImg',
    'BJumbotron',
    'BListGroup',
    'BListGroupItem',
    'BModal',
    'BNavbar',
    'BNavbarBrand',
    'BNavbarNav',
    'BNavbarToggle',
    'BNavItem',
    'BNavText',
    'BOverlay',
    'BRow',
    'BTable',
    'BTd',
    'BTh',
    'BThead',
    'BTbody',
    'BTr',
    'BTooltip'
];

// Create components object with all component stubs
const components = componentNames.reduce((acc, name) => {
    acc[name] = componentFactory(name);
    return acc;
}, {});

// Create a fake BootstrapVue plugin
const BootstrapVue = {
    install(Vue) {
        // Register component stubs globally
        Object.entries(components).forEach(([name, component]) => {
            Vue.component(name, component);
        });
        
        // Add $bvModal to Vue prototype
        Vue.prototype.$bvModal = {
            msgBoxConfirm: jest.fn().mockResolvedValue(true)
        };
        
        // Add any other needed bootstrap-vue features
        Vue.prototype.$bvToast = {
            toast: jest.fn()
        };
    }
};

// Export individual components and the plugin
module.exports = {
    BootstrapVue,
    ...components
};