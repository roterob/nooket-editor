import * as React from 'react';
import styled from 'styled-components';
import NooketEditor, { NooketEditorProps } from '../src/NooketEditor';

const Container = styled.div`
  margin: 10px;
`;

class NooketEditorWithState extends React.Component<NooketEditorProps, any> {
  public state = { value: this.props.value };

  private handleEditorChange = value => {
    this.setState({ value });
  };

  private handleReset = () => {
    this.setState({ value: '' });
  };

  public render() {
    const { value } = this.state;
    return (
      <Container>
        <button onClick={this.handleReset} style={{ marginBottom: 10 }}>
          Reset
        </button>
        <NooketEditor
          {...this.props}
          value={value}
          onChange={this.handleEditorChange}
        />
      </Container>
    );
  }
}

export default NooketEditorWithState;
