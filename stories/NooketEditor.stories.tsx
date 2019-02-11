import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import NooketEditor, {
  EnumViewMode,
  EnumEditorMode,
} from '../src/NooketEditor';
import NooketEditorWithState from './NooketEditorWithState';
import { complexText, imagesText } from './test-data';

import 'antd/dist/antd.css';
import '../src/css/editor.css';
import '../src/css/markdown.css';
import 'highlight.js/styles/solarized-light.css';
import 'katex/dist/katex.min.css';

const actionWithReturn = (name, returnValue) => (...args) => {
  action(name)(...args);
  return returnValue;
};

storiesOf('NooketDoc', module)
  .add('default', () => (
    <NooketEditorWithState
      height={100}
      mode={EnumEditorMode.Vim}
      placeholder="Write something interesting here"
      onToolbarAction={actionWithReturn('onToolbarAction', true)}
      onChange={action('onChange')}
      onModeChange={action('onModeChange')}
    />
  ))
  .add('withValue', () => (
    <NooketEditorWithState
      value={complexText}
      onToolbarAction={actionWithReturn('onToolbarAction', true)}
    />
  ))
  .add('sideBySide', () => (
    <NooketEditorWithState
      zIndex={20}
      fontSize={15}
      value={complexText}
      viewMode={EnumViewMode.SideBySide}
      onToolbarAction={actionWithReturn(
        'onToolbarAction',
        'https://www.google.com'
      )}
    />
  ))
  .add('reset', () => <NooketEditorWithState value="Un valor" />);
