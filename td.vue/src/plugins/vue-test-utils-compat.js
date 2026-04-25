import * as actual from '@vue/test-utils/dist/vue-test-utils.cjs.js';
import { Components as BootstrapVueNextComponents } from 'bootstrap-vue-next';
import { defineComponent, h } from 'vue';

if (typeof Array.prototype.exists !== 'function') {
    Object.defineProperty(Array.prototype, 'exists', {
        value() {
            return this.length > 0;
        }
    });
}

const renderDefaultSlot = (slots) => {
    if (!slots?.default) {
        return undefined;
    }

    return typeof slots.default === 'function'
        ? slots.default()
        : slots.default;
};

const defaultI18n = {
    locale: 'en',
    availableLocales: ['en', 'de'],
    t: (key) => key,
    tc: (key) => key
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

const mergeGlobalOption = (base, extra) => {
    if (!extra) {
        return base;
    }

    return {
        ...base,
        ...extra
    };
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

            if (!this._plugins.includes(plugin)) {
                this._plugins.push(plugin);
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
                    const nestedInstall = typeof nestedPlugin === 'function' ? nestedPlugin : nestedPlugin?.install;
                    if (typeof nestedInstall === 'function') {
                        nestedInstall(collector);
                    }
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

        if (key === 'value' && props.modelValue !== undefined) {
            return stringifyValue(props.modelValue);
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

    const registerPlugin = (plugin) => {
        if (!plugin) {
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
            {
                ...BootstrapVueNextComponents,
                ...(localVue?._components || {})
            },
            global?.components || {}
        ),
        directives: mergeGlobalOption(
            localVue?._directives || {},
            global?.directives || {}
        ),
        stubs: mergeGlobalOption(normalizeStubs(global?.stubs), normalizeStubs(stubs))
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
