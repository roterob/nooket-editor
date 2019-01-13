import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import NooketEditor from '../src/NooketEditor';
import { UnControlled as CodeMirror } from '../src/CodeMirrorWrap';

import 'antd/dist/antd.css';
import '../src/css/custom.css';

storiesOf('NooketDoc', module)
  .add('default', () => <NooketEditor />)
  .add('CodeMirror', () => (
    <CodeMirror
      value="# I ♥ codemirror"
      options={{
        mode: 'gfm',
        theme: 'material',
        lineNumbers: true,
        keyMap: 'vim',
        matchBrackets: true,
        autoCloseBrackets: true,
      }}
      onChange={(editor, data, value) => {}}
    />
  ));
