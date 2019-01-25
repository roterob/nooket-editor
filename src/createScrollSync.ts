import * as debounce from 'lodash.debounce';

function removeLineInfo(container) {
  container
    .querySelectorAll('.editor-line-debug')
    .forEach(e => container.removeChild(e));
}

function showLineInfo(container, lineNumber, offset) {
  const box = document.createElement('div');
  box.className = 'editor-line-debug';
  box.style.position = 'absolute';
  box.style.top = `${offset}px`;
  box.style.left = '0';
  box.style.width = '100%';
  box.style.textAlign = 'right';
  box.style.borderTopWidth = '1px';
  box.style.borderTopColor = 'red';
  box.style.borderTopStyle = 'solid';
  box.style.color = 'red';
  box.innerText = lineNumber;

  container.appendChild(box);
}

function buildScrollMap(
  container: HTMLElement,
  selector: string,
  useDataLineAttr: boolean,
  linesToTrack?: number[]
): any {
  const res = {};

  const lines = container.querySelectorAll(selector);

  res[-1] = { line: -1, offset: 0.0 };
  res[Number.MAX_SAFE_INTEGER] = {
    line: lines.length,
    offset: container.scrollHeight,
  };

  //removeLineInfo(container.querySelector('.CodeMirror-code') || container);

  const scrollTop = container.scrollTop;
  lines.forEach((l, i) => {
    const lineNumber = useDataLineAttr
      ? parseInt(l.getAttribute('data-line'), 10)
      : i;
    if (!linesToTrack || linesToTrack.indexOf(lineNumber) >= 0) {
      const rect = l.getBoundingClientRect();
      res[lineNumber] = {
        line: lineNumber,
        offset: scrollTop + rect.top - 25, // 25 es un factor de corrección
      };

      //showLineInfo(l.parentElement, lineNumber, res[lineNumber].offset);
    }
  });

  return res;
}

function calculateScrollTop(fromScrollMap, toScrollMap, offset) {
  const linesTracked = Object.keys(fromScrollMap)
    .map(l => parseInt(l, 10))
    .sort((a, b) => a - b);
  let lineInf = null,
    lineSup = null;
  let i = 0;

  while (i < linesTracked.length) {
    const line = fromScrollMap[linesTracked[i]];
    if (line.offset > offset) {
      lineSup = line;
      break;
    }

    lineInf = line;
    i++;
  }

  const lineInfTo = toScrollMap[lineInf.line];
  const lineSupTo = toScrollMap[lineSup.line];

  const ratio =
    (lineSupTo.offset - lineInfTo.offset) / (lineSup.offset - lineInf.offset);
  const offSetFromLineInf = offset - lineInf.offset;

  return lineInfTo.offset + offSetFromLineInf * ratio;
}

export default function createScrollSync(
  source: HTMLElement,
  preview: HTMLElement
) {
  let isActive = false;
  let srcScroll = false,
    prvScroll = false;
  let prvScrollMap = null,
    srcScrollMap = null;
  let lastUpdate = null;

  const buildScrollMappings = function() {
    prvScrollMap = buildScrollMap(preview, '.line', true);
    srcScrollMap = buildScrollMap(
      source,
      '.CodeMirror-line',
      false,
      Object.keys(prvScrollMap).map(l => parseInt(l, 10))
    );
  };

  const buildScrollMappingsDebounced = debounce(buildScrollMappings, 1000);

  const updatePreviewScroll = debounce(
    function() {
      if (srcScroll) {
        srcScroll = false;
        return;
      }
      prvScroll = true;
      preview.scrollTop = calculateScrollTop(
        srcScrollMap,
        prvScrollMap,
        source.scrollTop
      );
    },
    50,
    { maxWait: 100 }
  );

  const updateSourceScroll = debounce(
    function() {
      if (prvScroll) {
        prvScroll = false;
        return;
      }
      srcScroll = true;
      source.scrollTop = calculateScrollTop(
        prvScrollMap,
        srcScrollMap,
        preview.scrollTop
      );
    },
    50,
    { maxWait: 100 }
  );

  const on = function(timestamp) {
    if (!isActive) {
      buildScrollMappings();
      source.addEventListener('scroll', updatePreviewScroll);
      preview.addEventListener('scroll', updateSourceScroll);
      isActive = true;
      lastUpdate = timestamp;
    } else if (lastUpdate !== timestamp) {
      lastUpdate = timestamp;
      buildScrollMappingsDebounced();
    }
  };
  const off = function() {
    if (isActive) {
      source.removeEventListener('scroll', updatePreviewScroll);
      preview.removeEventListener('scroll', updateSourceScroll);
      isActive = false;
    }
  };

  return {
    on,
    off,
    isActive: function() {
      return isActive;
    },
  };
}
