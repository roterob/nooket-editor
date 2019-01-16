import * as React from 'react';
import classNames from 'classnames';
import { Icon } from 'antd';
import { UnControlled as CodeMirrorWrap, IInstance } from './CodeMirrorWrap';
import { wordCount, getState, toolbarBuiltInButtons } from './util';
import { EnumToolbarButtons } from './types';

import './css/custom.css';

export type NooketEditorProps = {
  showToolbar?: boolean;
  showStatusbar?: boolean;
  toolbar?: EnumToolbarButtons[];
};

class NooketEditor extends React.Component<NooketEditorProps, any> {
  static defaultProps = {
    showToolbar: true,
    showStatusbar: true,
    toolbar: [
      EnumToolbarButtons.bold,
      EnumToolbarButtons.italic,
      EnumToolbarButtons.heading,
      EnumToolbarButtons.separator,
      EnumToolbarButtons.quote,
      EnumToolbarButtons.unorderedList,
      EnumToolbarButtons.orderedList,
      EnumToolbarButtons.separator,
      EnumToolbarButtons.link,
      EnumToolbarButtons.image,
      EnumToolbarButtons.separator,
      EnumToolbarButtons.preview,
      EnumToolbarButtons.sideBySide,
      EnumToolbarButtons.fullscreen,
    ],
  };

  state = {
    focusOnEditor: false,
    lines: 0,
    words: 0,
    cursor: '0:0',
    stat: {},
  };

  editor: IInstance = null;
  numSep: number = 0;

  private handleEditorMounted = editor => {
    this.editor = editor;
  };

  private handleFocusOnEditor = focusOnEditor =>
    this.setState({ focusOnEditor });

  private handleEditorChange = (editor, data, value) => {
    const newState = {
      lines: this.editor.lineCount(),
      words: wordCount(value),
    };

    this.setState(newState);
  };

  private handleCursorActivity = () => {
    const pos = this.editor.getCursor();
    const stat = getState(this.editor, pos);

    this.setState({ cursor: `${pos.line + 1}:${pos.ch + 1}`, stat });
  };

  private getToolbarButton = buttonName => {
    const buttonDefinition = toolbarBuiltInButtons[buttonName];

    if (buttonName === EnumToolbarButtons.separator) {
      this.numSep += 1;

      return (
        <i key={`${buttonName}${this.numSep}`} className="separator">
          |
        </i>
      );
    } else if (buttonDefinition) {
      const { name, title, icon, action } = buttonDefinition;
      const { stat } = this.state;

      return (
        <a
          key={name}
          title={title}
          onClick={() => action(this.editor)}
          className={classNames({ active: stat[name] })}
        >
          <Icon type={icon} />
        </a>
      );
    }
  };

  private getToolbar = () => {
    const { toolbar } = this.props;

    this.numSep = 0;

    return (
      <div className="editor-toolbar">
        {toolbar.map(buttonName => this.getToolbarButton(buttonName))}
      </div>
    );
  };

  private getFooter = () => {
    const { showStatusbar } = this.props;
    const { lines, words, cursor } = this.state;
    return (
      showStatusbar && (
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
          onChange={this.handleEditorChange}
          editorDidMount={this.handleEditorMounted}
          onCursorActivity={this.handleCursorActivity}
        />
        {this.getFooter()}
      </div>
    );
  }
}

export default NooketEditor;
