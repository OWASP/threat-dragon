import { createLocalVue as compatCreateLocalVue } from '@vue/test-utils';

export const createLocalVue = () => compatCreateLocalVue();

export function mountOptions(localVue, options = {}) {
    return {
        localVue,
        ...options
    };
}
