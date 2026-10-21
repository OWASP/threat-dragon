import { mount } from '@vue/test-utils';

import TdResizeHandle from '@/components/ResizeHandle.vue';

describe('components/ResizeHandle.vue', () => {
    const triggerPointer = async (wrapper, type, values = {}) => {
        const event = new Event(type, { bubbles: true });
        const properties = {
            button: 0,
            pointerId: 1,
            clientX: 100,
            clientY: 100,
            ...values
        };

        Object.entries(properties).forEach(([key, value]) => {
            Object.defineProperty(event, key, { value });
        });

        wrapper.find('button').element.dispatchEvent(event);
        await wrapper.vm.$nextTick();
    };

    const mountComponent = (propsData = {}) => mount(TdResizeHandle, {
        propsData: {
            value: 100,
            min: 50,
            max: 200,
            ...propsData
        }
    });

    it('emits a resized vertical value', async () => {
        const wrapper = mountComponent();

        await triggerPointer(wrapper, 'pointerdown', { clientX: 100 });
        await triggerPointer(wrapper, 'pointermove', { clientX: 140 });

        expect(wrapper.emitted('resize')).toEqual([[140]]);
    });

    it('uses its supplied accessible label', () => {
        const wrapper = mountComponent({ label: 'Resize canvas height' });

        expect(wrapper.find('button').attributes('aria-label')).toEqual('Resize canvas height');
    });

    it('emits a resized horizontal value', async () => {
        const wrapper = mountComponent({ orientation: 'horizontal' });

        await triggerPointer(wrapper, 'pointerdown', { clientY: 100 });
        await triggerPointer(wrapper, 'pointermove', { clientY: 140 });

        expect(wrapper.emitted('resize')).toEqual([[140]]);
    });

    it('resizes with a touch pointer while the finger is still down', async () => {
        const wrapper = mountComponent({ orientation: 'horizontal' });

        await triggerPointer(wrapper, 'pointerdown', { pointerType: 'touch' });
        await triggerPointer(wrapper, 'pointermove', { pointerType: 'touch', clientY: 140 });

        expect(wrapper.emitted('resize')).toEqual([[140]]);
    });

    it('clamps values to the maximum', async () => {
        const wrapper = mountComponent();

        await triggerPointer(wrapper, 'pointerdown');
        await triggerPointer(wrapper, 'pointermove', { clientX: 500 });

        expect(wrapper.emitted('resize')).toEqual([[200]]);
    });

    it('clamps values to the minimum', async () => {
        const wrapper = mountComponent();

        await triggerPointer(wrapper, 'pointerdown');
        await triggerPointer(wrapper, 'pointermove', { clientX: 0 });

        expect(wrapper.emitted('resize')).toEqual([[50]]);
    });

    it('captures the pointer when a drag starts', async () => {
        const wrapper = mountComponent();
        const handle = wrapper.find('button').element;
        handle.setPointerCapture = jest.fn();

        await triggerPointer(wrapper, 'pointerdown');

        expect(handle.setPointerCapture).toHaveBeenCalledWith(1);
    });

    it('releases the pointer when a drag ends', async () => {
        const wrapper = mountComponent();
        const handle = wrapper.find('button').element;
        handle.releasePointerCapture = jest.fn();

        await triggerPointer(wrapper, 'pointerdown');
        await triggerPointer(wrapper, 'pointerup');

        expect(handle.releasePointerCapture).toHaveBeenCalledWith(1);
    });

    it('supports keyboard resizing', async () => {
        const wrapper = mountComponent();
        await wrapper.find('button').trigger('keydown', { key: 'ArrowRight' });

        expect(wrapper.emitted('resize')).toEqual([[110]]);
    });

    it('ignores unrelated keyboard input', async () => {
        const wrapper = mountComponent();
        await wrapper.find('button').trigger('keydown', { key: 'Enter' });

        expect(wrapper.emitted('resize')).toBeUndefined();
    });

    it('ignores secondary pointer buttons', async () => {
        const wrapper = mountComponent();

        await triggerPointer(wrapper, 'pointerdown', { button: 2 });
        await triggerPointer(wrapper, 'pointermove', { clientX: 140 });

        expect(wrapper.emitted('resize')).toBeUndefined();
    });

    it('ends a cancelled drag', async () => {
        const wrapper = mountComponent();

        await triggerPointer(wrapper, 'pointerdown');
        await triggerPointer(wrapper, 'pointercancel');

        expect(wrapper.emitted('end')).toHaveLength(1);
    });
});