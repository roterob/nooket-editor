import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import NooketEditor from '../src/NooketEditor';

storiesOf('NooketDoc', module).add('default', () => <NooketEditor />);
