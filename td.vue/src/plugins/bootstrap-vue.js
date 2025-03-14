import {
    BOverlay, BContainer, BNavbarToggle, BImg, BNavbarBrand, BCollapse,
    BNavbarNav, BNavItem, BNavbar, BNavText, BTooltip, BDropdownItem,
    BDropdown, BCol, BRow, BButton, BButtonGroup, BForm, BFormGroup,
    BFormInput, BFormTextarea, BListGroup, BListGroupItem
} from "bootstrap-vue-next";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";

const components = {
    BOverlay, BContainer, BNavbarToggle, BImg, BNavbarBrand, BCollapse,
    BNavbarNav, BNavItem, BNavbar, BNavText, BTooltip, BDropdownItem,
    BDropdown, BCol, BRow, BButton, BButtonGroup, BForm, BFormGroup,
    BFormInput, BFormTextarea, BListGroup, BListGroupItem
};

export default {
    install(app) {
        Object.entries(components).forEach(([name, component]) => {
            app.component(name, component);
        });
    },
};