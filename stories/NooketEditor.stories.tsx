import * as React from 'react';
import styled from 'styled-components';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import NooketEditor, {
  EnumViewMode,
  EnumEditorMode,
} from '../src/NooketEditor';
import { complexText, imagesText } from './test-data';

import 'antd/dist/antd.css';
import '../src/css/editor.css';
import '../src/css/markdown.css';
import 'highlight.js/styles/solarized-light.css';
import 'katex/dist/katex.min.css';

const Container = styled.div`
  margin: 10px;
`;

const actionWithReturn = (name, returnValue) => (...args) => {
  action(name)(...args);
  return returnValue;
};

storiesOf('NooketDoc', module)
  .add('default', () => (
    <Container>
      <NooketEditor
        height={100}
        mode={EnumEditorMode.Vim}
        placeholder="Write something interesting here"
        onToolbarAction={actionWithReturn('onToolbarAction', true)}
        onChange={action('onChange')}
        onModeChange={action('onModeChange')}
      />
    </Container>
  ))
  .add('withValue', () => (
    <Container>
      <NooketEditor
        value={complexText}
        onToolbarAction={actionWithReturn('onToolbarAction', true)}
      />
    </Container>
  ))
  .add('sideBySide', () => (
    <Container>
      <NooketEditor
        zIndex={20}
        fontSize={15}
        value={complexText}
        viewMode={EnumViewMode.SideBySide}
        onToolbarAction={actionWithReturn(
          'onToolbarAction',
          'https://www.google.com'
        )}
      />
    </Container>
  ));
