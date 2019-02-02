import * as React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Icon, Dropdown, Menu } from 'antd';
import { UnControlled as CodeMirrorWrap, IInstance } from './CodeMirrorWrap';
import * as memoize from 'memoize-one';
import {
  wordCount,
  getState,
  toolbarBuiltInButtons,
  fixShortcut,
  promptTexts,
} from './util';
import createHtmlRender from './render';
import createScrollSync from './createScrollSync';
import { EnumToolbarButtons } from './types';

const ContainerEditor = styled.div`
  background-color: #fff;
  z-index: ${props => props.zIndex};

  .CodeMirror {
    font-size: ${props => props.fontSize}px;
  }

  .CodeMirror-scroll {
    min-height: ${props => props.height}px;
  }
`;

export enum EnumEditorMode {
  Vim = 'Vim',
  Normal = 'Normal',
}

export enum EnumViewMode {
  Normal = 'Normal',
  SideBySide = 'SideBySide',
  Fullscreen = 'Fullscreen',
  Preview = 'Preview',
}

export type NooketEditorProps = {
  showToolbar?: boolean;
  showStatusbar?: boolean;
  spellChecker?: boolean;
  toolbar?: EnumToolbarButtons[];
  mode?: EnumEditorMode;
  viewMode?: EnumViewMode;
  value?: string;
  placeholder?: string;
  height?: number;
  zIndex?: number;
  fontSize?: number;
  onToolbarAction?: (IInstance, string) => any;
  onChange?: (string) => void;
  onModeChange?: (EnumEditorMode) => void;
};

class NooketEditor extends React.Component<NooketEditorProps, any> {
  static defaultProps = {
    showToolbar: true,
    showStatusbar: true,
    spellChecker: false,
    mode: EnumEditorMode.Vim,
    viewMode: EnumViewMode.Normal,
    value: '',
    placeholder: '',
    height: 150,
    zIndex: 10,
    fontSize: 14,
    onToolbarAction: (editor, actionName) => true,
    onChange: _ => {},
    onModeChange: _ => {},
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
    value: this.props.value,
    isFullscreen: false,
    isSideBySide: false,
    isPreview: false,
    focusOnEditor: false,
    lines: 0,
    words: 0,
    cursor: '0:0',
    stat: {},
    prevViewMode: null,
    mode: null,
    prevMode: null,
    lastUpdate: new Date().getTime(),
    height: null,
  };

  editor: IInstance = null;
  CodeMirror: any = null;
  numSep: number = 0;
  savedOverflow: any = null;
  renderHtml: any = createHtmlRender();
  scrollSync: any = null;
  sideBySideRef: any = React.createRef();
  previewPanel: HTMLElement = null;

  static getDerivedStateFromProps(nextProps, state) {
    const { viewMode, mode } = nextProps;
    const newState = { ...state };

    if (!state.prevViewMode || viewMode !== state.prevViewMode) {
      newState.isFullscreen =
        viewMode === EnumViewMode.Fullscreen ||
        viewMode === EnumViewMode.SideBySide;
      newState.isPreview = viewMode === EnumViewMode.Preview;
      newState.isSideBySide = viewMode === EnumViewMode.SideBySide;
      newState.prevViewMode = viewMode;
    }

    if (state.prevMode !== mode) {
      newState.prevMode = mode;
      newState.mode = mode;
    }

    return newState;
  }

  public componentDidMount() {
    const { isSideBySide, value } = this.state;

    this.editor.setValue(value);

    const sourcePanel = this.editor
      .getWrapperElement()
      .querySelector('.CodeMirror-scroll') as HTMLElement;
    const previewPanel = this.sideBySideRef.current;

    this.scrollSync = createScrollSync(sourcePanel, previewPanel);

    // add preview panel
    this.previewPanel = document.createElement('div');
    this.previewPanel.className = 'editor-preview markdown-body';
    this.editor.getWrapperElement().appendChild(this.previewPanel);

    this.applySideEffects();
  }

  public componentWillUnmount() {
    this.scrollSync.off();
  }

  public componentDidUpdate() {
    this.applySideEffects();
  }

  private applySideEffects() {
    const {
      isFullscreen,
      isSideBySide,
      isPreview,
      lastUpdate,
      value,
    } = this.state;

    // Prevent scrolling on body during fullscreen active
    if (isFullscreen) {
      if (this.savedOverflow == null) {
        this.savedOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        this.editor.setOption('viewportMargin', 500);
      }
    } else {
      document.body.style.overflow = this.savedOverflow;
      this.savedOverflow = null;
      this.editor.setOption('viewportMargin', Infinity);
    }

    if (!isFullscreen && isPreview) {
      this.previewPanel.className =
        'editor-preview editor-preview-active markdown-body';
      this.previewPanel.innerHTML = this.renderHtml(value);
    } else {
      this.previewPanel.className = 'editor-preview markdown-body';
      this.previewPanel.innerHTML = '';
    }

    if (isSideBySide) {
      this.scrollSync.on(lastUpdate);
    } else {
      this.scrollSync.off();
    }
  }

  private handleEditorMounted = (editor, value, cb, codemirror) => {
    this.editor = editor;
    this.CodeMirror = codemirror;
  };

  private handleFocusOnEditor = focusOnEditor =>
    this.setState({ focusOnEditor });

  private handleEditorChange = (editor, data, value) => {
    const { showStatusbar, onChange } = this.props;

    let newState: any = { value, lastUpdate: new Date().getTime() };

    if (showStatusbar) {
      newState = {
        lines: this.editor.lineCount(),
        words: wordCount(value),
        ...newState,
      };
    }

    this.setState(newState);
    onChange(value);
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
      isPreview: false,
    });
  };

  private handlePreview = () => {
    const { isPreview } = this.state;

    this.setState({
      isSideBySide: false,
      isPreview: !isPreview,
    });
  };

  private handleToolbarAction = (actionName, defaultAction) => {
    const { onToolbarAction } = this.props;

    const res = onToolbarAction(this.editor, actionName);

    if (res !== false) {
      if (actionName === 'fullscreen') {
        this.handleFullscreen();
      } else if (actionName === 'side-by-side') {
        this.handleSideBySide();
      } else if (actionName === 'preview') {
        this.handlePreview();
      } else if (defaultAction) {
        defaultAction(this.editor, res);
      }
    }
  };

  private handleESC = (cm, e) => {
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

  private handleRenderLine(cm, line, elt) {
    const lineInfo = cm.lineInfo(line);
    elt.setAttribute('data-line', lineInfo.line);
  }

  private handleModeChange = mode => {
    const { onModeChange } = this.props;
    this.setState({ mode });
    onModeChange(mode);
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
    const { spellChecker } = this.props;
    const { mode } = this.state;

    const res: any = {
      mode: { name: 'cmd', allowAtxHeaderWithoutSpace: false },
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
    const { lines, words, cursor, mode } = this.state;

    return (
      showStatusbar && (
        <div className="editor-statusbar">
          <div className="mode">
            <Dropdown
              overlay={
                <Menu
                  className="mode-menu"
                  onClick={menu => this.handleModeChange(menu.key)}
                >
                  <Menu.Item key={EnumEditorMode.Normal}>Normal mode</Menu.Item>
                  <Menu.Item key={EnumEditorMode.Vim}>Vim mode</Menu.Item>
                </Menu>
              }
            >
              <span style={{ userSelect: 'none', cursor: 'pointer' }}>
                {mode == EnumEditorMode.Vim ? 'Vim mode' : 'Normal mode'}{' '}
                <Icon type="down" />
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
    const {
      focusOnEditor,
      isFullscreen,
      isSideBySide,
      isPreview,
      value,
    } = this.state;
    const { mode, backdrop, keyMap } = this.getModeConfig();
    const { placeholder, height, zIndex, fontSize } = this.props;

    return (
      <ContainerEditor
        className={classNames('editor-container', {
          focus: focusOnEditor,
          fullscreen: isFullscreen,
          sided: isSideBySide,
          preview: isPreview,
        })}
        onFocus={() => this.handleFocusOnEditor(true)}
        onBlur={() => this.handleFocusOnEditor(false)}
        height={height}
        zIndex={zIndex}
        fontSize={fontSize}
      >
        {this.getToolbar()}
        <CodeMirrorWrap
          options={{
            mode,
            backdrop,
            theme: 'material',
            lineNumbers: false,
            keyMap,
            matchBrackets: true,
            autoCloseBrackets: true,
            viewportMargin: Infinity,
            placeholder,
            lineWrapping: true,
            extraKeys: this.getShortcuts(),
          }}
          onChange={this.handleEditorChange}
          editorDidMount={this.handleEditorMounted}
          onCursorActivity={this.handleCursorActivity}
          onRenderLine={this.handleRenderLine}
        />
        <div
          ref={this.sideBySideRef}
          className={classNames('editor-preview-side', 'markdown-body', {
            'editor-preview-active-side': isSideBySide,
          })}
          dangerouslySetInnerHTML={{
            __html: isSideBySide && this.renderHtml(value),
          }}
        />
        {isPreview && isFullscreen && (
          <div
            className={classNames(
              'editor-preview',
              'editor-preview-active',
              'markdown-body'
            )}
            dangerouslySetInnerHTML={{ __html: this.renderHtml(value) }}
          />
        )}
        {this.getFooter()}
      </ContainerEditor>
    );
  }
}

export default NooketEditor;
