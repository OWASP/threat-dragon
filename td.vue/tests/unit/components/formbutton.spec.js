import { FontAwesomeIcon as _FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { shallowMount } from '@vue/test-utils';
import bootstrapVueNext from '@/plugins/bootstrap-vue-next';

import TdFormButton from '@/components/FormButton.vue';

describe('components/FormButton.vue', () => {
    const onBtnClick = () => {},
        icon = 'icon',
        iconPreface = 'foo',
        text = 'bar',
        isPrimary = true;

    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(TdFormButton, {
            global: {
                plugins: [bootstrapVueNext],
                stubs: {
                    'font-awesome-icon': true,
                    'b-button': true
                }
            },
            props: {
                onBtnClick,
                icon,
                iconPreface,
                text,
                isPrimary
            }
        });
    });

    it('reads the onBtnClick value', () => {
        expect(wrapper.props().onBtnClick).toEqual(onBtnClick);
    });

    it('requires the onBtnClick prop', () => {
        expect(TdFormButton.props.onBtnClick.required).toBe(true);
    });

    it('reads the icon value', () => {
        expect(wrapper.props().icon).toEqual(icon);
    });

    it('does not require the icon prop', () => {
        expect(TdFormButton.props.icon.required).toBe(false);
    });

    it('reads the iconPreface value', () => {
        expect(wrapper.props().iconPreface).toEqual(iconPreface);
    });

    it('does not require the iconPreface value', () => {
        expect(TdFormButton.props.iconPreface.required).toBe(false);
    });

    it('has a default value for iconPreface', () => {
        expect(TdFormButton.props.iconPreface.default).toEqual('fas');
    });
    
    it('sets the font awesome icon value', () => {
        // Check that the icon props are passed to the component
        expect(wrapper.vm.icon).toBe(icon);
        expect(wrapper.vm.iconPreface).toBe(iconPreface);
    });

    it('reads the text value', () => {
        expect(wrapper.props().text).toEqual(text);
    });

    it('requires the text value', () => {
        expect(TdFormButton.props.text.required).toBe(true);
    });

    it('does not require isPrimary', () => {
        expect(TdFormButton.props.isPrimary.required).toBe(false);
    });

    it('sets isPrimary to false by default', () => {
        expect(TdFormButton.props.isPrimary.default).toBe(false);
    });
});
