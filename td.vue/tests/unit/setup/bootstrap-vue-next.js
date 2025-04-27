// Mock bootstrap-vue-next for tests
// A proper plugin must have an install method
const plugin = {
    install: (app) => {
    // Add mock bootstrap components to app
    // Button-related components
        app.component('BButton', {
            props: ['variant', 'size', 'disabled', 'id'],
            // Use proper HTML structure for button to pass tests
            template: '<button class="btn m-1" :id="id" :variant="variant" :size="size" :disabled="disabled"><slot></slot></button>'
        });
    
        app.component('BButtonGroup', {
            props: ['size'],
            template: '<div class="btn-group"><slot></slot></div>'
        });
    
        // Form-related components
        app.component('BForm', {
            template: '<form @submit.prevent="$emit(\'submit\', $event)"><slot></slot></form>'
        });
    
        app.component('BFormInput', {
            props: ['modelValue', 'placeholder', 'id'],
            template: '<input type="text" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" :placeholder="placeholder" class="form-control" />'
        });
    
        app.component('BFormTextarea', {
            props: ['modelValue', 'placeholder', 'rows', 'id'],
            template: '<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" :placeholder="placeholder" :rows="rows" class="form-control"></textarea>'
        });
    
        app.component('BFormGroup', {
            props: ['label', 'description', 'label-for', 'labelFor'],
            template: '<div class="form-group"><label v-if="label" :for="labelFor">{{ label }}</label><div><slot></slot></div><div v-if="description" class="form-text text-muted">{{ description }}</div></div>'
        });
    
        app.component('BFormCheckbox', {
            props: ['modelValue', 'value', 'id'],
            template: '<div class="form-check"><input type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" class="form-check-input" /><label class="form-check-label"><slot></slot></label></div>'
        });
    
        app.component('BFormSelect', {
            props: ['modelValue', 'options', 'id'],
            template: '<select :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)" class="form-select"><slot></slot></select>'
        });
    
        app.component('BFormInvalidFeedback', {
            props: ['state'],
            template: '<div class="invalid-feedback"><slot></slot></div>'
        });
    
        app.component('BFormRow', {
            template: '<div class="form-row"><slot></slot></div>'
        });
    
        app.component('BFormRadioGroup', {
            props: ['modelValue'],
            template: '<div class="radio-group"><slot></slot></div>'
        });
    
        // Dropdown-related components
        app.component('BDropdown', {
            props: ['text', 'variant', 'right', 'split'],
            template: '<div class="dropdown"><button class="btn dropdown-toggle">{{ text }}</button><div class="dropdown-menu"><slot></slot></div></div>'
        });
    
        app.component('BDropdownItem', {
            props: ['href'],
            template: '<a class="dropdown-item" :href="href"><slot></slot></a>'
        });
    
        app.component('BDropdownDivider', {
            template: '<div class="dropdown-divider"></div>'
        });
    
        // Layout components
        app.component('BContainer', {
            props: ['fluid'],
            template: '<div class="container"><slot></slot></div>'
        });
    
        app.component('BRow', {
            template: '<div class="row"><slot></slot></div>'
        });
    
        app.component('BCol', {
            props: ['cols', 'sm', 'md', 'lg', 'xl'],
            methods: {
                getColClasses() {
                    const classes = [];
                    if (this.cols) classes.push(`col-${this.cols}`);
                    if (this.sm) classes.push(`col-sm-${this.sm}`);
                    if (this.md) classes.push(`col-md-${this.md}`);
                    if (this.lg) classes.push(`col-lg-${this.lg}`);
                    if (this.xl) classes.push(`col-xl-${this.xl}`);
                    return classes;
                }
            },
            template: '<div class="col" :class="getColClasses()"><slot></slot></div>'
        });
    
        // Navbar components
        app.component('BNavbar', {
            props: ['variant', 'toggleable', 'type'],
            template: '<nav class="navbar"><slot></slot></nav>'
        });
    
        app.component('BNavbarBrand', {
            props: ['to', 'href'],
            template: '<div class="navbar-brand"><slot></slot></div>'
        });
    
        app.component('BNavbarToggle', {
            props: ['target'],
            template: '<button class="navbar-toggler"><slot></slot></button>'
        });
    
        app.component('BNavbarNav', {
            template: '<ul class="navbar-nav"><slot></slot></ul>'
        });
    
        app.component('BNavItem', {
            props: ['to', 'active'],
            template: '<li class="nav-item"><a class="nav-link"><slot></slot></a></li>'
        });
    
        app.component('BNavText', {
            template: '<span class="navbar-text"><slot></slot></span>'
        });
    
        app.component('BCollapse', {
            props: ['id', 'is-nav'],
            template: '<div class="collapse"><slot></slot></div>'
        });
    
        // Card components
        app.component('BCard', {
            props: ['title', 'sub-title', 'subTitle', 'header', 'footer'],
            template: `
        <div class="card">
          <div v-if="title || $slots.header" class="card-header">
            <div v-if="title">{{ title }}</div>
            <slot name="header"></slot>
          </div>
          <div class="card-body">
            <h5 v-if="$slots.title" class="card-title"><slot name="title"></slot></h5>
            <h6 v-if="subTitle" class="card-subtitle">{{ subTitle }}</h6>
            <slot></slot>
          </div>
          <div v-if="$slots.footer" class="card-footer"><slot name="footer"></slot></div>
        </div>
      `
        });
    
        app.component('BCardText', {
            template: '<div class="card-text"><slot></slot></div>'
        });
    
        // Input group components
        app.component('BInputGroup', {
            props: ['append', 'prepend', 'size'],
            template: '<div class="input-group"><slot></slot></div>'
        });
    
        app.component('BInputGroupPrepend', {
            template: '<div class="input-group-prepend"><slot></slot></div>'
        });
    
        app.component('BInputGroupAppend', {
            template: '<div class="input-group-append"><slot></slot></div>'
        });
    
        app.component('BInputGroupText', {
            template: '<span class="input-group-text"><slot></slot></span>'
        });
    
        // Table components
        app.component('BTableSimple', {
            props: ['hover', 'striped', 'bordered'],
            template: '<table class="table"><slot></slot></table>'
        });
    
        app.component('BThead', {
            template: '<thead><slot></slot></thead>'
        });
    
        app.component('BTbody', {
            template: '<tbody><slot></slot></tbody>'
        });
    
        app.component('BTr', {
            template: '<tr><slot></slot></tr>'
        });
    
        app.component('BTh', {
            template: '<th><slot></slot></th>'
        });
    
        app.component('BTd', {
            template: '<td><slot></slot></td>'
        });
    
        // Other components
        app.component('BListGroup', {
            template: '<ul class="list-group"><slot></slot></ul>'
        });
    
        app.component('BListGroupItem', {
            props: ['variant', 'href', 'to', 'active'],
            template: '<li class="list-group-item"><slot></slot></li>'
        });
    
        app.component('BBadge', {
            props: ['variant', 'pill'],
            template: '<span class="badge bg-primary"><slot></slot></span>'
        });
    
        app.component('BImg', {
            props: ['src', 'fluid', 'thumbnail', 'alt'],
            template: '<img />'
        });
    
        app.component('BOverlay', {
            props: ['show'],
            template: '<div><div v-if="show" class="overlay"></div><slot></slot></div>'
        });
    
        app.component('BTooltip', {
            props: ['target', 'title', 'placement'],
            template: '<div><slot></slot></div>'
        });
    
        app.component('BModal', {
            props: ['id', 'title', 'size', 'modelValue', 'visible'],
            emits: ['update:modelValue', 'ok', 'cancel', 'show', 'hide'],
            template: `
        <div class="modal" v-if="modelValue || visible">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{{ title }}</h5>
                <button type="button" class="close" @click="$emit('update:modelValue', false)">×</button>
              </div>
              <div class="modal-body"><slot></slot></div>
              <div class="modal-footer"><slot name="footer"></slot></div>
            </div>
          </div>
        </div>
      `
        });
    
        // Mock $bvModal and $bvToast
        app.config.globalProperties.$bvModal = {
            msgBoxConfirm: jest.fn().mockResolvedValue(true),
            show: jest.fn(),
            hide: jest.fn()
        };
    
        app.config.globalProperties.$bvToast = {
            toast: jest.fn()
        };
    }
};

export default plugin;