import BoldSolid from './svg/BoldSolid';
import CodeSolid from './svg/CodeSolid';
import ColumnsSolid from './svg/ColumnsSolid';
import ExpandArrowsAltSolid from './svg/ExpandArrowsAltSolid';
import GlassesSolid from './svg/GlassesSolid';
import HeadingSolid from './svg/HeadingSolid';
import ImageRegular from './svg/ImageRegular';
import ItalicSolid from './svg/ItalicSolid';
import LinkSolid from './svg/LinkSolid';
import ListOlSolid from './svg/ListOlSolid';
import ListUlSolid from './svg/ListUlSolid';
import QuoteLeftSolid from './svg/QuoteLeftSolid';
import RedoSolid from './svg/RedoSolid';
import StrikethroughSolid from './svg/StrikethroughSolid';
import TableSolid from './svg/TableSolid';
import UndoSolid from './svg/UndoSolid';

export function wordCount(data) {
  var pattern = /[a-zA-Z0-9_\u0392-\u03c9\u0410-\u04F9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g;
  var m = data.match(pattern);
  var count = 0;
  if (m === null) return count;
  for (var i = 0; i < m.length; i++) {
    if (m[i].charCodeAt(0) >= 0x4e00) {
      count += m[i].length;
    } else {
      count += 1;
    }
  }
  return count;
}

export function isMobile() {
  var check = false;
  (function(a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor);
  return check;
}

export function fixShortcut(name) {
  const isMac = /Mac/.test(navigator.platform);
  if (isMac) {
    name = name.replace('Ctrl', 'Cmd');
  } else {
    name = name.replace('Cmd', 'Ctrl');
  }
  return name;
}

export function getState(cm, pos?) {
  pos = pos || cm.getCursor('start');
  var stat = cm.getTokenAt(pos);
  if (!stat.type) return {};

  var types = stat.type.split(' ');

  var ret: any = {},
    data,
    text;

  for (var i = 0; i < types.length; i++) {
    data = types[i];
    if (data === 'strong') {
      ret.bold = true;
    } else if (data === 'variable-2') {
      text = cm.getLine(pos.line);
      if (/^\s*\d+\.\s/.test(text)) {
        ret['ordered-list'] = true;
      } else {
        ret['unordered-list'] = true;
      }
    } else if (data === 'atom') {
      ret.quote = true;
    } else if (data === 'em') {
      ret.italic = true;
    } else if (data === 'quote') {
      ret.quote = true;
    } else if (data === 'strikethrough') {
      ret.strikethrough = true;
    } else if (data === 'comment') {
      ret.code = true;
    } else if (data === 'link') {
      ret.link = true;
    } else if (data === 'tag') {
      ret.image = true;
    } else if (data.match(/^header(\-[1-6])?$/)) {
      ret[data.replace('header', 'heading')] = true;
    }
  }
  return ret;
}

function _toggleBlock(editor, type, start_chars, end_chars?) {
  if (
    /editor-preview-active/.test(editor.getWrapperElement().lastChild.className)
  )
    return;

  end_chars = typeof end_chars === 'undefined' ? start_chars : end_chars;
  var cm = editor;
  var stat = getState(cm);

  var text;
  var start = start_chars;
  var end = end_chars;

  var startPoint = cm.getCursor('start');
  var endPoint = cm.getCursor('end');

  if (stat[type]) {
    text = cm.getLine(startPoint.line);
    start = text.slice(0, startPoint.ch);
    end = text.slice(startPoint.ch);
    if (type == 'bold') {
      start = start.replace(/(\*\*|__)(?![\s\S]*(\*\*|__))/, '');
      end = end.replace(/(\*\*|__)/, '');
    } else if (type == 'italic') {
      start = start.replace(/(\*|_)(?![\s\S]*(\*|_))/, '');
      end = end.replace(/(\*|_)/, '');
    } else if (type == 'strikethrough') {
      start = start.replace(/(\*\*|~~)(?![\s\S]*(\*\*|~~))/, '');
      end = end.replace(/(\*\*|~~)/, '');
    }
    cm.replaceRange(
      start + end,
      {
        line: startPoint.line,
        ch: 0,
      },
      {
        line: startPoint.line,
        ch: 99999999999999,
      }
    );

    if (type == 'bold' || type == 'strikethrough') {
      startPoint.ch -= 2;
      if (startPoint !== endPoint) {
        endPoint.ch -= 2;
      }
    } else if (type == 'italic') {
      startPoint.ch -= 1;
      if (startPoint !== endPoint) {
        endPoint.ch -= 1;
      }
    }
  } else {
    text = cm.getSelection();
    if (type == 'bold') {
      text = text.split('**').join('');
      text = text.split('__').join('');
    } else if (type == 'italic') {
      text = text.split('*').join('');
      text = text.split('_').join('');
    } else if (type == 'strikethrough') {
      text = text.split('~~').join('');
    }
    cm.replaceSelection(start + text + end);

    startPoint.ch += start_chars.length;
    endPoint.ch = startPoint.ch + text.length;
  }

  cm.setSelection(startPoint, endPoint);
  cm.focus();
}

function _cleanBlock(cm) {
  if (/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
    return;

  var startPoint = cm.getCursor('start');
  var endPoint = cm.getCursor('end');
  var text;

  for (var line = startPoint.line; line <= endPoint.line; line++) {
    text = cm.getLine(line);
    text = text.replace(/^[ ]*([# ]+|\*|\-|[> ]+|[0-9]+(.|\)))[ ]*/, '');

    cm.replaceRange(
      text,
      {
        line: line,
        ch: 0,
      },
      {
        line: line,
        ch: 99999999999999,
      }
    );
  }
}

function _replaceSelection(cm, active, startEnd, url?) {
  if (/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
    return;

  var text;
  var start = startEnd[0];
  var end = startEnd[1];
  var startPoint = cm.getCursor('start');
  var endPoint = cm.getCursor('end');
  if (url) {
    end = end.replace('#url#', url);
  }
  if (active) {
    text = cm.getLine(startPoint.line);
    start = text.slice(0, startPoint.ch);
    end = text.slice(startPoint.ch);
    cm.replaceRange(start + end, {
      line: startPoint.line,
      ch: 0,
    });
  } else {
    text = cm.getSelection();
    cm.replaceSelection(start + text + end);

    startPoint.ch += start.length;
    if (startPoint !== endPoint) {
      endPoint.ch += start.length;
    }
  }
  cm.setSelection(startPoint, endPoint);
  cm.focus();
}

function _toggleHeading(cm, direction, size?) {
  if (/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
    return;

  var startPoint = cm.getCursor('start');
  var endPoint = cm.getCursor('end');
  for (var i = startPoint.line; i <= endPoint.line; i++) {
    (function(i) {
      var text = cm.getLine(i);
      var currHeadingLevel = text.search(/[^#]/);

      if (direction !== undefined) {
        if (currHeadingLevel <= 0) {
          if (direction == 'bigger') {
            text = '###### ' + text;
          } else {
            text = '# ' + text;
          }
        } else if (currHeadingLevel == 6 && direction == 'smaller') {
          text = text.substr(7);
        } else if (currHeadingLevel == 1 && direction == 'bigger') {
          text = text.substr(2);
        } else {
          if (direction == 'bigger') {
            text = text.substr(1);
          } else {
            text = '#' + text;
          }
        }
      } else {
        if (size == 1) {
          if (currHeadingLevel <= 0) {
            text = '# ' + text;
          } else if (currHeadingLevel == size) {
            text = text.substr(currHeadingLevel + 1);
          } else {
            text = '# ' + text.substr(currHeadingLevel + 1);
          }
        } else if (size == 2) {
          if (currHeadingLevel <= 0) {
            text = '## ' + text;
          } else if (currHeadingLevel == size) {
            text = text.substr(currHeadingLevel + 1);
          } else {
            text = '## ' + text.substr(currHeadingLevel + 1);
          }
        } else {
          if (currHeadingLevel <= 0) {
            text = '### ' + text;
          } else if (currHeadingLevel == size) {
            text = text.substr(currHeadingLevel + 1);
          } else {
            text = '### ' + text.substr(currHeadingLevel + 1);
          }
        }
      }

      cm.replaceRange(
        text,
        {
          line: i,
          ch: 0,
        },
        {
          line: i,
          ch: 99999999999999,
        }
      );
    })(i);
  }
  cm.focus();
}

function _toggleLine(cm, name) {
  if (/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
    return;

  var stat = getState(cm);
  var startPoint = cm.getCursor('start');
  var endPoint = cm.getCursor('end');
  var repl = {
    quote: /^(\s*)\>\s+/,
    'unordered-list': /^(\s*)(\*|\-|\+)\s+/,
    'ordered-list': /^(\s*)\d+\.\s+/,
  };
  var map = {
    quote: '> ',
    'unordered-list': '* ',
    'ordered-list': '1. ',
  };
  for (var i = startPoint.line; i <= endPoint.line; i++) {
    (function(i) {
      var text = cm.getLine(i);
      if (stat[name]) {
        text = text.replace(repl[name], '$1');
      } else {
        text = map[name] + text;
      }
      cm.replaceRange(
        text,
        {
          line: i,
          ch: 0,
        },
        {
          line: i,
          ch: 99999999999999,
        }
      );
    })(i);
  }
  cm.focus();
}

export function toggleBold(editor) {
  _toggleBlock(editor, 'bold', blockStyles.bold);
}

export function toggleItalic(editor) {
  _toggleBlock(editor, 'italic', blockStyles.italic);
}

export function toggleStrikethrough(editor) {
  _toggleBlock(editor, 'strikethrough', '~~');
}

function toggleCodeBlock(editor) {
  var fenceCharsToInsert = blockStyles.code;

  function fencing_line(line) {
    /* return true, if this is a ``` or ~~~ line */
    if (typeof line !== 'object') {
      throw "fencing_line() takes a 'line' object (not a line number, or line text).  Got: " +
        typeof line +
        ': ' +
        line;
    }
    return (
      line.styles &&
      line.styles[2] &&
      line.styles[2].indexOf('formatting-code-block') !== -1
    );
  }

  function token_state(token) {
    // base goes an extra level deep when mode backdrops are used, e.g. spellchecker on
    return token.state.base.base || token.state.base;
  }

  function code_type(cm, line_num, line?, firstTok?, lastTok?) {
    /*
     * Return "single", "indented", "fenced" or false
     *
     * cm and line_num are required.  Others are optional for efficiency
     *   To check in the middle of a line, pass in firstTok yourself.
     */
    line = line || cm.getLineHandle(line_num);
    firstTok =
      firstTok ||
      cm.getTokenAt({
        line: line_num,
        ch: 1,
      });
    lastTok =
      lastTok ||
      (!!line.text &&
        cm.getTokenAt({
          line: line_num,
          ch: line.text.length - 1,
        }));
    var types = firstTok.type ? firstTok.type.split(' ') : [];
    if (lastTok && token_state(lastTok).indentedCode) {
      // have to check last char, since first chars of first line aren"t marked as indented
      return 'indented';
    } else if (types.indexOf('comment') === -1) {
      // has to be after "indented" check, since first chars of first indented line aren"t marked as such
      return false;
    } else if (
      token_state(firstTok).fencedChars ||
      token_state(lastTok).fencedChars ||
      fencing_line(line)
    ) {
      return 'fenced';
    } else {
      return 'single';
    }
  }

  function insertFencingAtSelection(
    cm,
    cur_start,
    cur_end,
    fenceCharsToInsert
  ) {
    var start_line_sel = cur_start.line + 1,
      end_line_sel = cur_end.line + 1,
      sel_multi = cur_start.line !== cur_end.line,
      repl_start = fenceCharsToInsert + '\n',
      repl_end = '\n' + fenceCharsToInsert;
    if (sel_multi) {
      end_line_sel++;
    }
    // handle last char including \n or not
    if (sel_multi && cur_end.ch === 0) {
      repl_end = fenceCharsToInsert + '\n';
      end_line_sel--;
    }
    _replaceSelection(cm, false, [repl_start, repl_end]);
    cm.setSelection(
      {
        line: start_line_sel,
        ch: 0,
      },
      {
        line: end_line_sel,
        ch: 0,
      }
    );
  }

  var cm = editor,
    cur_start = cm.getCursor('start'),
    cur_end = cm.getCursor('end'),
    tok = cm.getTokenAt({
      line: cur_start.line,
      ch: cur_start.ch || 1,
    }), // avoid ch 0 which is a cursor pos but not token
    line = cm.getLineHandle(cur_start.line),
    is_code = code_type(cm, cur_start.line, line, tok);
  var block_start, block_end, lineCount;

  if (is_code === 'single') {
    // similar to some SimpleMDE _toggleBlock logic
    var start = line.text.slice(0, cur_start.ch).replace('`', ''),
      end = line.text.slice(cur_start.ch).replace('`', '');
    cm.replaceRange(
      start + end,
      {
        line: cur_start.line,
        ch: 0,
      },
      {
        line: cur_start.line,
        ch: 99999999999999,
      }
    );
    cur_start.ch--;
    if (cur_start !== cur_end) {
      cur_end.ch--;
    }
    cm.setSelection(cur_start, cur_end);
    cm.focus();
  } else if (is_code === 'fenced') {
    if (cur_start.line !== cur_end.line || cur_start.ch !== cur_end.ch) {
      // use selection

      // find the fenced line so we know what type it is (tilde, backticks, number of them)
      for (block_start = cur_start.line; block_start >= 0; block_start--) {
        line = cm.getLineHandle(block_start);
        if (fencing_line(line)) {
          break;
        }
      }
      var fencedTok = cm.getTokenAt({
        line: block_start,
        ch: 1,
      });
      var fence_chars = token_state(fencedTok).fencedChars;
      var start_text, start_line;
      var end_text, end_line;
      // check for selection going up against fenced lines, in which case we don't want to add more fencing
      if (fencing_line(cm.getLineHandle(cur_start.line))) {
        start_text = '';
        start_line = cur_start.line;
      } else if (fencing_line(cm.getLineHandle(cur_start.line - 1))) {
        start_text = '';
        start_line = cur_start.line - 1;
      } else {
        start_text = fence_chars + '\n';
        start_line = cur_start.line;
      }
      if (fencing_line(cm.getLineHandle(cur_end.line))) {
        end_text = '';
        end_line = cur_end.line;
        if (cur_end.ch === 0) {
          end_line += 1;
        }
      } else if (
        cur_end.ch !== 0 &&
        fencing_line(cm.getLineHandle(cur_end.line + 1))
      ) {
        end_text = '';
        end_line = cur_end.line + 1;
      } else {
        end_text = fence_chars + '\n';
        end_line = cur_end.line + 1;
      }
      if (cur_end.ch === 0) {
        // full last line selected, putting cursor at beginning of next
        end_line -= 1;
      }
      cm.operation(function() {
        // end line first, so that line numbers don't change
        cm.replaceRange(
          end_text,
          {
            line: end_line,
            ch: 0,
          },
          {
            line: end_line + (end_text ? 0 : 1),
            ch: 0,
          }
        );
        cm.replaceRange(
          start_text,
          {
            line: start_line,
            ch: 0,
          },
          {
            line: start_line + (start_text ? 0 : 1),
            ch: 0,
          }
        );
      });
      cm.setSelection(
        {
          line: start_line + (start_text ? 1 : 0),
          ch: 0,
        },
        {
          line: end_line + (start_text ? 1 : -1),
          ch: 0,
        }
      );
      cm.focus();
    } else {
      // no selection, search for ends of this fenced block
      var search_from = cur_start.line;
      if (fencing_line(cm.getLineHandle(cur_start.line))) {
        // gets a little tricky if cursor is right on a fenced line
        if (code_type(cm, cur_start.line + 1) === 'fenced') {
          block_start = cur_start.line;
          search_from = cur_start.line + 1; // for searching for "end"
        } else {
          block_end = cur_start.line;
          search_from = cur_start.line - 1; // for searching for "start"
        }
      }
      if (block_start === undefined) {
        for (block_start = search_from; block_start >= 0; block_start--) {
          line = cm.getLineHandle(block_start);
          if (fencing_line(line)) {
            break;
          }
        }
      }
      if (block_end === undefined) {
        lineCount = cm.lineCount();
        for (block_end = search_from; block_end < lineCount; block_end++) {
          line = cm.getLineHandle(block_end);
          if (fencing_line(line)) {
            break;
          }
        }
      }
      cm.operation(function() {
        cm.replaceRange(
          '',
          {
            line: block_start,
            ch: 0,
          },
          {
            line: block_start + 1,
            ch: 0,
          }
        );
        cm.replaceRange(
          '',
          {
            line: block_end - 1,
            ch: 0,
          },
          {
            line: block_end,
            ch: 0,
          }
        );
      });
      cm.focus();
    }
  } else if (is_code === 'indented') {
    if (cur_start.line !== cur_end.line || cur_start.ch !== cur_end.ch) {
      // use selection
      block_start = cur_start.line;
      block_end = cur_end.line;
      if (cur_end.ch === 0) {
        block_end--;
      }
    } else {
      // no selection, search for ends of this indented block
      for (block_start = cur_start.line; block_start >= 0; block_start--) {
        line = cm.getLineHandle(block_start);
        if (line.text.match(/^\s*$/)) {
          // empty or all whitespace - keep going
          continue;
        } else {
          if (code_type(cm, block_start, line) !== 'indented') {
            block_start += 1;
            break;
          }
        }
      }
      lineCount = cm.lineCount();
      for (block_end = cur_start.line; block_end < lineCount; block_end++) {
        line = cm.getLineHandle(block_end);
        if (line.text.match(/^\s*$/)) {
          // empty or all whitespace - keep going
          continue;
        } else {
          if (code_type(cm, block_end, line) !== 'indented') {
            block_end -= 1;
            break;
          }
        }
      }
    }
    // if we are going to un-indent based on a selected set of lines, and the next line is indented too, we need to
    // insert a blank line so that the next line(s) continue to be indented code
    var next_line = cm.getLineHandle(block_end + 1),
      next_line_last_tok =
        next_line &&
        cm.getTokenAt({
          line: block_end + 1,
          ch: next_line.text.length - 1,
        }),
      next_line_indented =
        next_line_last_tok && token_state(next_line_last_tok).indentedCode;
    if (next_line_indented) {
      cm.replaceRange('\n', {
        line: block_end + 1,
        ch: 0,
      });
    }

    for (var i = block_start; i <= block_end; i++) {
      cm.indentLine(i, 'subtract'); // TODO: this doesn't get tracked in the history, so can't be undone :(
    }
    cm.focus();
  } else {
    // insert code formatting
    var no_sel_and_starting_of_line =
      cur_start.line === cur_end.line &&
      cur_start.ch === cur_end.ch &&
      cur_start.ch === 0;
    var sel_multi = cur_start.line !== cur_end.line;
    if (no_sel_and_starting_of_line || sel_multi) {
      insertFencingAtSelection(cm, cur_start, cur_end, fenceCharsToInsert);
    } else {
      _replaceSelection(cm, false, ['`', '`']);
    }
  }
}

export function toggleBlockquote(editor) {
  var cm = editor;
  _toggleLine(cm, 'quote');
}

export function toggleHeadingSmaller(editor) {
  var cm = editor;
  _toggleHeading(cm, 'smaller');
}

export function toggleHeadingBigger(editor) {
  var cm = editor;
  _toggleHeading(cm, 'bigger');
}

export function toggleHeading1(editor) {
  var cm = editor;
  _toggleHeading(cm, undefined, 1);
}

export function toggleHeading2(editor) {
  var cm = editor;
  _toggleHeading(cm, undefined, 2);
}

export function toggleHeading3(editor) {
  var cm = editor;
  _toggleHeading(cm, undefined, 3);
}

export function toggleUnorderedList(editor) {
  var cm = editor;
  _toggleLine(cm, 'unordered-list');
}

export function toggleOrderedList(editor) {
  var cm = editor;
  _toggleLine(cm, 'ordered-list');
}

export function cleanBlock(editor) {
  var cm = editor;
  _cleanBlock(cm);
}

export function drawLink(editor) {
  var cm = editor;
  var stat = getState(cm);
  var url = 'http://';

  _replaceSelection(cm, stat.link, insertTexts.link, url);
}

export function drawImage(editor) {
  var cm = editor;
  var stat = getState(cm);
  var url = 'http://';
  _replaceSelection(cm, stat.image, insertTexts.image, url);
}

export function drawTable(editor) {
  var cm = editor;
  var stat = getState(cm);

  _replaceSelection(cm, stat.table, insertTexts.table);
}

export function drawHorizontalRule(editor) {
  var cm = editor;
  var stat = getState(cm);

  _replaceSelection(cm, stat.image, insertTexts.horizontalRule);
}

export function undo(editor) {
  var cm = editor;
  cm.undo();
  cm.focus();
}

export function redo(editor) {
  var cm = editor;
  cm.redo();
  cm.focus();
}

export function togglePreview(editor) {
  alert('Pending');
}

export const toolbarBuiltInButtons = {
  bold: {
    name: 'bold',
    action: toggleBold,
    icon: BoldSolid,
    title: 'Bold',
    default: true,
    shortcut: 'Cmd-B',
  },
  italic: {
    name: 'italic',
    action: toggleItalic,
    icon: ItalicSolid,
    title: 'Italic',
    default: true,
    shortcut: 'Cmd-I',
  },
  strikethrough: {
    name: 'strikethrough',
    action: toggleStrikethrough,
    icon: StrikethroughSolid,
    title: 'Strikethrough',
    shortcut: 'Cmd--',
  },
  heading: {
    name: 'heading',
    action: toggleHeadingSmaller,
    icon: HeadingSolid,
    title: 'Heading',
    default: true,
    shortcut: 'Cmd-H',
  },
  'heading-smaller': {
    name: 'heading-smaller',
    action: toggleHeadingSmaller,
    title: 'Smaller Heading',
  },
  'heading-bigger': {
    name: 'heading-bigger',
    action: toggleHeadingBigger,
    title: 'Bigger Heading',
  },
  'heading-1': {
    name: 'heading-1',
    action: toggleHeading1,
    title: 'Big Heading',
  },
  'heading-2': {
    name: 'heading-2',
    action: toggleHeading2,
    title: 'Medium Heading',
  },
  'heading-3': {
    name: 'heading-3',
    action: toggleHeading3,
    title: 'Small Heading',
  },
  'separator-1': {
    name: 'separator-1',
  },
  code: {
    name: 'code',
    action: toggleCodeBlock,
    icon: CodeSolid,
    title: 'Code',
    shortcut: 'Cmd-`',
  },
  quote: {
    name: 'quote',
    action: toggleBlockquote,
    icon: QuoteLeftSolid,
    title: 'Quote',
    default: true,
    shortcut: 'Cmd->',
  },
  'unordered-list': {
    name: 'unordered-list',
    action: toggleUnorderedList,
    icon: ListUlSolid,
    title: 'Generic List',
    default: true,
    shortcut: 'Cmd-L',
  },
  'ordered-list': {
    name: 'ordered-list',
    action: toggleOrderedList,
    icon: ListOlSolid,
    title: 'Numbered List',
    default: true,
    shortcut: 'Cmd-Alt-L',
  },
  'clean-block': {
    name: 'clean-block',
    action: cleanBlock,
    title: 'Clean block',
  },
  'separator-2': {
    name: 'separator-2',
  },
  link: {
    name: 'link',
    action: drawLink,
    icon: LinkSolid,
    title: 'Create Link',
    default: true,
    shortcut: 'Cmd-K',
  },
  image: {
    name: 'image',
    action: drawImage,
    icon: ImageRegular,
    title: 'Insert Image',
    default: true,
    shortcut: 'Cmd-Alt-I',
  },
  table: {
    name: 'table',
    action: drawTable,
    icon: TableSolid,
    title: 'Insert Table',
  },
  'horizontal-rule': {
    name: 'horizontal-rule',
    action: drawHorizontalRule,
    title: 'Insert Horizontal Line',
  },
  'separator-3': {
    name: 'separator-3',
  },
  preview: {
    name: 'preview',
    action: null,
    icon: GlassesSolid,
    title: 'Toggle Preview',
    default: true,
    shortcut: 'Cmd-P',
  },
  'side-by-side': {
    name: 'side-by-side',
    action: null,
    icon: ColumnsSolid,
    title: 'Toggle Side by Side',
    default: true,
    shortcut: 'F9',
  },
  fullscreen: {
    name: 'fullscreen',
    action: null,
    icon: ExpandArrowsAltSolid,
    title: 'Toggle Fullscreen',
    default: true,
    shortcut: 'F11',
  },
  'separator-4': {
    name: 'separator-4',
  },
  'separator-5': {
    name: 'separator-5',
  },
  undo: {
    name: 'undo',
    action: undo,
    icon: UndoSolid,
    title: 'Undo',
  },
  redo: {
    name: 'redo',
    action: redo,
    icon: RedoSolid,
    title: 'Redo',
  },
};

export const insertTexts = {
  link: ['[', '](#url#)'],
  image: ['![](', '#url#)'],
  table: [
    '',
    '\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text     | Text     |\n\n',
  ],
  horizontalRule: ['', '\n\n-----\n\n'],
};

export const promptTexts = {
  link: 'URL for the link:',
  image: 'URL of the image:',
};

export const blockStyles = {
  bold: '**',
  code: '```',
  italic: '*',
};
