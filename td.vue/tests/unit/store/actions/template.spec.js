import {
    TEMPLATE_DOWNLOAD,
    TEMPLATE_LOAD
} from '@/store/actions/template';
import template from '@/store/actions/template'; // eslint-disable-line no-duplicate-imports

describe('store/actions/threatmodel.js', () => {
    it('defines a template download action', () => {
        expect(TEMPLATE_DOWNLOAD).toBeDefined();
        expect(template.templateDownload).toBeDefined();
    });

    it('defines a template load action', () => {
        expect(TEMPLATE_LOAD).toBeDefined();
        expect(template.templateLoad).toBeDefined();
    });
});
