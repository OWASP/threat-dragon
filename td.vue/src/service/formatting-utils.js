import { marked } from 'marked';
import DOMPurify from 'dompurify';

export function markdownToHTML(markdown) {
    const html = marked.parse(markdown);
    return DOMPurify.sanitize(html);
}
