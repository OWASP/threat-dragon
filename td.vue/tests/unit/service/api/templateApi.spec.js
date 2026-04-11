import api from '@/service/api/api.js';
import templateApi from '@/service/api/templateApi.js';

describe('service/templateApi.js', () => {
    beforeEach(() => {
        jest.spyOn(api, 'getAsync').mockImplementation(() => {});
        jest.spyOn(api, 'putAsync').mockImplementation(() => {});
        jest.spyOn(api, 'postAsync').mockImplementation(() => {});
        jest.spyOn(api, 'deleteAsync').mockImplementation(() => {});
    });

    describe('import a template to gallery', () => {
        const template = {
            templateMetadata: {
                id: 'foo',
                name: 'Foo Template',
                description: 'A foo template',
                tags: ['foo'],
                modelRef: 'bar',
            },
            model: { title: 'Foo Model' },
        };
        beforeEach(async () => {
            await templateApi.importTemplateAsync(template);
        });

        it('calls the import template endpoint', () => {
            expect(api.postAsync).toHaveBeenCalledWith(
                '/api/templates/import',
                template
            );
        });
    });

    describe('fetch all templates', () => {
        beforeEach(async () => {
            await templateApi.fetchAllAsync();
        });

        it('calls the fetch templates endpoint', () => {
            expect(api.getAsync).toHaveBeenCalledWith('/api/templates');
        });
    });

    describe('update template with metadata', () => {
        const templateMetadata = {
            id: 'foo',
            name: 'Foo Template',
            description: 'A foo template',
            tags: ['foo'],
        };

        beforeEach(async () => {
            await templateApi.updateTemplateAsync(templateMetadata);
        });

        it('calls the update template endpoint with encoded id', () => {
            expect(api.putAsync).toHaveBeenCalledWith('/api/templates/foo', {
                name: templateMetadata.name,
                description: templateMetadata.description,
                tags: templateMetadata.tags,
            });
        });
    });

    describe('delete template using id', () => {
        const templateId = 'foo';

        beforeEach(async () => {
            await templateApi.deleteTemplateAsync(templateId);
        });

        it('calls the delete template endpoint with encoded id', () => {
            expect(api.deleteAsync).toHaveBeenCalledWith('/api/templates/foo');
        });
    });

    describe('Fetch model by template Id', () => {
        const templateId = 'foo';

        beforeEach(async () => {
            await templateApi.fetchModelByIdAsync(templateId);
        });

        it('calls the fetch model endpoint with encoded template id', () => {
            expect(api.getAsync).toHaveBeenCalledWith(
                '/api/templates/foo/content'
            );
        });
    });

    describe('bootstrap template store', () => {

        beforeEach(async () => {
            await templateApi.bootstrapAsync();
        });

        it('calls the bootstrap endpoint', () => {
            expect(api.postAsync).toHaveBeenCalledWith(
                '/api/templates/bootstrap'
            );
        });
    });
});
