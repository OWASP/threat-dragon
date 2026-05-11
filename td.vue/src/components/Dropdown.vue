<template>
    <div class="td-dropdown" @keydown.escape="closeDropdown">
        <button
            type="button"
            class="td-dropdown-toggle"
            aria-haspopup="true"
            :aria-expanded="isOpen.toString()"
            @click.stop.prevent="toggleDropdown"
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
            @click.stop
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
    background-color: $orange;
    border: 1px solid $orange;
    border-radius: 4px;
    color: $white;
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

.td-dropdown-toggle:hover,
.td-dropdown-toggle:focus {
    background-color: #c8321d;
    border-color: #bd301c;
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

.td-dropdown-menu {
    background-color: $white;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    color: $black;
    margin-top: 2px;
    min-width: 220px;
    padding: 8px 0;
    position: absolute;
    top: 100%;
    z-index: 1000;
}

.td-dropdown-menu-right {
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
    color: $black;
    cursor: pointer;
    display: block;
    font: inherit;
    padding: 4px 24px;
    text-align: left;
    width: 100%;
}

.td-dropdown-item:hover,
.td-dropdown-item:focus {
    background-color: #f8f9fa;
    color: #16181b;
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
