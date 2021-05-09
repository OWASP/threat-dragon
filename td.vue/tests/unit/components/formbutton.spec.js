import { BootstrapVue } from 'bootstrap-vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { shallowMount, createLocalVue } from '@vue/test-utils';

import TdFormButton from '@/components/FormButton.vue';

describe('components/FormButton.vue', () => {
    const onBtnClick = () => {},
        icon = 'icon',
        iconPreface = 'foo',
        text = 'bar',
        isPrimary = true;

    let wrapper, localVue;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.component('font-awesome-icon', FontAwesomeIcon);
        wrapper = shallowMount(TdFormButton, {
            localVue,
            propsData: {
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
        const fa = wrapper.findComponent(FontAwesomeIcon);
        expect(fa.attributes(icon)).toEqual(`${iconPreface},${icon}`);
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
