import * as React from 'react';
import classNames from 'classnames';
import { Icon, Dropdown, Menu } from 'antd';
import { UnControlled as CodeMirrorWrap, IInstance } from './CodeMirrorWrap';
import * as memoize from 'memoize-one';
import {
  wordCount,
  getState,
  toolbarBuiltInButtons,
  fixShortcut,
} from './util';
import { EnumToolbarButtons } from './types';

import './css/custom.css';
import { any } from 'prop-types';

export enum EnumEditorMode {
  Vim = 'Vim',
  Normal = 'Normal',
}

export type NooketEditorProps = {
  showToolbar?: boolean;
  showStatusbar?: boolean;
  spellChecker?: boolean;
  toolbar?: EnumToolbarButtons[];
  mode?: EnumEditorMode;
  onToolbarAction?: (IInstance) => any;
};

class NooketEditor extends React.Component<NooketEditorProps, any> {
  static defaultProps = {
    showToolbar: true,
    showStatusbar: true,
    spellChecker: false,
    mode: EnumEditorMode.Vim,
    onToolbarAction: editor => true,
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
    isFullscreen: false,
    isSideBySide: false,
    isPreview: false,
    focusOnEditor: false,
    lines: 0,
    words: 0,
    cursor: '0:0',
    stat: {},
  };

  editor: IInstance = null;
  CodeMirror: any = null;
  numSep: number = 0;
  savedOverflow: any = null;

  public componentDidUpdate() {
    const { isFullscreen } = this.state;

    // Prevent scrolling on body during fullscreen active
    if (isFullscreen) {
      if (this.savedOverflow == null) {
        this.savedOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        this.editor.setOption('viewportMargin', 10);
      }
    } else {
      document.body.style.overflow = this.savedOverflow;
      this.savedOverflow = null;
      this.editor.setOption('viewportMargin', Infinity);
    }
  }

  private handleEditorMounted = (editor, value, cb, codemirror) => {
    this.editor = editor;
    this.CodeMirror = codemirror;
  };

  private handleFocusOnEditor = focusOnEditor =>
    this.setState({ focusOnEditor });

  private handleEditorChange = (editor, data, value) => {
    const { showStatusbar } = this.props;

    if (showStatusbar) {
      const newState = {
        lines: this.editor.lineCount(),
        words: wordCount(value),
      };

      this.setState(newState);
    }
  };

  private handleFullscreen = () => {
    const { isFullscreen } = this.state;

    this.setState({
      isFullscreen: !isFullscreen,
      isSideBySide: false,
    });
  };

  private handleSideBySide = () => {
    const { isSideBySide, isFullscreen } = this.state;

    this.setState({
      isSideBySide: !isSideBySide,
      isFullscreen: isSideBySide ? isFullscreen : true,
    });
  };

  private handleToolbarAction = (actionName, defaultAction) => {
    const { onToolbarAction } = this.props;

    const res = onToolbarAction(this.editor);

    if (res) {
      if (actionName === 'fullscreen') {
        this.handleFullscreen();
      } else if (actionName == 'side-by-side') {
        this.handleSideBySide();
      } else if (defaultAction) {
        defaultAction(this.editor, res);
      }
    }
  };

  private handleESC = cm => {
    const { mode } = this.props;
    const { isFullscreen } = this.state;

    const isVimMode = mode === EnumEditorMode.Vim;
    const vimInNormalMode = cm.getOption('keyMap') === 'vim';

    if (isVimMode && !vimInNormalMode) {
      this.CodeMirror.Vim.handleKey(cm, '<Esc>');
    } else if (isFullscreen) {
      this.handleFullscreen();
    }
  };

  private handleCursorActivity = () => {
    const { showToolbar } = this.props;

    if (!showToolbar) return;

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
      const { name, title, icon, action, shortcut } = buttonDefinition;
      const { stat, isFullscreen, isSideBySide, isPreview } = this.state;

      stat['preview'] = isPreview;
      stat['fullscreen'] = isFullscreen;
      stat['side-by-side'] = isSideBySide;

      return (
        <a
          key={name}
          title={`${title} (${fixShortcut(shortcut)})`}
          onClick={() => this.handleToolbarAction(name, action)}
          className={classNames({ active: stat[name] })}
        >
          {typeof icon === 'string' ? (
            <Icon type={icon} />
          ) : (
            <Icon component={icon} />
          )}
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

  // Memoize this to avoid re-renders despite of inline delegate usage.
  private getShortcuts = memoize(() => {
    const { toolbar } = this.props;

    const keymappings = {};
    toolbar.forEach(b => {
      const buttonDefinition = toolbarBuiltInButtons[b];
      if (buttonDefinition && buttonDefinition.shortcut) {
        keymappings[fixShortcut(buttonDefinition.shortcut)] = () => {
          this.handleToolbarAction(
            buttonDefinition.name,
            buttonDefinition.action
          );
        };
      }
    });

    keymappings['Enter'] = 'newlineAndIndentContinueMarkdownList';
    keymappings['Esc'] = this.handleESC;
    return keymappings;
  });

  private getModeConfig = () => {
    const { spellChecker, mode } = this.props;
    const res: any = {
      mode: { name: 'gfm', allowAtxHeaderWithoutSpace: false },
      backdrop: null,
      keyMap: 'default',
    };

    if (spellChecker === true) {
      res.backdrop = res.mode;
      res.mode = { name: 'spell-checker' };
    }

    if (mode === EnumEditorMode.Vim) {
      res.keyMap = 'vim';
    }

    return res;
  };

  private getFooter = () => {
    const { showStatusbar } = this.props;
    const { lines, words, cursor } = this.state;
    return (
      showStatusbar && (
        <div className="editor-statusbar">
          <div className="mode">
            <Dropdown
              overlay={
                <Menu className="mode-menu">
                  <Menu.Item key="0">Normal mode</Menu.Item>
                  <Menu.Item key="1">Vim mode</Menu.Item>
                </Menu>
              }
            >
              <span style={{ userSelect: 'none', cursor: 'pointer' }}>
                Vim mode <Icon type="down" />
              </span>
            </Dropdown>
          </div>
          <span className="autosave" />
          <span className="lines">{lines}</span>
          <span className="words">{words}</span>
          <span className="cursor">{cursor}</span>
        </div>
      )
    );
  };

  public render() {
    const { focusOnEditor, isFullscreen, isSideBySide } = this.state;
    const { mode, backdrop, keyMap } = this.getModeConfig();

    return (
      <div
        className={classNames('editor-container', {
          focus: focusOnEditor,
          fullscreen: isFullscreen,
          sided: isSideBySide,
        })}
        onFocus={() => this.handleFocusOnEditor(true)}
        onBlur={() => this.handleFocusOnEditor(false)}
      >
        {this.getToolbar()}
        <CodeMirrorWrap
          value=""
          options={{
            mode,
            backdrop,
            theme: 'material',
            lineNumbers: false,
            keyMap,
            matchBrackets: true,
            autoCloseBrackets: true,
            viewportMargin: Infinity,
            placeholder: 'Write something interesting here',
            lineWrapping: true,
            extraKeys: this.getShortcuts(),
          }}
          onChange={this.handleEditorChange}
          editorDidMount={this.handleEditorMounted}
          onCursorActivity={this.handleCursorActivity}
        />
        <div
          className={classNames('editor-preview-side', {
            'editor-preview-active-side': isSideBySide,
          })}
        />
        {this.getFooter()}
      </div>
    );
  }
}

export default NooketEditor;
