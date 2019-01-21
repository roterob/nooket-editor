import * as Remarkable from 'remarkable';
import * as hl from 'highlight.js';
import * as renderHtml from 'react-render-html';

export default function getHtmlRender() {
  const defaults = {
    html: false, // Enable HTML tags in source
    xhtmlOut: false, // Use '/' to close single tags (<br />)
    breaks: false, // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-', // CSS language prefix for fenced blocks
    linkify: true, // autoconvert URL-like texts to links
    linkTarget: '', // set target to open link in
    typographer: true, // Enable smartypants and other sweet transforms
    highlight: function(str, lang) {
      if (lang && hl.getLanguage(lang)) {
        try {
          return hl.highlight(lang, str).value;
        } catch (__) {}
      }

      try {
        return hl.highlightAuto(str).value;
      } catch (__) {}

      return '';
    },
  };

  const mdHtml = new Remarkable('full', defaults);

  //
  // Inject line numbers for sync scroll. Notes:
  //
  // - We track only headings and paragraphs on first level. That's enougth.
  // - Footnotes content causes jumps. Level limit filter it automatically.
  //

  mdHtml.renderer.rules.paragraph_open = function(tokens, idx) {
    var line;
    if (tokens[idx].lines && tokens[idx].level === 0) {
      line = tokens[idx].lines[0];
      return '<p class="line" data-line="' + line + '">';
    }
    return '<p>';
  };

  mdHtml.renderer.rules.heading_open = function(tokens, idx) {
    var line;
    if (tokens[idx].lines && tokens[idx].level === 0) {
      line = tokens[idx].lines[0];
      return (
        '<h' + tokens[idx].hLevel + ' class="line" data-line="' + line + '">'
      );
    }
    return '<h' + tokens[idx].hLevel + '>';
  };

  return function(src) {
    const plainHtml = mdHtml.render(src);
    return renderHtml(plainHtml); //Render html as a React DOM object
  };
}
