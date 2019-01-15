import * as React from 'react';
import classNames from 'classnames';
import { Icon } from 'antd';
import { UnControlled as CodeMirrorWrap, IInstance } from './CodeMirrorWrap';

import './css/custom.css';

class NooketEditor extends React.Component {
  state = {
    focusOnEditor: false,
    lines: 0,
    words: 0,
    cursor: '0:0',
    openDialog: false,
  };

  editor: IInstance = null;

  private handleOpenDialog = openDialog => this.setState({ openDialog });

  private handleEditorMounted = editor => {
    this.editor = editor;

    editor.openDialog = this.wrapOpenDialog(editor.openDialog);
  };

  private handleFocusOnEditor = focusOnEditor =>
    this.setState({ focusOnEditor });

  private wrapCloseDialog(fn) {
    const that = this;
    return function() {
      that.handleOpenDialog(false);
      if (fn) {
        fn.apply(that.editor, arguments);
      }
    };
  }

  private wrapOpenDialog(fn) {
    const that = this;
    return function(template, callback, options) {
      console.log(typeof template);
      that.handleOpenDialog(true);
      const newOptions = options;
      newOptions.onClose = that.wrapCloseDialog(options.close);
      if (fn) {
        fn.apply(that.editor, arguments);
      }
    };
  }

  private getToolbarButton = ({ key, icon, title }: any) =>
    icon ? (
      <a key={key} title={title}>
        <Icon type={icon} />
      </a>
    ) : (
      <i key={key} className="separator">
        |
      </i>
    );

  private getToolbar = () => {
    const toolbar = [
      { key: 'bold', icon: 'bold', title: 'Bold (Ctrl+B)' },
      { key: 'italic', icon: 'italic', title: 'Italic (Ctrl+I)' },
      { key: 'underline', icon: 'underline', title: 'Underline (Ctrl+U)' },
      { key: 'sep1' },
    ];
    return (
      <div className="editor-toolbar">
        {toolbar.map(button => this.getToolbarButton(button))}
      </div>
    );
  };

  private getFooter = () => {
    const { lines, words, cursor, openDialog } = this.state;
    return (
      openDialog || (
        <div className="editor-statusbar">
          <span className="autosave" />
          <span className="lines">{lines}</span>
          <span className="words">{words}</span>
          <span className="cursor">{cursor}</span>
        </div>
      )
    );
  };

  public render() {
    const { focusOnEditor } = this.state;
    return (
      <div
        className={classNames('editor-container', { focus: focusOnEditor })}
        onFocus={() => this.handleFocusOnEditor(true)}
        onBlur={() => this.handleFocusOnEditor(false)}
      >
        {this.getToolbar()}
        <CodeMirrorWrap
          value=""
          options={{
            mode: 'gfm',
            theme: 'material',
            lineNumbers: false,
            keyMap: 'vim',
            matchBrackets: true,
            autoCloseBrackets: true,
            viewportMargin: Infinity,
            placeholder: 'Write something interesting here',
          }}
          onChange={(editor, data, value) => {}}
          editorDidMount={this.handleEditorMounted}
        />
        {this.getFooter()}
      </div>
    );
  }
}

export default NooketEditor;
