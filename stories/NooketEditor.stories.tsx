import * as React from 'react';
import styled from 'styled-components';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import NooketEditor, { EnumViewMode } from '../src/NooketEditor';
import { complexText, imagesText } from './test-data';

import 'antd/dist/antd.css';

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
        placeholder="Write something interesting here"
        onToolbarAction={actionWithReturn('onToolbarAction', true)}
        onChange={action('onChange')}
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
        value={complexText}
        viewMode={EnumViewMode.SideBySide}
        onToolbarAction={actionWithReturn('onToolbarAction', true)}
      />
    </Container>
  ));
