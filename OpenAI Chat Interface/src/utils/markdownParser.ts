// src/utils/markdownParser.ts 
export const parseMarkdown = (text: string): string => {
  // Escape HTML to prevent XSS
  const escapeHtml = (str: string) =>
    str.replace(/[&<>"']/g, (match) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[match] || match));

  let html = escapeHtml(text);

  // Bold: **text** -> <strong>text</strong>
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic: *text* -> <em>text</em>
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Headers: # text -> <h1>text</h1>, ## text -> <h2>text</h2>, etc.
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

  // Inline code: `code` -> <code>code</code>
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');

  // Code blocks: ```code``` -> <pre><code>code</code></pre>
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  // Line breaks: \n -> <br>
  html = html.replace(/\n/g, '<br>');

  return html;
};