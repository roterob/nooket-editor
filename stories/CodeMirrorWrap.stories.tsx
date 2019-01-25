import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import NooketEditor from '../src/NooketEditor';
import { UnControlled as CodeMirror } from '../src/CodeMirrorWrap';

import 'antd/dist/antd.css';
import '../src/css/editor.css';

const testValue = ` GitHub Flavored Markdown
---

Everything from markdown plus GFM features:

## URL autolinking

Underscores_are_allowed_between_words.

## Strikethrough text

GFM adds syntax to strikethrough text, which is missing from standard Markdown.

~~Mistaken text.~~
~~**works with other formatting**~~

~~spans across
lines~~

## Fenced code blocks (and syntax highlighting)

\`\`\`javascript
for (var i = 0; i < items.length; i++) {
    console.log(items[i], i); // log them
}
\`\`\`

## Task Lists

- [ ] Incomplete task list item
- [x] **Completed** task list item

## A bit of GitHub spice

See http://github.github.com/github-flavored-markdown/.

(Set \`gitHubSpice: false\` in mode options to disable):

* SHA: be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2
* User@SHA ref: mojombo@be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2
* User/Project@SHA: mojombo/god@be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2
* \#Num: #1
* User/#Num: mojombo#1
* User/Project#Num: mojombo/god#1

(Set \`emoji: false\` in mode options to disable):

* emoji: :smile:

`;

storiesOf('CodeMirrorWrap', module)
  .add('placeholder', () => (
    <CodeMirror
      options={{
        mode: 'gfm',
        theme: 'material',
        lineNumbers: false,
        keyMap: 'vim',
        matchBrackets: true,
        autoCloseBrackets: true,
        viewportMargin: Infinity,
        placeholder: 'This is a placeholder',
      }}
      onChange={(editor, data, value) => {}}
    />
  ))
  .add('Prototype', () => (
    <React.Fragment>
      <div className="editor-toolbar">
        <a title="Bold (Ctrl-B)" className="fa fa-bold" />
        <a title="Italic (Ctrl-I)" className="fa fa-italic" />
        <a title="Heading (Ctrl-H)" className="fa fa-header" />
        <i className="separator">|</i>
        <a title="Quote (Ctrl-')" className="fa fa-quote-left" />
        <a title="Generic List (Ctrl-L)" className="fa fa-list-ul" />
        <a title="Numbered List (Ctrl-Alt-L)" className="fa fa-list-ol" />
        <i className="separator">|</i>
        <a title="Create Link (Ctrl-K)" className="fa fa-link" />
        <a title="Insert Image (Ctrl-Alt-I)" className="fa fa-picture-o" />
        <i className="separator">|</i>
        <a title="Toggle Preview (Ctrl-P)" className="fa fa-eye no-disable" />
        <a
          title="Toggle Side by Side (F9)"
          className="fa fa-columns no-disable no-mobile"
        />
        <a
          title="Toggle Fullscreen (F11)"
          className="fa fa-arrows-alt no-disable no-mobile"
        />
        <i className="separator">|</i>
        <a
          title="Markdown Guide"
          className="fa fa-question-circle"
          href="https://simplemde.com/markdown-guide"
          target="_blank"
        />
      </div>
      <CodeMirror
        value={testValue}
        options={{
          mode: 'gfm',
          theme: 'material',
          lineNumbers: false,
          keyMap: 'vim',
          matchBrackets: true,
          autoCloseBrackets: true,
          viewportMargin: Infinity,
        }}
        onChange={(editor, data, value) => {}}
      />
      <div className="editor-statusbar">
        <span className="autosave" />
        <span className="lines">18</span>
        <span className="words">105</span>
        <span className="cursor">0:0</span>
      </div>
    </React.Fragment>
  ));
