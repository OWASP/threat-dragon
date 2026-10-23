import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { isDesktopApp } from '@/service/environment.js';

DOMPurify.addHook('afterSanitizeAttributes', function (node) {
    // force links to open in a new tab with noreferrer (which does include noopener)
    // also see https://github.com/cure53/DOMPurify/issues/317
    if (node.nodeName === 'A' && node.hasAttribute('href') && node instanceof HTMLElement) {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noreferrer');
        if (isDesktopApp()) {
            node.setAttribute('title', node.getAttribute('href')); // show the URL as a tooltip in the desktop app
        }
    }
});

export function markdownToHTML(markdown) {
    const html = marked.parse(markdown);
    return DOMPurify.sanitize(html);
}
