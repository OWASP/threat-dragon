import * as actual from '@vue/test-utils/dist/vue-test-utils.cjs.js';
import * as bootstrapVueLib from 'bootstrap-vue';
import { defineComponent, h } from 'vue';

if (typeof Array.prototype.exists !== 'function') {
    Object.defineProperty(Array.prototype, 'exists', {
        value() {
            return this.length > 0;
        }
    });
}

const bootstrapComponentAliases = {
    BButton: ['b-btn'],
    BButtonGroup: ['b-btn-group']
};

const bootstrapDirectiveAliases = {
    VBModal: ['b-modal'],
    VBTooltip: ['b-tooltip']
};

const renderDefaultSlot = (slots) => {
    if (!slots?.default) {
        return undefined;
    }

    return typeof slots.default === 'function'
        ? slots.default()
        : slots.default;
};

const renderNamedSlot = (slots, name) => {
    if (!slots?.[name]) {
        return undefined;
    }

    return typeof slots[name] === 'function'
        ? slots[name]()
        : slots[name];
};

const defaultI18n = {
    locale: 'en',
    availableLocales: ['en', 'de'],
    t: (key) => key,
    tc: (key) => key
};

const getJest = () => {
    try {
        return Function('return this')().jest;
    } catch (_err) {
        return undefined;
    }
};

const createMockFn = (impl = () => undefined) => {
    const jestApi = getJest();
    if (jestApi?.fn) {
        return jestApi.fn(impl);
    }

    return impl;
};

const createClickableCompat = (name, tag = 'button') => defineComponent({
    name,
    inheritAttrs: false,
    emits: ['click'],
    props: {
        value: {
            type: [String, Number, Boolean, Object],
            default: undefined
        },
        id: {
            type: String,
            default: undefined
        },
        to: {
            type: [String, Object],
            default: undefined
        },
        href: {
            type: String,
            default: undefined
        }
    },
    render() {
        return h(tag, {
            ...this.$attrs,
            id: this.id,
            href: this.href,
            to: stringifyValue(this.to),
            value: stringifyValue(this.value),
            type: tag === 'button' ? 'button' : undefined,
            onClick: (event) => {
                if (typeof this.$attrs.onClick === 'function') {
                    this.$attrs.onClick(event);
                }

                this.$emit('click', event);
            }
        }, renderDefaultSlot(this.$slots));
    }
});

const createBootstrapCompat = (name, tag = 'div') => defineComponent({
    name,
    inheritAttrs: false,
    props: {
        id: {
            type: String,
            default: undefined
        },
        title: {
            type: String,
            default: undefined
        },
        header: {
            type: String,
            default: undefined
        },
        value: {
            type: [String, Number, Boolean, Object, Array],
            default: undefined
        },
        modelValue: {
            type: [String, Number, Boolean, Object, Array],
            default: undefined
        },
        options: {
            type: Array,
            default: () => []
        },
        items: {
            type: Array,
            default: () => []
        },
        fields: {
            type: [Array, Object],
            default: undefined
        }
    },
    emits: ['click', 'input', 'change', 'update:modelValue'],
    methods: {
        show() {},
        hide() {}
    },
    render() {
        const model = this.modelValue ?? this.value;
        const commonData = {
            ...this.$attrs,
            id: this.id,
            title: this.title,
            header: this.header,
            value: stringifyValue(model),
            onClick: (event) => {
                if (typeof this.$attrs.onClick === 'function') {
                    this.$attrs.onClick(event);
                }

                this.$emit('click', event);
            }
        };

        if (tag === 'input') {
            return h('input', {
                ...commonData,
                type: this.$attrs.type || 'text'
            });
        }

        if (tag === 'textarea') {
            return h('textarea', commonData, stringifyValue(model) || '');
        }

        if (tag === 'select') {
            const optionNodes = this.options.map((option) => {
                const normalized = typeof option === 'object'
                    ? option
                    : { value: option, text: option };
                return h('option', {
                    value: stringifyValue(normalized.value)
                }, normalized.text ?? stringifyValue(normalized.value));
            });

            return h('select', commonData, [
                ...optionNodes,
                ...(renderDefaultSlot(this.$slots) || [])
            ]);
        }

        return h(tag, commonData, [
            ...(renderNamedSlot(this.$slots, 'header') || []),
            ...(renderDefaultSlot(this.$slots) || []),
            ...(renderNamedSlot(this.$slots, 'modal-footer') || [])
        ]);
    }
});

const BootstrapButtonCompat = createClickableCompat('BButton');
const BootstrapDropdownItemCompat = createClickableCompat('BDropdownItem');
const BootstrapListGroupItemCompat = createClickableCompat('BListGroupItem', 'a');
const BootstrapNavItemCompat = createClickableCompat('BNavItem', 'a');
const BootstrapCardTextCompat = createBootstrapCompat('BCardText');
const BootstrapJumbotronCompat = createBootstrapCompat('BJumbotron');
const BootstrapModalCompat = createBootstrapCompat('BModal');
const BootstrapFormInputCompat = createBootstrapCompat('BFormInput', 'input');
const BootstrapFormTextareaCompat = createBootstrapCompat('BFormTextarea', 'textarea');
const BootstrapTableCompat = createBootstrapCompat('BTable', 'table');
const BootstrapCardCompat = createBootstrapCompat('BCard');

const bootstrapComponentStubs = {
    BCard: BootstrapCardCompat,
    BCardText: BootstrapCardTextCompat,
    BButton: BootstrapButtonCompat,
    BDropdownItem: BootstrapDropdownItemCompat,
    BFormInput: BootstrapFormInputCompat,
    BFormTextarea: BootstrapFormTextareaCompat,
    BJumbotron: BootstrapJumbotronCompat,
    BListGroupItem: BootstrapListGroupItemCompat,
    BModal: BootstrapModalCompat,
    BNavItem: BootstrapNavItemCompat,
    BTable: BootstrapTableCompat
};

const FontAwesomeIconCompat = defineComponent({
    name: 'FontAwesomeIcon',
    inheritAttrs: false,
    props: {
        icon: {
            type: [String, Array, Object],
            default: ''
        },
        size: {
            type: String,
            default: undefined
        },
        color: {
            type: String,
            default: undefined
        },
        title: {
            type: String,
            default: undefined
        }
    },
    render() {
        const icon = Array.isArray(this.icon) ? this.icon.join(',') : this.icon;
        return h('font-awesome-icon', {
            ...this.$attrs,
            icon,
            size: this.size,
            color: this.color,
            title: this.title
        }, renderDefaultSlot(this.$slots));
    }
});

const kebabCase = (value) => value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/^([A-Z])/, (_, char) => char.toLowerCase())
    .toLowerCase();

const stringifyValue = (value) => {
    if (Array.isArray(value)) {
        return value.join(',');
    }

    if (value === null || value === undefined) {
        return value;
    }

    if (typeof value === 'object') {
        return JSON.stringify(value);
    }

    return String(value);
};

const camelize = (value) => value.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

const isBootstrapVuePlugin = (plugin) => (
    plugin === bootstrapVueLib.BootstrapVue ||
    plugin === bootstrapVueLib.default ||
    plugin?.NAME === 'BootstrapVue' ||
    plugin?.install === bootstrapVueLib.install
);

const selectorNames = (selector) => {
    if (!selector || typeof selector === 'string') {
        return [];
    }

    return [
        selector.name,
        selector.__name,
        selector.options?.name,
        selector.extendOptions?.name
    ].filter(Boolean);
};

const registerAliases = (registry, name, exported, extraAliases = []) => {
    const aliases = new Set([
        name,
        kebabCase(name),
        exported?.name,
        exported?.__name,
        exported?.options?.name,
        ...extraAliases
    ].filter(Boolean));

    aliases.forEach((alias) => {
        registry[alias] = exported;
    });
};

const mergeGlobalOption = (base, extra) => {
    if (!extra) {
        return base;
    }

    return {
        ...base,
        ...extra
    };
};

const expandStubAliases = (stubs) => {
    const expanded = { ...(stubs || {}) };

    Object.entries(bootstrapComponentStubs).forEach(([name, stub]) => {
        const aliases = [
            name,
            kebabCase(name),
            ...(bootstrapComponentAliases[name] || [])
        ];

        aliases.forEach((alias) => {
            expanded[alias] = expanded[alias] || stub;
        });
    });

    return expanded;
};

const registerBootstrapVue = (localVue) => {
    Object.entries(bootstrapVueLib).forEach(([name, exported]) => {
        if (/^B[A-Z]/.test(name)) {
            const component = bootstrapComponentStubs[name] || exported;
            registerAliases(localVue._components, name, component, bootstrapComponentAliases[name]);
        }

        if (/^VB[A-Z]/.test(name)) {
            registerAliases(localVue._directives, name, exported, bootstrapDirectiveAliases[name]);
        }
    });
};

export function createLocalVue(options = {}) {
    const localVue = {
        _plugins: [],
        _components: {},
        _directives: {},
        _mixins: [],
        _config: options,
        use(plugin) {
            if (!plugin) {
                return this;
            }

            if (Object.values(bootstrapVueLib).includes(plugin)) {
                registerBootstrapVue(this);
                return this;
            }

            if (plugin.Store && plugin.createStore) {
                return this;
            }

            if (plugin.createI18n && plugin.useI18n) {
                return this;
            }

            const install = typeof plugin === 'function' ? plugin : plugin.install;

            if (typeof install !== 'function') {
                this._plugins.push(plugin);
                return this;
            }

            const collector = {
                component: (name, comp) => {
                    this._components[name] = comp;
                    return collector;
                },
                directive: (name, directive) => {
                    this._directives[name] = directive;
                    return collector;
                },
                mixin: (mixin) => {
                    this._mixins.push(mixin);
                    return collector;
                },
                use: (nestedPlugin) => {
                    this.use(nestedPlugin);
                    return collector;
                },
                config: { globalProperties: {} },
                provide: () => collector
            };

            install(collector);
            return this;
        },
        component(name, comp) {
            this._components[name] = comp;
            return this;
        },
        directive(name, directive) {
            this._directives[name] = directive;
            return this;
        },
        mixin(mixin) {
            this._mixins.push(mixin);
            return this;
        }
    };

    return localVue;
}

const originalAttributes = actual.BaseWrapper.prototype.attributes;
const originalFindComponent = actual.BaseWrapper.prototype.findComponent;
const originalFindAllComponents = actual.BaseWrapper.prototype.findAllComponents;
const originalDestroy = actual.BaseWrapper.prototype.destroy;
const originalSetData = actual.VueWrapper.prototype.setData;

actual.BaseWrapper.prototype.attributes = function (key) {
    const result = originalAttributes.call(this, key);

    if ((result === undefined || result === null) && typeof key === 'string' && typeof this.props === 'function') {
        const props = this.props();
        const propValue = props[key] ?? props[camelize(key)];
        if (propValue !== undefined) {
            return stringifyValue(propValue);
        }
    }

    return result;
};

actual.BaseWrapper.prototype.destroy = function () {
    if (typeof originalDestroy === 'function') {
        return originalDestroy.call(this);
    }

    if (typeof this.unmount === 'function') {
        return this.unmount();
    }

    return undefined;
};

const findByRef = (wrapper, selector) => {
    const ref = selector?.ref;
    if (!ref || !wrapper?.vm?.$refs) {
        return null;
    }

    const target = Array.isArray(wrapper.vm.$refs[ref])
        ? wrapper.vm.$refs[ref][0]
        : wrapper.vm.$refs[ref];

    if (!target) {
        return wrapper.find('[data-test-vtu-missing-ref]');
    }

    if (target.$el) {
        return new actual.DOMWrapper(target.$el);
    }

    if (target.nodeType) {
        return new actual.DOMWrapper(target);
    }

    return wrapper.find('[data-test-vtu-missing-ref]');
};

actual.BaseWrapper.prototype.findComponent = function (selector) {
    if (typeof selector === 'string' && /^[#.[]/.test(selector)) {
        return this.find(selector);
    }

    if (selector?.ref) {
        return findByRef(this, selector);
    }

    let found = originalFindComponent.call(this, selector);
    if (found.exists()) {
        return found;
    }

    for (const name of selectorNames(selector)) {
        found = originalFindComponent.call(this, { name });
        if (found.exists()) {
            return found;
        }
    }

    return found;
};

actual.BaseWrapper.prototype.findAllComponents = function (selector) {
    if (typeof selector === 'string' && /^[#.[]/.test(selector)) {
        return this.findAll(selector);
    }

    if (selector?.ref) {
        const found = findByRef(this, selector);
        return found.exists() ? [found] : [];
    }

    let found = originalFindAllComponents.call(this, selector);
    if (found.length > 0) {
        return found;
    }

    for (const name of selectorNames(selector)) {
        found = originalFindAllComponents.call(this, { name });
        if (found.length > 0) {
            return found;
        }
    }

    return found;
};

actual.VueWrapper.prototype.setData = async function (data) {
    const props = typeof this.props === 'function' ? this.props() : {};
    const dataEntries = Object.entries(data || {});
    const propUpdates = Object.fromEntries(dataEntries.filter(([key]) => Object.prototype.hasOwnProperty.call(props, key)));
    const stateUpdates = Object.fromEntries(dataEntries.filter(([key]) => !Object.prototype.hasOwnProperty.call(props, key)));

    if (Object.keys(stateUpdates).length > 0) {
        try {
            await originalSetData.call(this, stateUpdates);
        } catch (_err) {
            Object.entries(stateUpdates).forEach(([key, value]) => {
                this.vm[key] = value;
            });
            await this.vm.$nextTick();
        }
    }

    if (Object.keys(propUpdates).length > 0) {
        await this.setProps(propUpdates);
    }
};

const normalizeStubs = (stubs) => {
    if (!stubs) {
        return {};
    }

    if (Array.isArray(stubs)) {
        return stubs.reduce((acc, stub) => {
            acc[stub] = true;
            return acc;
        }, {});
    }

    return stubs;
};

const normalizeMountOptions = (options = {}) => {
    const {
        localVue,
        store,
        i18n,
        mocks,
        stubs,
        scopedSlots,
        propsData,
        props,
        global,
        ...rest
    } = options;

    const plugins = [];
    const bootstrapCompat = {
        _components: {},
        _directives: {}
    };

    const registerPlugin = (plugin) => {
        if (!plugin) {
            return;
        }

        if (isBootstrapVuePlugin(plugin)) {
            registerBootstrapVue(bootstrapCompat);
            return;
        }

        plugins.push(plugin);
    };

    (global?.plugins || []).forEach(registerPlugin);

    if (store) {
        if (store.state && !store.state.locale) {
            store.state.locale = { locale: 'en' };
        }

        if (store.state && !Object.prototype.hasOwnProperty.call(store.state, 'packageBuildVersion')) {
            store.state.packageBuildVersion = '';
        }

        if (store.state && !Object.prototype.hasOwnProperty.call(store.state, 'packageBuildState')) {
            store.state.packageBuildState = '';
        }

        plugins.unshift(store);
    }

    if (i18n) {
        registerPlugin(i18n);
    }

    if (localVue?._plugins?.length) {
        localVue._plugins.forEach(registerPlugin);
    }

    const mergedI18n = i18n?.global || i18n || defaultI18n;

    const mergedGlobal = {
        ...global,
        plugins,
        mocks: {
            ...(localVue?._config?.mocks || {}),
            ...(global?.mocks || {}),
            ...(mocks || {})
        },
        components: mergeGlobalOption(
            mergeGlobalOption(bootstrapCompat._components || {}, localVue?._components || {}),
            global?.components || {}
        ),
        directives: mergeGlobalOption(
            mergeGlobalOption(bootstrapCompat._directives || {}, localVue?._directives || {}),
            global?.directives || {}
        ),
        stubs: expandStubAliases(mergeGlobalOption(
            mergeGlobalOption(bootstrapComponentStubs, normalizeStubs(global?.stubs)),
            normalizeStubs(stubs)
        ))
    };

    if (mergedGlobal.mocks.$emit) {
        delete mergedGlobal.mocks.$emit;
    }

    if (!mergedGlobal.mocks.$i18n) {
        mergedGlobal.mocks.$i18n = mergedI18n;
    }

    if (!mergedGlobal.mocks.$t && typeof mergedI18n.t === 'function') {
        mergedGlobal.mocks.$t = mergedI18n.t.bind(mergedI18n);
    }

    if (!mergedGlobal.mocks.$tc && typeof mergedI18n.tc === 'function') {
        mergedGlobal.mocks.$tc = mergedI18n.tc.bind(mergedI18n);
    }

    if (!mergedGlobal.mocks.$bvModal) {
        mergedGlobal.mocks.$bvModal = {
            show: () => {},
            hide: () => {},
            msgBoxConfirm: createMockFn(() => Promise.resolve(false)),
            msgBoxOk: createMockFn(() => Promise.resolve(true))
        };
    }

    mergedGlobal.components['font-awesome-icon'] = FontAwesomeIconCompat;
    mergedGlobal.components.FontAwesomeIcon = FontAwesomeIconCompat;
    mergedGlobal.stubs['font-awesome-icon'] = FontAwesomeIconCompat;
    mergedGlobal.stubs.FontAwesomeIcon = FontAwesomeIconCompat;
    mergedGlobal.renderStubDefaultSlot = true;

    if (localVue?._mixins?.length) {
        mergedGlobal.mixins = [...(global?.mixins || []), ...localVue._mixins];
    }

    if (localVue?._config?.errorHandler) {
        mergedGlobal.config = {
            ...(global?.config || {}),
            errorHandler: localVue._config.errorHandler
        };
    }

    return {
        ...rest,
        slots: {
            ...(global?.slots || {}),
            ...(rest.slots || {}),
            ...(scopedSlots || {})
        },
        props: props || propsData,
        global: mergedGlobal
    };
};

const applyVmMocks = (wrapper, options) => {
    const mocks = {
        ...(options?.global?.mocks || {}),
        ...(options?.mocks || {})
    };

    if (!wrapper?.vm) {
        return wrapper;
    }

    Object.entries(mocks).forEach(([key, value]) => {
        try {
            Object.defineProperty(wrapper.vm, key, {
                configurable: true,
                value,
                writable: true
            });

            if (key === '$emit' && wrapper.vm.$) {
                wrapper.vm.$.emit = (...args) => value(...args);
            }
        } catch (_err) {
            // Ignore non-writable instance properties.
        }
    });

    return wrapper;
};

export const mount = (component, options) => {
    const normalized = normalizeMountOptions(options);
    return applyVmMocks(actual.mount(component, normalized), options);
};

export const shallowMount = (component, options) => {
    const normalized = normalizeMountOptions(options);
    return applyVmMocks(actual.shallowMount(component, normalized), options);
};

export const {
    BaseWrapper,
    DOMWrapper,
    RouterLinkStub,
    VueWrapper,
    config,
    createWrapperError,
    disableAutoUnmount,
    enableAutoUnmount,
    flushPromises,
    renderToString
} = actual;
