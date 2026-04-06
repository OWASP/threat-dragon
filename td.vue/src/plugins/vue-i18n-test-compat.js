import * as actual from 'vue-i18n/dist/vue-i18n.cjs';

const installLegacyCompat = (instance) => {
    if (typeof instance.t !== 'function' && typeof instance.global?.t === 'function') {
        instance.t = instance.global.t.bind(instance.global);
    }

    if (typeof instance.tc !== 'function' && typeof instance.global?.tc === 'function') {
        instance.tc = instance.global.tc.bind(instance.global);
    }

    if (!Object.getOwnPropertyDescriptor(instance, 'locale') && instance.global) {
        Object.defineProperty(instance, 'locale', {
            get() {
                return instance.global.locale;
            },
            set(value) {
                instance.global.locale = value;
            }
        });
    }

    if (!Object.getOwnPropertyDescriptor(instance, 'availableLocales') && instance.global) {
        Object.defineProperty(instance, 'availableLocales', {
            get() {
                return instance.global.availableLocales || [];
            }
        });
    }

    return instance;
};

function VueI18n(options = {}) {
    return installLegacyCompat(actual.createI18n({
        legacy: true,
        ...options
    }));
}

VueI18n.install = () => {};
VueI18n.createI18n = actual.createI18n;
VueI18n.useI18n = actual.useI18n;

export const castToVueI18n = (instance) => installLegacyCompat(actual.castToVueI18n(instance));
export const createI18n = (...args) => installLegacyCompat(actual.createI18n(...args));

export const {
    DatetimeFormat,
    I18nD,
    I18nInjectionKey,
    I18nN,
    I18nT,
    NumberFormat,
    Translation,
    VERSION,
    useI18n,
    vTDirective
} = actual;

export default VueI18n;
