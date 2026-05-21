<template>
    <div class="td-dropdown" @keydown.escape="closeDropdown">
        <button
            type="button"
            class="td-dropdown-toggle"
            :class="toggleClasses"
            aria-haspopup="true"
            :aria-expanded="isOpen.toString()"
            @click.prevent="toggleDropdown"
        >
            <slot name="button-content">
                {{ text }}
            </slot>
        </button>
        <div
            v-if="isOpen"
            class="td-dropdown-menu"
            :class="{ 'td-dropdown-menu-right': right }"
            role="menu"
        >
            <slot :close="closeDropdown"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TdDropdown',
    props: {
        text: {
            type: String,
            default: ''
        },
        right: {
            type: Boolean,
            default: false
        },
        variant: {
            type: String,
            default: 'primary'
        },
        noCaret: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        toggleClasses() {
            return {
                [`td-dropdown-toggle-${this.variant}`]: true,
                'td-dropdown-toggle-no-caret': this.noCaret
            };
        }
    },
    data() {
        return {
            isOpen: false
        };
    },
    mounted() {
        document.addEventListener('click', this.closeDropdownOnOutsideClick);
    },
    unmounted() {
        document.removeEventListener('click', this.closeDropdownOnOutsideClick);
    },
    methods: {
        toggleDropdown() {
            this.isOpen = !this.isOpen;
        },
        closeDropdown() {
            this.isOpen = false;
        },
        closeDropdownOnOutsideClick(event) {
            if (!this.$el.contains(event.target)) {
                this.closeDropdown();
            }
        }
    }
};
</script>

<style lang="scss">
.td-dropdown {
    display: inline-flex;
    position: relative;
    vertical-align: middle;
}

.td-dropdown-toggle {
    border-radius: 4px;
    cursor: pointer;
    display: block;
    flex: 1 1 auto;
    font-family: Ubuntu, Tahoma, "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 6px 12px;
    position: relative;
    text-align: center;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
        box-shadow 0.15s ease-in-out;
    user-select: none;
    vertical-align: middle;
    white-space: nowrap;
}

.td-dropdown-toggle-primary {
    background-color: $orange;
    border: 1px solid $orange;
    color: $white;
}

.td-dropdown-toggle-primary:hover,
.td-dropdown-toggle-primary:focus {
    background-color: #c8321d;
    border-color: #bd301c;
}

.td-dropdown-toggle-secondary {
    background-color: $gray;
    border: 1px solid $gray;
    color: $white;
}

.td-dropdown-toggle-secondary:hover,
.td-dropdown-toggle-secondary:focus {
    background-color: #9b948c;
    border-color: #938c84;
}

.td-dropdown-toggle-link {
    background-color: transparent;
    border: 1px solid transparent;
    color: $orange;
}

.td-dropdown-toggle-link:hover,
.td-dropdown-toggle-link:focus {
    color: #c8321d;
    text-decoration: none;
}

.td-dropdown-toggle::after {
    border-bottom: 0;
    border-left: 0.3em solid transparent;
    border-right: 0.3em solid transparent;
    border-top: 0.3em solid currentColor;
    content: "";
    display: inline-block;
    margin-left: 0.255em;
    vertical-align: 0.255em;
}

.td-dropdown-toggle-no-caret::after {
    display: none;
}

.btn-group > .td-dropdown:not(:first-child) {
    margin-left: -1px;
}

.btn-group > .td-dropdown:not(:first-child) .td-dropdown-toggle {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
}

.btn-group > .td-dropdown:not(:last-child) .td-dropdown-toggle {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
}

.td-dropdown-menu {
    background-color: $white;
    background-clip: padding-box;
    border: 1px solid rgba(51, 51, 51, 0.15);
    border-radius: 4px;
    color: $black;
    font-family: Ubuntu, Tahoma, "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 1rem;
    font-weight: 400;
    left: 0;
    line-height: 1.428571;
    margin-top: 2px;
    min-width: 10rem;
    padding: 8px 0;
    position: absolute;
    text-align: left;
    top: 100%;
    z-index: 1000;
}

.td-dropdown-menu-right {
    left: auto;
    right: 0;
}

.td-dropdown-search {
    padding: 0 8px 8px;
}

.td-dropdown-input {
    border: 1px solid #ced4da;
    border-radius: 4px;
    color: $black;
    display: block;
    font: inherit;
    line-height: 1.5;
    min-width: 200px;
    padding: 6px 12px;
    width: 100%;
}

.td-dropdown-scroll {
    max-height: 300px;
    overflow-y: auto;
}

.td-dropdown-item {
    background: transparent;
    border: 0;
    clear: both;
    color: #212529;
    cursor: pointer;
    display: block;
    font: inherit;
    padding: 4px 24px;
    text-align: left;
    white-space: nowrap;
    width: 100%;
}

.td-dropdown-item:hover,
.td-dropdown-item:focus {
    background-color: #f8f9fa;
    color: #16181b;
}

.td-dropdown-item-danger {
    color: #dc3545;
}

.td-dropdown-divider {
    border-top: 1px solid #e9ecef;
    height: 0;
    margin: 8px 0;
    overflow: hidden;
}

@media (max-width: 991.98px) {
    .navbar-collapse .td-dropdown {
        align-items: stretch;
    }

    .navbar-collapse .td-dropdown-menu {
        flex: 0 0 auto;
        margin-top: 0;
        position: static;
    }

    .navbar-collapse .td-dropdown-menu-right {
        right: auto;
    }
}
</style>
