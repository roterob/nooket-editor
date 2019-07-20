import * as React from 'react';
import styled from 'styled-components';
import { Select } from 'antd';
import NooketEditor, { NooketEditorProps } from '../src/NooketEditor';

const Container = styled.div`
  margin: 10px;
`;

class NooketEditorWithState extends React.Component<NooketEditorProps, any> {
  public state = { value: this.props.value, header: null };

  private toolbarActionResolver = null;

  private handleEditorChange = value => {
    this.setState({ value });
  };

  private handleReset = () => {
    this.setState({ value: '' });
  };

  private handleSelectChange = value => {
    this.toolbarActionResolver({
      link: 'nooket://3219jh1h4321g',
      text: 'Título de la instancia',
    });
    // this.toolbarActionResolver(':two_hearts:');
    this.setState({ header: null });
    this.toolbarActionResolver = null;
  };

  private handleEsc = e => {
    if (e.keyCode === 27) {
      this.toolbarActionResolver(false);
      this.setState({ header: null });
      this.toolbarActionResolver = null;
    }
  };

  private getSelect = () => (
    <Select
      mode="multiple"
      autoFocus={true}
      style={{ width: '100%' }}
      onChange={this.handleSelectChange}
      onInputKeyDown={this.handleEsc}
    >
      <Select.Option value="Uno">Uno</Select.Option>
      <Select.Option value="Dos">Dos</Select.Option>
      <Select.Option value="Tres">Tres</Select.Option>
      <Select.Option value="Cuatro">Cuatro</Select.Option>
    </Select>
  );

  private handleToolBarAction = (editor, action) => {
    let res = null;
    if (action === 'instance') {
      res = new Promise((resolve, reject) => {
        this.toolbarActionResolver = resolve;
      });
      this.setState({
        header: this.getSelect(),
      });
    }
    return res;
  };

  public render() {
    const { value, header } = this.state;
    const { onToolbarAction, ...restProps } = this.props;
    const markdonwOptions = {
      customLinks: 'nooket://',
      customLinksHandler: (type, href) => {
        if (type === 'a') {
          return {
            id: href.replace('nooket://', ''),
            href: 'javascript:void(0)',
          };
        } else {
          return 'https://static3.abc.es/media/tecnologia/2018/09/25/google-chrome-0-kCD--620x349@abc.jpg';
        }
      },
    };

    return (
      <Container>
        <button onClick={this.handleReset} style={{ marginBottom: 10 }}>
          Reset
        </button>
        <NooketEditor
          {...restProps}
          onToolbarAction={onToolbarAction || this.handleToolBarAction}
          header={header}
          value={value}
          onChange={this.handleEditorChange}
          markdownItOptions={markdonwOptions}
        />
      </Container>
    );
  }
}

export default NooketEditorWithState;
