import { inDoc } from './util'

let overlay;
let doc = document;
let isFixed = false;
let overlayColor = 'rgba(104, 182, 255, 0.35)';
let clickOverlayCallback = null;
let resizeTimer = -1;

export function setHighlightColor(color) {
  overlayColor = color
}

export function setDoc(d) {
  doc = d; 
}


export function isFixedNode() {
  return isFixed
}

export function unFixedNode() {
  isFixed = false
}

/**
 * Highlight an instance.
 *
 * @param {Vue} instance
 */

export function highlight (instance, callback) {
  if (!instance) return
  function _showOverlay() {
    const rect = getInstanceRect(instance)
    if (rect) {
      showOverlay(rect)
    }
  }
  function resizeOverlay() {
    _showOverlay();
    resizeTimer = setTimeout(resizeOverlay, 100);
  }
  clickOverlayCallback = callback
  _showOverlay()
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(resizeOverlay, 100);
}

/**
 * Remove highlight overlay.
 */

export function unHighlight () {
  clickOverlayCallback = null
  clearTimeout(resizeTimer)
  if (overlay && overlay.parentNode) {
    doc.body.removeChild(overlay)
  }
  overlay = null;
}

/**
 * Get the client rect for an instance.
 *
 * @param {Vue} instance
 * @return {Object}
 */

export function getInstanceRect (instance) {
  if (!inDoc(instance.$el)) {
    return
  }
  if (instance._isFragment) {
    return getFragmentRect(instance)
  } else if (instance.$el.nodeType === 1) {
    return instance.$el.getBoundingClientRect()
  }
}

/**
 * Highlight a fragment instance.
 * Loop over its node range and determine its bounding box.
 *
 * @param {Vue} instance
 * @return {Object}
 */

function getFragmentRect ({ _fragmentStart, _fragmentEnd }) {
  let top, bottom, left, right
  util().mapNodeRange(_fragmentStart, _fragmentEnd, function (node) {
    let rect
    if (node.nodeType === 1 || node.getBoundingClientRect) {
      rect = node.getBoundingClientRect()
    } else if (node.nodeType === 3 && node.data.trim()) {
      rect = getTextRect(node)
    }
    if (rect) {
      if (!top || rect.top < top) {
        top = rect.top
      }
      if (!bottom || rect.bottom > bottom) {
        bottom = rect.bottom
      }
      if (!left || rect.left < left) {
        left = rect.left
      }
      if (!right || rect.right > right) {
        right = rect.right
      }
    }
  })
  return {
    top,
    left,
    width: right - left,
    height: bottom - top
  }
}

/**
 * Get the bounding rect for a text node using a Range.
 *
 * @param {Text} node
 * @return {Rect}
 */

const range = doc.createRange()
function getTextRect (node) {
  range.selectNode(node)
  return range.getBoundingClientRect()
}

/**
 * Display the overlay with given rect.
 *
 * @param {Rect}
 */

function showOverlay ({ width = 0, height = 0, top = 0, left = 0 }) {
  try {
    if(overlay) {
      overlay.style.backgroundColor = overlayColor
    } else {
      overlay = doc.createElement('div')
      overlay.style.backgroundColor = overlayColor
      overlay.style.position = 'fixed'
      overlay.style.zIndex = '99999'
      /*overlay.style.pointerEvents = 'none'*/
      overlay.onclick = function(event) {
        event.stopPropagation()
        isFixed = !isFixed
        clickOverlayCallback && clickOverlayCallback()
      }
    }
  } catch(err) {}
  overlay.style.width = ~~width + 'px'
  overlay.style.height = ~~height + 'px'
  overlay.style.top = ~~top + 'px'
  overlay.style.left = ~~left + 'px'
  if(!inDoc(overlay)) {
    doc.body.appendChild(overlay)
  }
}

/**
 * Get Vue's util
 */

function util () {
  return window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue.util
}
