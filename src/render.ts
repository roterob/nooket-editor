import * as MarkdownIt from 'markdown-it';
import * as Container from 'markdown-it-container';
import * as Deflist from 'markdown-it-deflist';
import * as Ins from 'markdown-it-ins';
import * as Mark from 'markdown-it-mark';
import * as Sup from 'markdown-it-sup';
import * as Sub from 'markdown-it-sub';
import * as Footnote from 'markdown-it-footnote';
import * as Emoji from 'markdown-it-emoji';
import * as katex from 'markdown-it-katex';
import * as hljs from 'highlight.js';
import { setFlagsFromString } from 'v8';

export default function createHtmlRender(
  markdownItOptions?: any
): (string, bool) => any {
  const defaults = {
    html: false, // Enable HTML tags in source
    xhtmlOut: false, // Use '/' to close single tags (<br />)
    breaks: false, // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-', // CSS language prefix for fenced blocks
    linkify: true, // autoconvert URL-like texts to links
    linkTarget: '_blank', // set target to open link in
    customLinks: null,
    customLinksHandler: null,
    addLineNumber: false,
    typographer: true, // Enable smartypants and other sweet transforms
    highlight: function(str, lang) {
      var esc = mdHtml.utils.escapeHtml;

      try {
        if (lang && lang !== 'auto' && hljs.getLanguage(lang)) {
          return (
            '<pre class="hljs language-' +
            esc(lang.toLowerCase()) +
            '"><code>' +
            hljs.highlight(lang, str, true).value +
            '</code></pre>'
          );
        } else if (lang === 'auto') {
          var result = hljs.highlightAuto(str);

          return (
            '<pre class="hljs language-' +
            esc(result.language) +
            '"><code>' +
            result.value +
            '</code></pre>'
          );
        }
      } catch (__) {
        /**/
      }

      return '<pre class="hljs"><code>' + esc(str) + '</code></pre>';
    },
  };

  const options = Object.assign({}, defaults, markdownItOptions || {});

  const mdHtml = MarkdownIt(options)
    .use(katex, {
      throwOnError: false,
      errorColor: ' #cc0000',
    })
    .use(Container)
    .use(Deflist)
    .use(Ins)
    .use(Mark)
    .use(Sup)
    .use(Sub)
    .use(Footnote)
    .use(Emoji);

  if (options.addLineNumbers) {
    function injectLineNumbers(tokens, idx, options, env, slf) {
      let line;
      if (tokens[idx].map && tokens[idx].level === 0) {
        line = tokens[idx].map[0];
        tokens[idx].attrJoin('class', 'line');
        tokens[idx].attrSet('data-line', String(line));
      }
      return slf.renderToken(tokens, idx, options, env, slf);
    }

    mdHtml.renderer.rules.paragraph_open = mdHtml.renderer.rules.heading_open = injectLineNumbers;
  }

  const customLinksSupport = options.customLinks && options.customLinksHandler;

  if (options.linkTarget || customLinksSupport) {
    mdHtml.renderer.rules.link_open = function(
      tokens,
      idx,
      options,
      env,
      self
    ) {
      // If you are sure other plugins can't add `target` - drop check below
      let aIndex = tokens[idx].attrIndex('target');
      if (aIndex < 0) {
        tokens[idx].attrPush(['target', options.linkTarget]); // add new attribute
      } else {
        tokens[idx].attrs[aIndex][1] = options.linkTarget; // replace value of existing attr
      }

      if (customLinksSupport) {
        aIndex = tokens[idx].attrIndex('href');
        if (aIndex >= 0) {
          const currentValue = tokens[idx].attrs[aIndex][1];
          if (currentValue.startsWith(options.customLinks)) {
            const attributes = options.customLinksHandler(
              'a',
              currentValue,
              tokens
            );
            if (typeof attributes === 'string') {
              tokens[idx].attrs[aIndex][1] = attributes;
            } else {
              addAttributes(tokens[idx], attributes);
            }
          }
        }
      }

      // pass token to default renderer.
      return self.renderToken(tokens, idx, options, env, self);
    };
  }

  if (customLinksSupport) {
    mdHtml.renderer.rules.image = function(tokens, idx, options, env, self) {
      const aIndex = tokens[idx].attrIndex('src');
      if (aIndex >= 0) {
        const currentValue = tokens[idx].attrs[aIndex][1];
        if (currentValue.startsWith(options.customLinks)) {
          const attributes = options.customLinksHandler(
            'img',
            currentValue,
            tokens
          );
          if (typeof attributes === 'string') {
            tokens[idx].attrs[aIndex][1] = attributes;
          } else {
            addAttributes(tokens[idx], attributes);
          }
        }
      }

      // pass token to default renderer.
      return self.renderToken(tokens, idx, options, env, self);
    };
  }

  return src => {
    if (src) {
      return mdHtml.render(src);
    } else {
      return '';
    }
  };
}

function addAttributes(token, attrObj) {
  if (attrObj) {
    Object.keys(attrObj).forEach(k => {
      const index = token.attrIndex(k);
      if (index < 0) {
        token.attrPush([k, attrObj[k]]);
      } else {
        token.attrs[index][1] = attrObj[k];
      }
    });
  }
}
