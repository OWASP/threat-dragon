import { markdownToHTML } from '@/service/formatting-utils.js';
import { isDesktopApp } from '@/service/environment.js';

jest.mock('@/service/environment.js', () => ({
    isDesktopApp: jest.fn()
}));

describe('Markdown formatting', () => {

    const render = (markdown) => {
        const container = document.createElement('div');
        container.innerHTML = markdownToHTML(markdown);
        return container;
    };

    it('keeps attribute-like URL content inside the tooltip text', () => {
        const link = render('<a href="https://example.com/?q=&quot; onmouseover=&quot;alert(1)">Reference</a>').querySelector('a');

        expect(link.getAttribute('onmouseover')).toBeNull();
    });

    it('continues opening links in a new window', () => {
        const link = render('[Reference](https://example.com/reference)').querySelector('a');

        expect(link.target).toEqual('_blank');
    });

    it('continues suppressing referrers for links', () => {
        const link = render('[Reference](https://example.com/reference)').querySelector('a');

        expect(link.rel).toEqual('noreferrer');
    });

    it('does not add a destination tooltip to anchors without a URL', () => {
        const link = render('<a id="reference">Reference</a>').querySelector('a');

        expect(link.hasAttribute('title')).toBe(false);
    });

    it('does not add a destination tooltip to stripped unsafe URLs', () => {
        const link = render('<a href="javascript:alert(1)">Reference</a>').querySelector('a');

        expect(link.hasAttribute('title')).toBe(false);
    });

    it('preserves image titles', () => {
        const image = render('![Diagram](https://example.com/diagram.png "Diagram title")').querySelector('img');

        expect(image.title).toEqual('Diagram title');
    });

    it('continues rendering other Markdown', () => {
        expect(render('**Important**').querySelector('strong').textContent).toEqual('Important');
    });

    describe('on desktop', () => {
        beforeEach(() => {
            isDesktopApp.mockReturnValue(true);
        });

        it('uses the destination URL as the link tooltip', () => {
            const link = render('[Reference](https://example.com/reference)').querySelector('a');

            expect(link.title).toEqual('https://example.com/reference');
        });


        it('replaces a custom Markdown link title with the destination URL', () => {
            const link = render('[Reference](https://example.com/reference "Another destination")').querySelector('a');

            expect(link.title).toEqual('https://example.com/reference');
        });


        it('adds the link tooltip for automatic links', () => {
            const link = render('<https://example.com/reference>').querySelector('a');

            expect(link.title).toEqual('https://example.com/reference');
        });


        it('preserves query parameters and fragments in the tooltip', () => {
            const url = 'https://example.com/?first=one&second=two#reference';
            const link = render(`[Reference](${url})`).querySelector('a');

            expect(link.title).toEqual(url);
        });
    });

    describe('in a browser', () => {
        beforeEach(() => {
            isDesktopApp.mockReturnValue(false);
        });

        it('does not add a link tooltip', () => {
            const link = render('[Reference](https://example.com/reference)').querySelector('a');

            expect(link.hasAttribute('title')).toBe(false);
        });

        it('preserves custom Markdown link titles', () => {
            const link = render('[Reference](https://example.com/reference "Another destination")').querySelector('a');

            expect(link.title).toEqual('Another destination');
        });
    });
});
