/**
 * Bootstrap-Vue component stubs for testing
 * 
 * These stubs implement the minimum functionality needed for testing components
 * that use Bootstrap-Vue-Next components without loading the full library.
 */

import { vi } from 'vitest';

export const bootstrapVueStubs = {
    // Layout components
    BContainer: {
        template: '<div class="container"><slot></slot></div>',
    },
    BRow: {
        template: '<div class="row"><slot></slot></div>',
    },
    BCol: {
        template: '<div class="col"><slot></slot></div>',
        props: {
            md: [String, Number],
            lg: [String, Number],
            xl: [String, Number],
            offset: [String, Number],
            offsetMd: [String, Number],
            offsetLg: [String, Number],
        },
    },

    // Form components
    BForm: {
        template: '<form @submit.prevent="$emit(\'submit\', $event)"><slot></slot></form>',
        emits: ['submit'],
    },
    BFormGroup: {
        template: `
            <div class="form-group">
                <label v-if="label || labelFor" :for="labelFor">{{ label }}</label>
                <slot></slot>
                <div v-if="description" class="form-text text-muted">{{ description }}</div>
            </div>
        `,
        props: {
            label: String,
            labelFor: String,
            description: String,
        },
    },
    BFormInput: {
        template: `
            <input 
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
                class="form-control"
                :placeholder="placeholder"
                :disabled="disabled"
            />
        `,
        props: {
            modelValue: [String, Number],
            placeholder: String,
            disabled: Boolean,
        },
        emits: ['update:modelValue'],
    },
    BFormTextarea: {
        template: `
            <textarea 
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
                class="form-control"
                :placeholder="placeholder"
                :rows="rows"
                :disabled="disabled"
            ></textarea>
        `,
        props: {
            modelValue: String,
            placeholder: String,
            rows: {
                type: [String, Number],
                default: 3,
            },
            disabled: Boolean,
        },
        emits: ['update:modelValue'],
    },
    BFormSelect: {
        template: `
            <select 
                :value="modelValue"
                @change="$emit('update:modelValue', $event.target.value)"
                class="form-select"
                :disabled="disabled"
            >
                <option 
                    v-for="(option, idx) in options" 
                    :key="idx"
                    :value="option.value"
                >
                    {{ option.text }}
                </option>
                <slot></slot>
            </select>
        `,
        props: {
            modelValue: [String, Number, Boolean, Object],
            options: {
                type: Array,
                default: () => [],
            },
            disabled: Boolean,
        },
        emits: ['update:modelValue'],
    },
    BFormCheckbox: {
        template: `
            <div class="form-check">
                <input 
                    type="checkbox" 
                    class="form-check-input"
                    :id="id"
                    :checked="modelValue"
                    @change="$emit('update:modelValue', $event.target.checked)"
                    :disabled="disabled"
                />
                <label v-if="label" class="form-check-label" :for="id">{{ label }}</label>
                <slot></slot>
            </div>
        `,
        props: {
            id: String,
            modelValue: Boolean,
            label: String,
            disabled: Boolean,
        },
        emits: ['update:modelValue'],
    },

    // Button components
    BButton: {
        template: `
            <button 
                :class="['btn', variant ? 'btn-' + variant : 'btn-primary']"
                @click="$emit('click', $event)"
                :disabled="disabled"
            >
                <slot></slot>
            </button>
        `,
        props: {
            variant: String,
            disabled: Boolean,
        },
        emits: ['click'],
    },
    BButtonGroup: {
        template: '<div class="btn-group"><slot></slot></div>',
    },

    // Card components
    BCard: {
        template: `
            <div class="card">
                <div v-if="$slots.header" class="card-header"><slot name="header"></slot></div>
                <div v-if="img" class="card-img-top"><img :src="img" :alt="imgAlt" /></div>
                <div class="card-body">
                    <h5 v-if="title" class="card-title">{{ title }}</h5>
                    <h6 v-if="subtitle" class="card-subtitle mb-2 text-muted">{{ subtitle }}</h6>
                    <slot></slot>
                </div>
                <div v-if="$slots.footer" class="card-footer"><slot name="footer"></slot></div>
            </div>
        `,
        props: {
            title: String,
            subtitle: String,
            img: String,
            imgAlt: String,
        },
    },

    // Navbar components
    BNavbar: {
        template: `
            <nav class="navbar">
                <div class="container-fluid">
                    <slot></slot>
                </div>
            </nav>
        `,
    },
    BNavbarBrand: {
        template: '<a class="navbar-brand" href="#"><slot></slot></a>',
    },
    BNavbarNav: {
        template: '<ul class="navbar-nav"><slot></slot></ul>',
    },
    BNavItem: {
        template: '<li class="nav-item"><slot></slot></li>',
    },
    BNavbarToggle: {
        template: '<button class="navbar-toggler" @click="$emit(\'click\')"><slot></slot></button>',
        emits: ['click'],
    },
    BCollapse: {
        template: '<div v-if="modelValue" class="collapse"><slot></slot></div>',
        props: {
            modelValue: Boolean,
        },
        emits: ['update:modelValue'],
    },

    // Alert components
    BAlert: {
        template: `
            <div :class="['alert', variant ? 'alert-' + variant : 'alert-info']" role="alert">
                <slot></slot>
            </div>
        `,
        props: {
            variant: String,
            show: Boolean,
        },
    },

    // Table components
    BTable: {
        template: `
            <table class="table">
                <thead>
                    <tr>
                        <th v-for="(field, idx) in fields" :key="idx">{{ field.label || field }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, rowIdx) in items" :key="rowIdx">
                        <td v-for="(field, colIdx) in fields" :key="colIdx">
                            {{ item[typeof field === 'string' ? field : field.key] }}
                        </td>
                    </tr>
                </tbody>
            </table>
        `,
        props: {
            items: {
                type: Array,
                default: () => [],
            },
            fields: {
                type: Array,
                default: () => [],
            },
        },
    },

    // Image components
    BImg: {
        template: '<img :src="src" :alt="alt" :width="width" :height="height" :fluid="fluid" />',
        props: {
            src: String,
            alt: String,
            width: [String, Number],
            height: [String, Number],
            fluid: Boolean,
        },
    },

    // Modal components
    BModal: {
        template: `
            <div v-if="modelValue" class="modal">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">{{ title }}</h5>
                            <button 
                                type="button" 
                                class="btn-close" 
                                @click="$emit('update:modelValue', false)"
                            ></button>
                        </div>
                        <div class="modal-body">
                            <slot></slot>
                        </div>
                        <div class="modal-footer">
                            <slot name="footer">
                                <button 
                                    type="button" 
                                    class="btn btn-secondary" 
                                    @click="$emit('update:modelValue', false)"
                                >
                                    Close
                                </button>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        `,
        props: {
            modelValue: Boolean,
            title: String,
        },
        emits: ['update:modelValue', 'ok', 'cancel'],
        methods: {
            show: vi.fn(),
            hide: vi.fn(),
        },
    },

    // Icon components
    BIcon: {
        template: '<i :class="[\'bi\', \'bi-\' + icon]"></i>',
        props: {
            icon: String,
        },
    },

    // Dropdown components
    BDropdown: {
        template: `
            <div class="dropdown">
                <button class="btn dropdown-toggle" @click="$emit('toggle')">
                    <slot name="button-content">{{ text }}</slot>
                </button>
                <div class="dropdown-menu">
                    <slot></slot>
                </div>
            </div>
        `,
        props: {
            text: String,
            variant: String,
        },
        emits: ['toggle'],
    },
    BDropdownItem: {
        template: `
            <a class="dropdown-item" href="#" @click="$emit('click', $event)">
                <slot></slot>
            </a>
        `,
        emits: ['click'],
    },

    // Progress components
    BProgress: {
        template: `
            <div class="progress">
                <slot></slot>
            </div>
        `,
    },
    BProgressBar: {
        template: `
            <div 
                class="progress-bar" 
                :style="{ width: value + '%' }"
                :class="{ 'progress-bar-striped': striped }"
            >
                <slot>{{ value }}%</slot>
            </div>
        `,
        props: {
            value: Number,
            variant: String,
            striped: Boolean,
        },
    },

    // Spinner components
    BSpinner: {
        template: `
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        `,
        props: {
            variant: String,
            small: Boolean,
        },
    },

    // Tabs components
    BTabs: {
        template: `
            <div class="tabs">
                <ul class="nav nav-tabs">
                    <li v-for="(tab, idx) in tabs" :key="idx" class="nav-item">
                        <a 
                            class="nav-link" 
                            :class="{ active: idx === modelValue }"
                            href="#"
                            @click.prevent="$emit('update:modelValue', idx)"
                        >
                            {{ tab.title }}
                        </a>
                    </li>
                </ul>
                <div class="tab-content">
                    <slot></slot>
                </div>
            </div>
        `,
        props: {
            modelValue: Number,
            tabs: {
                type: Array,
                default: () => [],
            },
        },
        emits: ['update:modelValue'],
    },
    BTab: {
        template: `
            <div class="tab-pane" :class="{ active: active }">
                <slot></slot>
            </div>
        `,
        props: {
            title: String,
            active: Boolean,
        },
    },

    // Popover components
    BPopover: {
        template: '<div><slot></slot></div>',
        props: {
            title: String,
            content: String,
            placement: String,
        },
    },

    // Tooltip components
    BTooltip: {
        template: '<div><slot></slot></div>',
        props: {
            title: String,
            placement: String,
        },
    },
};

export default bootstrapVueStubs;