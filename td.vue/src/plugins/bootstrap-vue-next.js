import {
    BOverlay,
    BContainer,
    BNavbarToggle,
    BImg,
    BNavbarBrand,
    BCollapse,
    BNavbarNav,
    BNavItem,
    BNavbar,
    BNavText,
    BTooltip,
    BDropdownItem,
    BDropdown,
    BCol,
    BRow,
    BButton,
    BButtonGroup,
    BButtonToolbar,
    BForm,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BListGroup,
    BListGroupItem,
    BCard,
    BFormCheckbox,
    BTableSimple,
    BThead,
    BTbody,
    BTr,
    BTh,
    BTd,
    BModal,
    BTable,
    BBadge,
    BCardText,
    // Add missing components
    BFormRow,
    BFormTags,
    BDropdownItemButton,
    BInputGroup,
    BInputGroupText,
    BFormSelect,
    BFormRadioGroup,
    BCardBody
} from 'bootstrap-vue-next';

// Import Modal plugin separately to make it global
import { modalManagerPlugin } from 'bootstrap-vue-next';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';

const components = {
    BOverlay,
    BContainer,
    BNavbarToggle,
    BImg,
    BNavbarBrand,
    BCollapse,
    BNavbarNav,
    BNavItem,
    BNavbar,
    BNavText,
    BTooltip,
    BDropdownItem,
    BDropdown,
    BCol,
    BRow,
    BButton,
    BButtonGroup,
    BButtonToolbar,
    BForm,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BListGroup,
    BListGroupItem,
    BCard,
    BFormCheckbox,
    BTableSimple,
    BThead,
    BTbody,
    BTr,
    BTh,
    BTd,
    BModal,
    BTable,
    BBadge,
    BCardText,
    // Add missing components
    BFormRow,
    BFormTags,
    BDropdownItemButton,
    BInputGroup,
    BInputGroupText,
    BFormSelect,
    BFormRadioGroup,
    BCardBody
};

// This is a bootstrap-vue-next plugin that registers all required
// bootstrap-vue-next components globally for use in Vue 3
export default {
    install(app) {
        // Register individual components
        Object.entries(components).forEach(([name, component]) => {
            app.component(name, component);
        });
        
        // Register modal plugin globally
        app.use(modalManagerPlugin);
    }
};

// Export the components individually as well
export {
    BOverlay,
    BContainer,
    BNavbarToggle,
    BImg,
    BNavbarBrand,
    BCollapse,
    BNavbarNav,
    BNavItem,
    BNavbar,
    BNavText,
    BTooltip,
    BDropdownItem,
    BDropdown,
    BCol,
    BRow,
    BButton,
    BButtonGroup,
    BButtonToolbar,
    BForm,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BListGroup,
    BListGroupItem,
    BCard,
    BFormCheckbox,
    BTableSimple,
    BThead,
    BTbody,
    BTr,
    BTh,
    BTd,
    BModal,
    BTable,
    BBadge,
    BCardText,
    // Add missing components
    BFormRow,
    BFormTags,
    BDropdownItemButton,
    BInputGroup,
    BInputGroupText,
    BFormSelect,
    BFormRadioGroup,
    BCardBody,
    // Export modalManagerPlugin for direct usage
    modalManagerPlugin
};
