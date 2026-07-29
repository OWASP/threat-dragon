import {
    templateDownload,
    templateLoad
} from '@/store/actions/template';
import template from '@/store/actions/template'; // eslint-disable-line no-duplicate-imports

describe('store/actions/threatmodel.js', () => {
    it('defines a template download action', () => {
        expect(templateDownload).toBeDefined();
        expect(template.templateDownload).toBeDefined();
    });

    it('defines a template load action', () => {
        expect(templateLoad).toBeDefined();
        expect(template.templateLoad).toBeDefined();
    });
});
