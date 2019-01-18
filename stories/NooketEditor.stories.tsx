import * as React from 'react';
import styled from 'styled-components';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import NooketEditor from '../src/NooketEditor';
import { UnControlled as CodeMirror } from '../src/CodeMirrorWrap';

import 'antd/dist/antd.css';

const Container = styled.div`
  margin: 10px;
`;

const actionWithReturn = (name, returnValue) => (...args) => {
  action(name)(...args);
  return returnValue;
};

storiesOf('NooketDoc', module).add('default', () => (
  <Container>
    <NooketEditor onToolbarAction={actionWithReturn('onToolbarAction', true)} />
  </Container>
));
