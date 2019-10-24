"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

document.addEventListener('DOMContentLoaded', function () {
  //* [ie 11] img object fit * Polyfill
  var objectFitItem = 'img.object-fit-img';
  objectFitImages(objectFitItem); //* [ie 11] position:sticky * Polyfill
  // const mqlW = window.matchMedia('screen and (max-width: 991px)');
  // const mqlH = window.matchMedia('screen and (max-height: 710px)');
  // const subpage = document.getElementById('subpageSide');
  // if (subpage !== null && window.innerWidth > 767) {
  //   sidebarToggle();
  //   mqlW.addListener(sidebarToggle);
  //   mqlH.addListener(sidebarToggle);
  // }
  // function sidebarToggle() {
  //   if (mqlW.matches || mqlH.matches) {
  //     Stickyfill.remove(subpage);
  //     subpage.style.position = 'static';
  //     subpage.style.top = 0;
  //   } else {
  //     Stickyfill.add(subpage);
  //     subpage.style.position = '';
  //     subpage.style.top = '';
  //   }
  // }
}, false);
/*! npm.im/object-fit-images 3.2.4 */

var objectFitImages = function () {
  var OFI = 'bfred-it:object-fit-images';
  var propRegex = /(object-fit|object-position)\s*:\s*([-.\w\s%]+)/g;
  var testImg = typeof Image === 'undefined' ? {
    style: {
      'object-position': 1
    }
  } : new Image();
  var supportsObjectFit = 'object-fit' in testImg.style;
  var supportsObjectPosition = 'object-position' in testImg.style;
  var supportsOFI = 'background-size' in testImg.style;
  var supportsCurrentSrc = typeof testImg.currentSrc === 'string';
  var nativeGetAttribute = testImg.getAttribute;
  var nativeSetAttribute = testImg.setAttribute;
  var autoModeEnabled = false;

  function createPlaceholder(w, h) {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='" + w + "' height='" + h + "'%3E%3C/svg%3E";
  }

  function polyfillCurrentSrc(el) {
    if (el.srcset && !supportsCurrentSrc && window.picturefill) {
      var pf = window.picturefill._; // parse srcset with picturefill where currentSrc isn't available

      if (!el[pf.ns] || !el[pf.ns].evaled) {
        // force synchronous srcset parsing
        pf.fillImg(el, {
          reselect: true
        });
      }

      if (!el[pf.ns].curSrc) {
        // force picturefill to parse srcset
        el[pf.ns].supported = false;
        pf.fillImg(el, {
          reselect: true
        });
      } // retrieve parsed currentSrc, if any


      el.currentSrc = el[pf.ns].curSrc || el.src;
    }
  }

  function getStyle(el) {
    var style = getComputedStyle(el).fontFamily;
    var parsed;
    var props = {};

    while ((parsed = propRegex.exec(style)) !== null) {
      props[parsed[1]] = parsed[2];
    }

    return props;
  }

  function setPlaceholder(img, width, height) {
    // Default: fill width, no height
    var placeholder = createPlaceholder(width || 1, height || 0); // Only set placeholder if it's different

    if (nativeGetAttribute.call(img, 'src') !== placeholder) {
      nativeSetAttribute.call(img, 'src', placeholder);
    }
  }

  function onImageReady(img, callback) {
    // naturalWidth is only available when the image headers are loaded,
    // this loop will poll it every 100ms.
    if (img.naturalWidth) {
      callback(img);
    } else {
      setTimeout(onImageReady, 100, img, callback);
    }
  }

  function fixOne(el) {
    var style = getStyle(el);
    var ofi = el[OFI];
    style['object-fit'] = style['object-fit'] || 'fill'; // default value
    // Avoid running where unnecessary, unless OFI had already done its deed

    if (!ofi.img) {
      // fill is the default behavior so no action is necessary
      if (style['object-fit'] === 'fill') {
        return;
      } // Where object-fit is supported and object-position isn't (Safari < 10)


      if (!ofi.skipTest && // unless user wants to apply regardless of browser support
      supportsObjectFit && // if browser already supports object-fit
      !style['object-position'] // unless object-position is used
      ) {
          return;
        }
    } // keep a clone in memory while resetting the original to a blank


    if (!ofi.img) {
      ofi.img = new Image(el.width, el.height);
      ofi.img.srcset = nativeGetAttribute.call(el, "data-ofi-srcset") || el.srcset;
      ofi.img.src = nativeGetAttribute.call(el, "data-ofi-src") || el.src; // preserve for any future cloneNode calls
      // https://github.com/bfred-it/object-fit-images/issues/53

      nativeSetAttribute.call(el, "data-ofi-src", el.src);

      if (el.srcset) {
        nativeSetAttribute.call(el, "data-ofi-srcset", el.srcset);
      }

      setPlaceholder(el, el.naturalWidth || el.width, el.naturalHeight || el.height); // remove srcset because it overrides src

      if (el.srcset) {
        el.srcset = '';
      }

      try {
        keepSrcUsable(el);
      } catch (err) {
        if (window.console) {
          console.warn('https://bit.ly/ofi-old-browser');
        }
      }
    }

    polyfillCurrentSrc(ofi.img);
    el.style.backgroundImage = "url(\"" + (ofi.img.currentSrc || ofi.img.src).replace(/"/g, '\\"') + "\")";
    el.style.backgroundPosition = style['object-position'] || 'center';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.backgroundOrigin = 'content-box';

    if (/scale-down/.test(style['object-fit'])) {
      onImageReady(ofi.img, function () {
        if (ofi.img.naturalWidth > el.width || ofi.img.naturalHeight > el.height) {
          el.style.backgroundSize = 'contain';
        } else {
          el.style.backgroundSize = 'auto';
        }
      });
    } else {
      el.style.backgroundSize = style['object-fit'].replace('none', 'auto').replace('fill', '100% 100%');
    }

    onImageReady(ofi.img, function (img) {
      setPlaceholder(el, img.naturalWidth, img.naturalHeight);
    });
  }

  function keepSrcUsable(el) {
    var descriptors = {
      get: function get(prop) {
        return el[OFI].img[prop ? prop : 'src'];
      },
      set: function set(value, prop) {
        el[OFI].img[prop ? prop : 'src'] = value;
        nativeSetAttribute.call(el, "data-ofi-" + prop, value); // preserve for any future cloneNode

        fixOne(el);
        return value;
      }
    };
    Object.defineProperty(el, 'src', descriptors);
    Object.defineProperty(el, 'currentSrc', {
      get: function get() {
        return descriptors.get('currentSrc');
      }
    });
    Object.defineProperty(el, 'srcset', {
      get: function get() {
        return descriptors.get('srcset');
      },
      set: function set(ss) {
        return descriptors.set(ss, 'srcset');
      }
    });
  }

  function hijackAttributes() {
    function getOfiImageMaybe(el, name) {
      return el[OFI] && el[OFI].img && (name === 'src' || name === 'srcset') ? el[OFI].img : el;
    }

    if (!supportsObjectPosition) {
      HTMLImageElement.prototype.getAttribute = function (name) {
        return nativeGetAttribute.call(getOfiImageMaybe(this, name), name);
      };

      HTMLImageElement.prototype.setAttribute = function (name, value) {
        return nativeSetAttribute.call(getOfiImageMaybe(this, name), name, String(value));
      };
    }
  }

  function fix(imgs, opts) {
    var startAutoMode = !autoModeEnabled && !imgs;
    opts = opts || {};
    imgs = imgs || 'img';

    if (supportsObjectPosition && !opts.skipTest || !supportsOFI) {
      return false;
    } // use imgs as a selector or just select all images


    if (imgs === 'img') {
      imgs = document.getElementsByTagName('img');
    } else if (typeof imgs === 'string') {
      imgs = document.querySelectorAll(imgs);
    } else if (!('length' in imgs)) {
      imgs = [imgs];
    } // apply fix to all


    for (var i = 0; i < imgs.length; i++) {
      imgs[i][OFI] = imgs[i][OFI] || {
        skipTest: opts.skipTest
      };
      fixOne(imgs[i]);
    }

    if (startAutoMode) {
      document.body.addEventListener('load', function (e) {
        if (e.target.tagName === 'IMG') {
          fix(e.target, {
            skipTest: opts.skipTest
          });
        }
      }, true);
      autoModeEnabled = true;
      imgs = 'img'; // reset to a generic selector for watchMQ
    } // if requested, watch media queries for object-fit change


    if (opts.watchMQ) {
      window.addEventListener('resize', fix.bind(null, imgs, {
        skipTest: opts.skipTest
      }));
    }
  }

  fix.supportsObjectFit = supportsObjectFit;
  fix.supportsObjectPosition = supportsObjectPosition;
  hijackAttributes();
  return fix;
}();
/*!
 * Stickyfill – `position: sticky` polyfill
 * v. 2.1.0 | https://github.com/wilddeer/stickyfill
 * MIT License
 */

/*
 * 1. Check if the browser supports `position: sticky` natively or is too old to run the polyfill.
 *    If either of these is the case set `seppuku` flag. It will be checked later to disable key features
 *    of the polyfill, but the API will remain functional to avoid breaking things.
 */


var seppuku = false;
var isWindowDefined = typeof window !== 'undefined'; // The polyfill can’t function properly without `window` or `window.getComputedStyle`.

if (!isWindowDefined || !window.getComputedStyle) seppuku = true; // Dont’t get in a way if the browser supports `position: sticky` natively.
else {
    var testNode = document.createElement('div');
    if (['', '-webkit-', '-moz-', '-ms-'].some(function (prefix) {
      try {
        testNode.style.position = prefix + 'sticky';
      } catch (e) {}

      return testNode.style.position != '';
    })) seppuku = true;
  }
/*
 * 2. “Global” vars used across the polyfill
 */

var isInitialized = false; // Check if Shadow Root constructor exists to make further checks simpler

var shadowRootExists = typeof ShadowRoot !== 'undefined'; // Last saved scroll position

var scroll = {
  top: null,
  left: null
}; // Array of created Sticky instances

var stickies = [];
/*
 * 3. Utility functions
 */

function extend(targetObj, sourceObject) {
  for (var key in sourceObject) {
    if (sourceObject.hasOwnProperty(key)) {
      targetObj[key] = sourceObject[key];
    }
  }
}

function parseNumeric(val) {
  return parseFloat(val) || 0;
}

function getDocOffsetTop(node) {
  var docOffsetTop = 0;

  while (node) {
    docOffsetTop += node.offsetTop;
    node = node.offsetParent;
  }

  return docOffsetTop;
}
/*
 * 4. Sticky class
 */


var Sticky =
/*#__PURE__*/
function () {
  function Sticky(node) {
    _classCallCheck(this, Sticky);

    if (!(node instanceof HTMLElement)) throw new Error('First argument must be HTMLElement');
    if (stickies.some(function (sticky) {
      return sticky._node === node;
    })) throw new Error('Stickyfill is already applied to this node');
    this._node = node;
    this._stickyMode = null;
    this._active = false;
    stickies.push(this);
    this.refresh();
  }

  _createClass(Sticky, [{
    key: "refresh",
    value: function refresh() {
      if (seppuku || this._removed) return;
      if (this._active) this._deactivate();
      var node = this._node;
      /*
       * 1. Save node computed props
       */

      var nodeComputedStyle = getComputedStyle(node);
      var nodeComputedProps = {
        position: nodeComputedStyle.position,
        top: nodeComputedStyle.top,
        display: nodeComputedStyle.display,
        marginTop: nodeComputedStyle.marginTop,
        marginBottom: nodeComputedStyle.marginBottom,
        marginLeft: nodeComputedStyle.marginLeft,
        marginRight: nodeComputedStyle.marginRight,
        cssFloat: nodeComputedStyle.cssFloat
      };
      /*
       * 2. Check if the node can be activated
       */

      if (isNaN(parseFloat(nodeComputedProps.top)) || nodeComputedProps.display == 'table-cell' || nodeComputedProps.display == 'none') return;
      this._active = true;
      /*
       * 3. Check if the current node position is `sticky`. If it is, it means that the browser supports sticky positioning,
       *    but the polyfill was force-enabled. We set the node’s position to `static` before continuing, so that the node
       *    is in it’s initial position when we gather its params.
       */

      var originalPosition = node.style.position;
      if (nodeComputedStyle.position == 'sticky' || nodeComputedStyle.position == '-webkit-sticky') node.style.position = 'static';
      /*
       * 4. Get necessary node parameters
       */

      var referenceNode = node.parentNode;
      var parentNode = shadowRootExists && referenceNode instanceof ShadowRoot ? referenceNode.host : referenceNode;
      var nodeWinOffset = node.getBoundingClientRect();
      var parentWinOffset = parentNode.getBoundingClientRect();
      var parentComputedStyle = getComputedStyle(parentNode);
      this._parent = {
        node: parentNode,
        styles: {
          position: parentNode.style.position
        },
        offsetHeight: parentNode.offsetHeight
      };
      this._offsetToWindow = {
        left: nodeWinOffset.left,
        right: document.documentElement.clientWidth - nodeWinOffset.right
      };
      this._offsetToParent = {
        top: nodeWinOffset.top - parentWinOffset.top - parseNumeric(parentComputedStyle.borderTopWidth),
        left: nodeWinOffset.left - parentWinOffset.left - parseNumeric(parentComputedStyle.borderLeftWidth),
        right: -nodeWinOffset.right + parentWinOffset.right - parseNumeric(parentComputedStyle.borderRightWidth)
      };
      this._styles = {
        position: originalPosition,
        top: node.style.top,
        bottom: node.style.bottom,
        left: node.style.left,
        right: node.style.right,
        width: node.style.width,
        marginTop: node.style.marginTop,
        marginLeft: node.style.marginLeft,
        marginRight: node.style.marginRight
      };
      var nodeTopValue = parseNumeric(nodeComputedProps.top);
      this._limits = {
        start: nodeWinOffset.top + window.pageYOffset - nodeTopValue,
        end: parentWinOffset.top + window.pageYOffset + parentNode.offsetHeight - parseNumeric(parentComputedStyle.borderBottomWidth) - node.offsetHeight - nodeTopValue - parseNumeric(nodeComputedProps.marginBottom)
      };
      /*
       * 5. Ensure that the node will be positioned relatively to the parent node
       */

      var parentPosition = parentComputedStyle.position;

      if (parentPosition != 'absolute' && parentPosition != 'relative') {
        parentNode.style.position = 'relative';
      }
      /*
       * 6. Recalc node position.
       *    It’s important to do this before clone injection to avoid scrolling bug in Chrome.
       */


      this._recalcPosition();
      /*
       * 7. Create a clone
       */


      var clone = this._clone = {};
      clone.node = document.createElement('div'); // Apply styles to the clone

      extend(clone.node.style, {
        width: nodeWinOffset.right - nodeWinOffset.left + 'px',
        height: nodeWinOffset.bottom - nodeWinOffset.top + 'px',
        marginTop: nodeComputedProps.marginTop,
        marginBottom: nodeComputedProps.marginBottom,
        marginLeft: nodeComputedProps.marginLeft,
        marginRight: nodeComputedProps.marginRight,
        cssFloat: nodeComputedProps.cssFloat,
        padding: 0,
        border: 0,
        borderSpacing: 0,
        fontSize: '1em',
        position: 'static'
      });
      referenceNode.insertBefore(clone.node, node);
      clone.docOffsetTop = getDocOffsetTop(clone.node);
    }
  }, {
    key: "_recalcPosition",
    value: function _recalcPosition() {
      if (!this._active || this._removed) return;
      var stickyMode = scroll.top <= this._limits.start ? 'start' : scroll.top >= this._limits.end ? 'end' : 'middle';
      if (this._stickyMode == stickyMode) return;

      switch (stickyMode) {
        case 'start':
          extend(this._node.style, {
            position: 'absolute',
            left: this._offsetToParent.left + 'px',
            right: this._offsetToParent.right + 'px',
            top: this._offsetToParent.top + 'px',
            bottom: 'auto',
            width: 'auto',
            marginLeft: 0,
            marginRight: 0,
            marginTop: 0
          });
          break;

        case 'middle':
          extend(this._node.style, {
            position: 'fixed',
            left: this._offsetToWindow.left + 'px',
            right: this._offsetToWindow.right + 'px',
            top: this._styles.top,
            bottom: 'auto',
            width: 'auto',
            marginLeft: 0,
            marginRight: 0,
            marginTop: 0
          });
          break;

        case 'end':
          extend(this._node.style, {
            position: 'absolute',
            left: this._offsetToParent.left + 'px',
            right: this._offsetToParent.right + 'px',
            top: 'auto',
            bottom: 0,
            width: 'auto',
            marginLeft: 0,
            marginRight: 0
          });
          break;
      }

      this._stickyMode = stickyMode;
    }
  }, {
    key: "_fastCheck",
    value: function _fastCheck() {
      if (!this._active || this._removed) return;
      if (Math.abs(getDocOffsetTop(this._clone.node) - this._clone.docOffsetTop) > 1 || Math.abs(this._parent.node.offsetHeight - this._parent.offsetHeight) > 1) this.refresh();
    }
  }, {
    key: "_deactivate",
    value: function _deactivate() {
      var _this = this;

      if (!this._active || this._removed) return;

      this._clone.node.parentNode.removeChild(this._clone.node);

      delete this._clone;
      extend(this._node.style, this._styles);
      delete this._styles; // Check whether element’s parent node is used by other stickies.
      // If not, restore parent node’s styles.

      if (!stickies.some(function (sticky) {
        return sticky !== _this && sticky._parent && sticky._parent.node === _this._parent.node;
      })) {
        extend(this._parent.node.style, this._parent.styles);
      }

      delete this._parent;
      this._stickyMode = null;
      this._active = false;
      delete this._offsetToWindow;
      delete this._offsetToParent;
      delete this._limits;
    }
  }, {
    key: "remove",
    value: function remove() {
      var _this2 = this;

      this._deactivate();

      stickies.some(function (sticky, index) {
        if (sticky._node === _this2._node) {
          stickies.splice(index, 1);
          return true;
        }
      });
      this._removed = true;
    }
  }]);

  return Sticky;
}();
/*
 * 5. Stickyfill API
 */


var Stickyfill = {
  stickies: stickies,
  Sticky: Sticky,
  forceSticky: function forceSticky() {
    seppuku = false;
    init();
    this.refreshAll();
  },
  addOne: function addOne(node) {
    // Check whether it’s a node
    if (!(node instanceof HTMLElement)) {
      // Maybe it’s a node list of some sort?
      // Take first node from the list then
      if (node.length && node[0]) node = node[0];else return;
    } // Check if Stickyfill is already applied to the node
    // and return existing sticky


    for (var i = 0; i < stickies.length; i++) {
      if (stickies[i]._node === node) return stickies[i];
    } // Create and return new sticky


    return new Sticky(node);
  },
  add: function add(nodeList) {
    // If it’s a node make an array of one node
    if (nodeList instanceof HTMLElement) nodeList = [nodeList]; // Check if the argument is an iterable of some sort

    if (!nodeList.length) return; // Add every element as a sticky and return an array of created Sticky instances

    var addedStickies = [];

    var _loop = function _loop(i) {
      var node = nodeList[i]; // If it’s not an HTMLElement – create an empty element to preserve 1-to-1
      // correlation with input list

      if (!(node instanceof HTMLElement)) {
        addedStickies.push(void 0);
        return "continue";
      } // If Stickyfill is already applied to the node
      // add existing sticky


      if (stickies.some(function (sticky) {
        if (sticky._node === node) {
          addedStickies.push(sticky);
          return true;
        }
      })) return "continue"; // Create and add new sticky

      addedStickies.push(new Sticky(node));
    };

    for (var i = 0; i < nodeList.length; i++) {
      var _ret = _loop(i);

      if (_ret === "continue") continue;
    }

    return addedStickies;
  },
  refreshAll: function refreshAll() {
    stickies.forEach(function (sticky) {
      return sticky.refresh();
    });
  },
  removeOne: function removeOne(node) {
    // Check whether it’s a node
    if (!(node instanceof HTMLElement)) {
      // Maybe it’s a node list of some sort?
      // Take first node from the list then
      if (node.length && node[0]) node = node[0];else return;
    } // Remove the stickies bound to the nodes in the list


    stickies.some(function (sticky) {
      if (sticky._node === node) {
        sticky.remove();
        return true;
      }
    });
  },
  remove: function remove(nodeList) {
    // If it’s a node make an array of one node
    if (nodeList instanceof HTMLElement) nodeList = [nodeList]; // Check if the argument is an iterable of some sort

    if (!nodeList.length) return; // Remove the stickies bound to the nodes in the list

    var _loop2 = function _loop2(i) {
      var node = nodeList[i];
      stickies.some(function (sticky) {
        if (sticky._node === node) {
          sticky.remove();
          return true;
        }
      });
    };

    for (var i = 0; i < nodeList.length; i++) {
      _loop2(i);
    }
  },
  removeAll: function removeAll() {
    while (stickies.length) {
      stickies[0].remove();
    }
  }
};
/*
 * 6. Setup events (unless the polyfill was disabled)
 */

function init() {
  if (isInitialized) {
    return;
  }

  isInitialized = true; // Watch for scroll position changes and trigger recalc/refresh if needed

  function checkScroll() {
    if (window.pageXOffset != scroll.left) {
      scroll.top = window.pageYOffset;
      scroll.left = window.pageXOffset;
      Stickyfill.refreshAll();
    } else if (window.pageYOffset != scroll.top) {
      scroll.top = window.pageYOffset;
      scroll.left = window.pageXOffset; // recalc position for all stickies

      stickies.forEach(function (sticky) {
        return sticky._recalcPosition();
      });
    }
  }

  checkScroll();
  window.addEventListener('scroll', checkScroll); // Watch for window resizes and device orientation changes and trigger refresh

  window.addEventListener('resize', Stickyfill.refreshAll);
  window.addEventListener('orientationchange', Stickyfill.refreshAll); //Fast dirty check for layout changes every 500ms

  var fastCheckTimer;

  function startFastCheckTimer() {
    fastCheckTimer = setInterval(function () {
      stickies.forEach(function (sticky) {
        return sticky._fastCheck();
      });
    }, 500);
  }

  function stopFastCheckTimer() {
    clearInterval(fastCheckTimer);
  }

  var docHiddenKey;
  var visibilityChangeEventName;

  if ('hidden' in document) {
    docHiddenKey = 'hidden';
    visibilityChangeEventName = 'visibilitychange';
  } else if ('webkitHidden' in document) {
    docHiddenKey = 'webkitHidden';
    visibilityChangeEventName = 'webkitvisibilitychange';
  }

  if (visibilityChangeEventName) {
    if (!document[docHiddenKey]) startFastCheckTimer();
    document.addEventListener(visibilityChangeEventName, function () {
      if (document[docHiddenKey]) {
        stopFastCheckTimer();
      } else {
        startFastCheckTimer();
      }
    });
  } else startFastCheckTimer();
}

if (!seppuku) init();
/*
 * 7. Expose Stickyfill
 */

if (typeof module != 'undefined' && module.exports) {
  module.exports = Stickyfill;
} else if (isWindowDefined) {
  window.Stickyfill = Stickyfill;
}
/*! picturefill - v3.0.2 - 2016-02-12
 * https://scottjehl.github.io/picturefill/
 * Copyright (c) 2016 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT
 */

/*! Gecko-Picture - v1.0
 * https://github.com/scottjehl/picturefill/tree/3.0/src/plugins/gecko-picture
 * Firefox's early picture implementation (prior to FF41) is static and does
 * not react to viewport changes. This tiny module fixes this.
 */


(function (window) {
  /*jshint eqnull:true */
  var ua = navigator.userAgent;

  if (window.HTMLPictureElement && /ecko/.test(ua) && ua.match(/rv\:(\d+)/) && RegExp.$1 < 45) {
    addEventListener("resize", function () {
      var timer;
      var dummySrc = document.createElement("source");

      var fixRespimg = function fixRespimg(img) {
        var source, sizes;
        var picture = img.parentNode;

        if (picture.nodeName.toUpperCase() === "PICTURE") {
          source = dummySrc.cloneNode();
          picture.insertBefore(source, picture.firstElementChild);
          setTimeout(function () {
            picture.removeChild(source);
          });
        } else if (!img._pfLastSize || img.offsetWidth > img._pfLastSize) {
          img._pfLastSize = img.offsetWidth;
          sizes = img.sizes;
          img.sizes += ",100vw";
          setTimeout(function () {
            img.sizes = sizes;
          });
        }
      };

      var findPictureImgs = function findPictureImgs() {
        var i;
        var imgs = document.querySelectorAll("picture > img, img[srcset][sizes]");

        for (i = 0; i < imgs.length; i++) {
          fixRespimg(imgs[i]);
        }
      };

      var onResize = function onResize() {
        clearTimeout(timer);
        timer = setTimeout(findPictureImgs, 99);
      };

      var mq = window.matchMedia && matchMedia("(orientation: landscape)");

      var init = function init() {
        onResize();

        if (mq && mq.addListener) {
          mq.addListener(onResize);
        }
      };

      dummySrc.srcset = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

      if (/^[c|i]|d$/.test(document.readyState || "")) {
        init();
      } else {
        document.addEventListener("DOMContentLoaded", init);
      }

      return onResize;
    }());
  }
})(window);
/*! Picturefill - v3.0.2
 * http://scottjehl.github.io/picturefill
 * Copyright (c) 2015 https://github.com/scottjehl/picturefill/blob/master/Authors.txt;
 *  License: MIT
 */


(function (window, document, undefined) {
  // Enable strict mode
  "use strict"; // HTML shim|v it for old IE (IE9 will still need the HTML video tag workaround)

  document.createElement("picture");
  var warn, eminpx, alwaysCheckWDescriptor, evalId; // local object for method references and testing exposure

  var pf = {};
  var isSupportTestReady = false;

  var noop = function noop() {};

  var image = document.createElement("img");
  var getImgAttr = image.getAttribute;
  var setImgAttr = image.setAttribute;
  var removeImgAttr = image.removeAttribute;
  var docElem = document.documentElement;
  var types = {};
  var cfg = {
    //resource selection:
    algorithm: ""
  };
  var srcAttr = "data-pfsrc";
  var srcsetAttr = srcAttr + "set"; // ua sniffing is done for undetectable img loading features,
  // to do some non crucial perf optimizations

  var ua = navigator.userAgent;
  var supportAbort = /rident/.test(ua) || /ecko/.test(ua) && ua.match(/rv\:(\d+)/) && RegExp.$1 > 35;
  var curSrcProp = "currentSrc";
  var regWDesc = /\s+\+?\d+(e\d+)?w/;
  var regSize = /(\([^)]+\))?\s*(.+)/;
  var setOptions = window.picturefillCFG;
  /**
   * Shortcut property for https://w3c.github.io/webappsec/specs/mixedcontent/#restricts-mixed-content ( for easy overriding in tests )
   */
  // baseStyle also used by getEmValue (i.e.: width: 1em is important)

  var baseStyle = "position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)";
  var fsCss = "font-size:100%!important;";
  var isVwDirty = true;
  var cssCache = {};
  var sizeLengthCache = {};
  var DPR = window.devicePixelRatio;
  var units = {
    px: 1,
    "in": 96
  };
  var anchor = document.createElement("a");
  /**
   * alreadyRun flag used for setOptions. is it true setOptions will reevaluate
   * @type {boolean}
   */

  var alreadyRun = false; // Reusable, non-"g" Regexes
  // (Don't use \s, to avoid matching non-breaking space.)

  var regexLeadingSpaces = /^[ \t\n\r\u000c]+/,
      regexLeadingCommasOrSpaces = /^[, \t\n\r\u000c]+/,
      regexLeadingNotSpaces = /^[^ \t\n\r\u000c]+/,
      regexTrailingCommas = /[,]+$/,
      regexNonNegativeInteger = /^\d+$/,
      // ( Positive or negative or unsigned integers or decimals, without or without exponents.
  // Must include at least one digit.
  // According to spec tests any decimal point must be followed by a digit.
  // No leading plus sign is allowed.)
  // https://html.spec.whatwg.org/multipage/infrastructure.html#valid-floating-point-number
  regexFloatingPoint = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/;

  var on = function on(obj, evt, fn, capture) {
    if (obj.addEventListener) {
      obj.addEventListener(evt, fn, capture || false);
    } else if (obj.attachEvent) {
      obj.attachEvent("on" + evt, fn);
    }
  };
  /**
   * simple memoize function:
   */


  var memoize = function memoize(fn) {
    var cache = {};
    return function (input) {
      if (!(input in cache)) {
        cache[input] = fn(input);
      }

      return cache[input];
    };
  }; // UTILITY FUNCTIONS
  // Manual is faster than RegEx
  // http://jsperf.com/whitespace-character/5


  function isSpace(c) {
    return c === " " || // space
    c === "\t" || // horizontal tab
    c === "\n" || // new line
    c === "\f" || // form feed
    c === "\r"; // carriage return
  }
  /**
   * gets a mediaquery and returns a boolean or gets a css length and returns a number
   * @param css mediaqueries or css length
   * @returns {boolean|number}
   *
   * based on: https://gist.github.com/jonathantneal/db4f77009b155f083738
   */


  var evalCSS = function () {
    var regLength = /^([\d\.]+)(em|vw|px)$/;

    var replace = function replace() {
      var args = arguments,
          index = 0,
          string = args[0];

      while (++index in args) {
        string = string.replace(args[index], args[++index]);
      }

      return string;
    };

    var buildStr = memoize(function (css) {
      return "return " + replace((css || "").toLowerCase(), // interpret `and`
      /\band\b/g, "&&", // interpret `,`
      /,/g, "||", // interpret `min-` as >=
      /min-([a-z-\s]+):/g, "e.$1>=", // interpret `max-` as <=
      /max-([a-z-\s]+):/g, "e.$1<=", //calc value
      /calc([^)]+)/g, "($1)", // interpret css values
      /(\d+[\.]*[\d]*)([a-z]+)/g, "($1 * e.$2)", //make eval less evil
      /^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/ig, "") + ";";
    });
    return function (css, length) {
      var parsedLength;

      if (!(css in cssCache)) {
        cssCache[css] = false;

        if (length && (parsedLength = css.match(regLength))) {
          cssCache[css] = parsedLength[1] * units[parsedLength[2]];
        } else {
          /*jshint evil:true */
          try {
            cssCache[css] = new Function("e", buildStr(css))(units);
          } catch (e) {}
          /*jshint evil:false */

        }
      }

      return cssCache[css];
    };
  }();

  var setResolution = function setResolution(candidate, sizesattr) {
    if (candidate.w) {
      // h = means height: || descriptor.type === 'h' do not handle yet...
      candidate.cWidth = pf.calcListLength(sizesattr || "100vw");
      candidate.res = candidate.w / candidate.cWidth;
    } else {
      candidate.res = candidate.d;
    }

    return candidate;
  };
  /**
   *
   * @param opt
   */


  var picturefill = function picturefill(opt) {
    if (!isSupportTestReady) {
      return;
    }

    var elements, i, plen;
    var options = opt || {};

    if (options.elements && options.elements.nodeType === 1) {
      if (options.elements.nodeName.toUpperCase() === "IMG") {
        options.elements = [options.elements];
      } else {
        options.context = options.elements;
        options.elements = null;
      }
    }

    elements = options.elements || pf.qsa(options.context || document, options.reevaluate || options.reselect ? pf.sel : pf.selShort);

    if (plen = elements.length) {
      pf.setupRun(options);
      alreadyRun = true; // Loop through all elements

      for (i = 0; i < plen; i++) {
        pf.fillImg(elements[i], options);
      }

      pf.teardownRun(options);
    }
  };
  /**
   * outputs a warning for the developer
   * @param {message}
   * @type {Function}
   */


  warn = window.console && console.warn ? function (message) {
    console.warn(message);
  } : noop;

  if (!(curSrcProp in image)) {
    curSrcProp = "src";
  } // Add support for standard mime types.


  types["image/jpeg"] = true;
  types["image/gif"] = true;
  types["image/png"] = true;

  function detectTypeSupport(type, typeUri) {
    // based on Modernizr's lossless img-webp test
    // note: asynchronous
    var image = new window.Image();

    image.onerror = function () {
      types[type] = false;
      picturefill();
    };

    image.onload = function () {
      types[type] = image.width === 1;
      picturefill();
    };

    image.src = typeUri;
    return "pending";
  } // test svg support


  types["image/svg+xml"] = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
  /**
   * updates the internal vW property with the current viewport width in px
   */

  function updateMetrics() {
    isVwDirty = false;
    DPR = window.devicePixelRatio;
    cssCache = {};
    sizeLengthCache = {};
    pf.DPR = DPR || 1;
    units.width = Math.max(window.innerWidth || 0, docElem.clientWidth);
    units.height = Math.max(window.innerHeight || 0, docElem.clientHeight);
    units.vw = units.width / 100;
    units.vh = units.height / 100;
    evalId = [units.height, units.width, DPR].join("-");
    units.em = pf.getEmValue();
    units.rem = units.em;
  }

  function chooseLowRes(lowerValue, higherValue, dprValue, isCached) {
    var bonusFactor, tooMuch, bonus, meanDensity; //experimental

    if (cfg.algorithm === "saveData") {
      if (lowerValue > 2.7) {
        meanDensity = dprValue + 1;
      } else {
        tooMuch = higherValue - dprValue;
        bonusFactor = Math.pow(lowerValue - 0.6, 1.5);
        bonus = tooMuch * bonusFactor;

        if (isCached) {
          bonus += 0.1 * bonusFactor;
        }

        meanDensity = lowerValue + bonus;
      }
    } else {
      meanDensity = dprValue > 1 ? Math.sqrt(lowerValue * higherValue) : lowerValue;
    }

    return meanDensity > dprValue;
  }

  function applyBestCandidate(img) {
    var srcSetCandidates;
    var matchingSet = pf.getSet(img);
    var evaluated = false;

    if (matchingSet !== "pending") {
      evaluated = evalId;

      if (matchingSet) {
        srcSetCandidates = pf.setRes(matchingSet);
        pf.applySetCandidate(srcSetCandidates, img);
      }
    }

    img[pf.ns].evaled = evaluated;
  }

  function ascendingSort(a, b) {
    return a.res - b.res;
  }

  function setSrcToCur(img, src, set) {
    var candidate;

    if (!set && src) {
      set = img[pf.ns].sets;
      set = set && set[set.length - 1];
    }

    candidate = getCandidateForSrc(src, set);

    if (candidate) {
      src = pf.makeUrl(src);
      img[pf.ns].curSrc = src;
      img[pf.ns].curCan = candidate;

      if (!candidate.res) {
        setResolution(candidate, candidate.set.sizes);
      }
    }

    return candidate;
  }

  function getCandidateForSrc(src, set) {
    var i, candidate, candidates;

    if (src && set) {
      candidates = pf.parseSet(set);
      src = pf.makeUrl(src);

      for (i = 0; i < candidates.length; i++) {
        if (src === pf.makeUrl(candidates[i].url)) {
          candidate = candidates[i];
          break;
        }
      }
    }

    return candidate;
  }

  function getAllSourceElements(picture, candidates) {
    var i, len, source, srcset; // SPEC mismatch intended for size and perf:
    // actually only source elements preceding the img should be used
    // also note: don't use qsa here, because IE8 sometimes doesn't like source as the key part in a selector

    var sources = picture.getElementsByTagName("source");

    for (i = 0, len = sources.length; i < len; i++) {
      source = sources[i];
      source[pf.ns] = true;
      srcset = source.getAttribute("srcset"); // if source does not have a srcset attribute, skip

      if (srcset) {
        candidates.push({
          srcset: srcset,
          media: source.getAttribute("media"),
          type: source.getAttribute("type"),
          sizes: source.getAttribute("sizes")
        });
      }
    }
  }
  /**
   * Srcset Parser
   * By Alex Bell |  MIT License
   *
   * @returns Array [{url: _, d: _, w: _, h:_, set:_(????)}, ...]
   *
   * Based super duper closely on the reference algorithm at:
   * https://html.spec.whatwg.org/multipage/embedded-content.html#parse-a-srcset-attribute
   */
  // 1. Let input be the value passed to this algorithm.
  // (TO-DO : Explain what "set" argument is here. Maybe choose a more
  // descriptive & more searchable name.  Since passing the "set" in really has
  // nothing to do with parsing proper, I would prefer this assignment eventually
  // go in an external fn.)


  function parseSrcset(input, set) {
    function collectCharacters(regEx) {
      var chars,
          match = regEx.exec(input.substring(pos));

      if (match) {
        chars = match[0];
        pos += chars.length;
        return chars;
      }
    }

    var inputLength = input.length,
        url,
        descriptors,
        currentDescriptor,
        state,
        c,
        // 2. Let position be a pointer into input, initially pointing at the start
    //    of the string.
    pos = 0,
        // 3. Let candidates be an initially empty source set.
    candidates = [];
    /**
     * Adds descriptor properties to a candidate, pushes to the candidates array
     * @return undefined
     */
    // (Declared outside of the while loop so that it's only created once.
    // (This fn is defined before it is used, in order to pass JSHINT.
    // Unfortunately this breaks the sequencing of the spec comments. :/ )

    function parseDescriptors() {
      // 9. Descriptor parser: Let error be no.
      var pError = false,
          // 10. Let width be absent.
      // 11. Let density be absent.
      // 12. Let future-compat-h be absent. (We're implementing it now as h)
      w,
          d,
          h,
          i,
          candidate = {},
          desc,
          lastChar,
          value,
          intVal,
          floatVal; // 13. For each descriptor in descriptors, run the appropriate set of steps
      // from the following list:

      for (i = 0; i < descriptors.length; i++) {
        desc = descriptors[i];
        lastChar = desc[desc.length - 1];
        value = desc.substring(0, desc.length - 1);
        intVal = parseInt(value, 10);
        floatVal = parseFloat(value); // If the descriptor consists of a valid non-negative integer followed by
        // a U+0077 LATIN SMALL LETTER W character

        if (regexNonNegativeInteger.test(value) && lastChar === "w") {
          // If width and density are not both absent, then let error be yes.
          if (w || d) {
            pError = true;
          } // Apply the rules for parsing non-negative integers to the descriptor.
          // If the result is zero, let error be yes.
          // Otherwise, let width be the result.


          if (intVal === 0) {
            pError = true;
          } else {
            w = intVal;
          } // If the descriptor consists of a valid floating-point number followed by
          // a U+0078 LATIN SMALL LETTER X character

        } else if (regexFloatingPoint.test(value) && lastChar === "x") {
          // If width, density and future-compat-h are not all absent, then let error
          // be yes.
          if (w || d || h) {
            pError = true;
          } // Apply the rules for parsing floating-point number values to the descriptor.
          // If the result is less than zero, let error be yes. Otherwise, let density
          // be the result.


          if (floatVal < 0) {
            pError = true;
          } else {
            d = floatVal;
          } // If the descriptor consists of a valid non-negative integer followed by
          // a U+0068 LATIN SMALL LETTER H character

        } else if (regexNonNegativeInteger.test(value) && lastChar === "h") {
          // If height and density are not both absent, then let error be yes.
          if (h || d) {
            pError = true;
          } // Apply the rules for parsing non-negative integers to the descriptor.
          // If the result is zero, let error be yes. Otherwise, let future-compat-h
          // be the result.


          if (intVal === 0) {
            pError = true;
          } else {
            h = intVal;
          } // Anything else, Let error be yes.

        } else {
          pError = true;
        }
      } // (close step 13 for loop)
      // 15. If error is still no, then append a new image source to candidates whose
      // URL is url, associated with a width width if not absent and a pixel
      // density density if not absent. Otherwise, there is a parse error.


      if (!pError) {
        candidate.url = url;

        if (w) {
          candidate.w = w;
        }

        if (d) {
          candidate.d = d;
        }

        if (h) {
          candidate.h = h;
        }

        if (!h && !d && !w) {
          candidate.d = 1;
        }

        if (candidate.d === 1) {
          set.has1x = true;
        }

        candidate.set = set;
        candidates.push(candidate);
      }
    } // (close parseDescriptors fn)

    /**
     * Tokenizes descriptor properties prior to parsing
     * Returns undefined.
     * (Again, this fn is defined before it is used, in order to pass JSHINT.
     * Unfortunately this breaks the logical sequencing of the spec comments. :/ )
     */


    function tokenize() {
      // 8.1. Descriptor tokeniser: Skip whitespace
      collectCharacters(regexLeadingSpaces); // 8.2. Let current descriptor be the empty string.

      currentDescriptor = ""; // 8.3. Let state be in descriptor.

      state = "in descriptor";

      while (true) {
        // 8.4. Let c be the character at position.
        c = input.charAt(pos); //  Do the following depending on the value of state.
        //  For the purpose of this step, "EOF" is a special character representing
        //  that position is past the end of input.
        // In descriptor

        if (state === "in descriptor") {
          // Do the following, depending on the value of c:
          // Space character
          // If current descriptor is not empty, append current descriptor to
          // descriptors and let current descriptor be the empty string.
          // Set state to after descriptor.
          if (isSpace(c)) {
            if (currentDescriptor) {
              descriptors.push(currentDescriptor);
              currentDescriptor = "";
              state = "after descriptor";
            } // U+002C COMMA (,)
            // Advance position to the next character in input. If current descriptor
            // is not empty, append current descriptor to descriptors. Jump to the step
            // labeled descriptor parser.

          } else if (c === ",") {
            pos += 1;

            if (currentDescriptor) {
              descriptors.push(currentDescriptor);
            }

            parseDescriptors();
            return; // U+0028 LEFT PARENTHESIS (()
            // Append c to current descriptor. Set state to in parens.
          } else if (c === "(") {
            currentDescriptor = currentDescriptor + c;
            state = "in parens"; // EOF
            // If current descriptor is not empty, append current descriptor to
            // descriptors. Jump to the step labeled descriptor parser.
          } else if (c === "") {
            if (currentDescriptor) {
              descriptors.push(currentDescriptor);
            }

            parseDescriptors();
            return; // Anything else
            // Append c to current descriptor.
          } else {
            currentDescriptor = currentDescriptor + c;
          } // (end "in descriptor"
          // In parens

        } else if (state === "in parens") {
          // U+0029 RIGHT PARENTHESIS ())
          // Append c to current descriptor. Set state to in descriptor.
          if (c === ")") {
            currentDescriptor = currentDescriptor + c;
            state = "in descriptor"; // EOF
            // Append current descriptor to descriptors. Jump to the step labeled
            // descriptor parser.
          } else if (c === "") {
            descriptors.push(currentDescriptor);
            parseDescriptors();
            return; // Anything else
            // Append c to current descriptor.
          } else {
            currentDescriptor = currentDescriptor + c;
          } // After descriptor

        } else if (state === "after descriptor") {
          // Do the following, depending on the value of c:
          // Space character: Stay in this state.
          if (isSpace(c)) {// EOF: Jump to the step labeled descriptor parser.
          } else if (c === "") {
            parseDescriptors();
            return; // Anything else
            // Set state to in descriptor. Set position to the previous character in input.
          } else {
            state = "in descriptor";
            pos -= 1;
          }
        } // Advance position to the next character in input.


        pos += 1; // Repeat this step.
      } // (close while true loop)

    } // 4. Splitting loop: Collect a sequence of characters that are space
    //    characters or U+002C COMMA characters. If any U+002C COMMA characters
    //    were collected, that is a parse error.


    while (true) {
      collectCharacters(regexLeadingCommasOrSpaces); // 5. If position is past the end of input, return candidates and abort these steps.

      if (pos >= inputLength) {
        return candidates; // (we're done, this is the sole return path)
      } // 6. Collect a sequence of characters that are not space characters,
      //    and let that be url.


      url = collectCharacters(regexLeadingNotSpaces); // 7. Let descriptors be a new empty list.

      descriptors = []; // 8. If url ends with a U+002C COMMA character (,), follow these substeps:
      //		(1). Remove all trailing U+002C COMMA characters from url. If this removed
      //         more than one character, that is a parse error.

      if (url.slice(-1) === ",") {
        url = url.replace(regexTrailingCommas, ""); // (Jump ahead to step 9 to skip tokenization and just push the candidate).

        parseDescriptors(); //	Otherwise, follow these substeps:
      } else {
        tokenize();
      } // (close else of step 8)
      // 16. Return to the step labeled splitting loop.

    } // (Close of big while loop.)

  }
  /*
   * Sizes Parser
   *
   * By Alex Bell |  MIT License
   *
   * Non-strict but accurate and lightweight JS Parser for the string value <img sizes="here">
   *
   * Reference algorithm at:
   * https://html.spec.whatwg.org/multipage/embedded-content.html#parse-a-sizes-attribute
   *
   * Most comments are copied in directly from the spec
   * (except for comments in parens).
   *
   * Grammar is:
   * <source-size-list> = <source-size># [ , <source-size-value> ]? | <source-size-value>
   * <source-size> = <media-condition> <source-size-value>
   * <source-size-value> = <length>
   * http://www.w3.org/html/wg/drafts/html/master/embedded-content.html#attr-img-sizes
   *
   * E.g. "(max-width: 30em) 100vw, (max-width: 50em) 70vw, 100vw"
   * or "(min-width: 30em), calc(30vw - 15px)" or just "30vw"
   *
   * Returns the first valid <css-length> with a media condition that evaluates to true,
   * or "100vw" if all valid media conditions evaluate to false.
   *
   */


  function parseSizes(strValue) {
    // (Percentage CSS lengths are not allowed in this case, to avoid confusion:
    // https://html.spec.whatwg.org/multipage/embedded-content.html#valid-source-size-list
    // CSS allows a single optional plus or minus sign:
    // http://www.w3.org/TR/CSS2/syndata.html#numbers
    // CSS is ASCII case-insensitive:
    // http://www.w3.org/TR/CSS2/syndata.html#characters )
    // Spec allows exponential notation for <number> type:
    // http://dev.w3.org/csswg/css-values/#numbers
    var regexCssLengthWithUnits = /^(?:[+-]?[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?(?:ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmin|vmax|vw)$/i; // (This is a quick and lenient test. Because of optional unlimited-depth internal
    // grouping parens and strict spacing rules, this could get very complicated.)

    var regexCssCalc = /^calc\((?:[0-9a-z \.\+\-\*\/\(\)]+)\)$/i;
    var i;
    var unparsedSizesList;
    var unparsedSizesListLength;
    var unparsedSize;
    var lastComponentValue;
    var size; // UTILITY FUNCTIONS
    //  (Toy CSS parser. The goals here are:
    //  1) expansive test coverage without the weight of a full CSS parser.
    //  2) Avoiding regex wherever convenient.
    //  Quick tests: http://jsfiddle.net/gtntL4gr/3/
    //  Returns an array of arrays.)

    function parseComponentValues(str) {
      var chrctr;
      var component = "";
      var componentArray = [];
      var listArray = [];
      var parenDepth = 0;
      var pos = 0;
      var inComment = false;

      function pushComponent() {
        if (component) {
          componentArray.push(component);
          component = "";
        }
      }

      function pushComponentArray() {
        if (componentArray[0]) {
          listArray.push(componentArray);
          componentArray = [];
        }
      } // (Loop forwards from the beginning of the string.)


      while (true) {
        chrctr = str.charAt(pos);

        if (chrctr === "") {
          // ( End of string reached.)
          pushComponent();
          pushComponentArray();
          return listArray;
        } else if (inComment) {
          if (chrctr === "*" && str[pos + 1] === "/") {
            // (At end of a comment.)
            inComment = false;
            pos += 2;
            pushComponent();
            continue;
          } else {
            pos += 1; // (Skip all characters inside comments.)

            continue;
          }
        } else if (isSpace(chrctr)) {
          // (If previous character in loop was also a space, or if
          // at the beginning of the string, do not add space char to
          // component.)
          if (str.charAt(pos - 1) && isSpace(str.charAt(pos - 1)) || !component) {
            pos += 1;
            continue;
          } else if (parenDepth === 0) {
            pushComponent();
            pos += 1;
            continue;
          } else {
            // (Replace any space character with a plain space for legibility.)
            chrctr = " ";
          }
        } else if (chrctr === "(") {
          parenDepth += 1;
        } else if (chrctr === ")") {
          parenDepth -= 1;
        } else if (chrctr === ",") {
          pushComponent();
          pushComponentArray();
          pos += 1;
          continue;
        } else if (chrctr === "/" && str.charAt(pos + 1) === "*") {
          inComment = true;
          pos += 2;
          continue;
        }

        component = component + chrctr;
        pos += 1;
      }
    }

    function isValidNonNegativeSourceSizeValue(s) {
      if (regexCssLengthWithUnits.test(s) && parseFloat(s) >= 0) {
        return true;
      }

      if (regexCssCalc.test(s)) {
        return true;
      } // ( http://www.w3.org/TR/CSS2/syndata.html#numbers says:
      // "-0 is equivalent to 0 and is not a negative number." which means that
      // unitless zero and unitless negative zero must be accepted as special cases.)


      if (s === "0" || s === "-0" || s === "+0") {
        return true;
      }

      return false;
    } // When asked to parse a sizes attribute from an element, parse a
    // comma-separated list of component values from the value of the element's
    // sizes attribute (or the empty string, if the attribute is absent), and let
    // unparsed sizes list be the result.
    // http://dev.w3.org/csswg/css-syntax/#parse-comma-separated-list-of-component-values


    unparsedSizesList = parseComponentValues(strValue);
    unparsedSizesListLength = unparsedSizesList.length; // For each unparsed size in unparsed sizes list:

    for (i = 0; i < unparsedSizesListLength; i++) {
      unparsedSize = unparsedSizesList[i]; // 1. Remove all consecutive <whitespace-token>s from the end of unparsed size.
      // ( parseComponentValues() already omits spaces outside of parens. )
      // If unparsed size is now empty, that is a parse error; continue to the next
      // iteration of this algorithm.
      // ( parseComponentValues() won't push an empty array. )
      // 2. If the last component value in unparsed size is a valid non-negative
      // <source-size-value>, let size be its value and remove the component value
      // from unparsed size. Any CSS function other than the calc() function is
      // invalid. Otherwise, there is a parse error; continue to the next iteration
      // of this algorithm.
      // http://dev.w3.org/csswg/css-syntax/#parse-component-value

      lastComponentValue = unparsedSize[unparsedSize.length - 1];

      if (isValidNonNegativeSourceSizeValue(lastComponentValue)) {
        size = lastComponentValue;
        unparsedSize.pop();
      } else {
        continue;
      } // 3. Remove all consecutive <whitespace-token>s from the end of unparsed
      // size. If unparsed size is now empty, return size and exit this algorithm.
      // If this was not the last item in unparsed sizes list, that is a parse error.


      if (unparsedSize.length === 0) {
        return size;
      } // 4. Parse the remaining component values in unparsed size as a
      // <media-condition>. If it does not parse correctly, or it does parse
      // correctly but the <media-condition> evaluates to false, continue to the
      // next iteration of this algorithm.
      // (Parsing all possible compound media conditions in JS is heavy, complicated,
      // and the payoff is unclear. Is there ever an situation where the
      // media condition parses incorrectly but still somehow evaluates to true?
      // Can we just rely on the browser/polyfill to do it?)


      unparsedSize = unparsedSize.join(" ");

      if (!pf.matchesMedia(unparsedSize)) {
        continue;
      } // 5. Return size and exit this algorithm.


      return size;
    } // If the above algorithm exhausts unparsed sizes list without returning a
    // size value, return 100vw.


    return "100vw";
  } // namespace


  pf.ns = ("pf" + new Date().getTime()).substr(0, 9); // srcset support test

  pf.supSrcset = "srcset" in image;
  pf.supSizes = "sizes" in image;
  pf.supPicture = !!window.HTMLPictureElement; // UC browser does claim to support srcset and picture, but not sizes,
  // this extended test reveals the browser does support nothing

  if (pf.supSrcset && pf.supPicture && !pf.supSizes) {
    (function (image2) {
      image.srcset = "data:,a";
      image2.src = "data:,a";
      pf.supSrcset = image.complete === image2.complete;
      pf.supPicture = pf.supSrcset && pf.supPicture;
    })(document.createElement("img"));
  } // Safari9 has basic support for sizes, but does't expose the `sizes` idl attribute


  if (pf.supSrcset && !pf.supSizes) {
    (function () {
      var width2 = "data:image/gif;base64,R0lGODlhAgABAPAAAP///wAAACH5BAAAAAAALAAAAAACAAEAAAICBAoAOw==";
      var width1 = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
      var img = document.createElement("img");

      var test = function test() {
        var width = img.width;

        if (width === 2) {
          pf.supSizes = true;
        }

        alwaysCheckWDescriptor = pf.supSrcset && !pf.supSizes;
        isSupportTestReady = true; // force async

        setTimeout(picturefill);
      };

      img.onload = test;
      img.onerror = test;
      img.setAttribute("sizes", "9px");
      img.srcset = width1 + " 1w," + width2 + " 9w";
      img.src = width1;
    })();
  } else {
    isSupportTestReady = true;
  } // using pf.qsa instead of dom traversing does scale much better,
  // especially on sites mixing responsive and non-responsive images


  pf.selShort = "picture>img,img[srcset]";
  pf.sel = pf.selShort;
  pf.cfg = cfg;
  /**
   * Shortcut property for `devicePixelRatio` ( for easy overriding in tests )
   */

  pf.DPR = DPR || 1;
  pf.u = units; // container of supported mime types that one might need to qualify before using

  pf.types = types;
  pf.setSize = noop;
  /**
   * Gets a string and returns the absolute URL
   * @param src
   * @returns {String} absolute URL
   */

  pf.makeUrl = memoize(function (src) {
    anchor.href = src;
    return anchor.href;
  });
  /**
   * Gets a DOM element or document and a selctor and returns the found matches
   * Can be extended with jQuery/Sizzle for IE7 support
   * @param context
   * @param sel
   * @returns {NodeList|Array}
   */

  pf.qsa = function (context, sel) {
    return "querySelector" in context ? context.querySelectorAll(sel) : [];
  };
  /**
   * Shortcut method for matchMedia ( for easy overriding in tests )
   * wether native or pf.mMQ is used will be decided lazy on first call
   * @returns {boolean}
   */


  pf.matchesMedia = function () {
    if (window.matchMedia && (matchMedia("(min-width: 0.1em)") || {}).matches) {
      pf.matchesMedia = function (media) {
        return !media || matchMedia(media).matches;
      };
    } else {
      pf.matchesMedia = pf.mMQ;
    }

    return pf.matchesMedia.apply(this, arguments);
  };
  /**
   * A simplified matchMedia implementation for IE8 and IE9
   * handles only min-width/max-width with px or em values
   * @param media
   * @returns {boolean}
   */


  pf.mMQ = function (media) {
    return media ? evalCSS(media) : true;
  };
  /**
   * Returns the calculated length in css pixel from the given sourceSizeValue
   * http://dev.w3.org/csswg/css-values-3/#length-value
   * intended Spec mismatches:
   * * Does not check for invalid use of CSS functions
   * * Does handle a computed length of 0 the same as a negative and therefore invalid value
   * @param sourceSizeValue
   * @returns {Number}
   */


  pf.calcLength = function (sourceSizeValue) {
    var value = evalCSS(sourceSizeValue, true) || false;

    if (value < 0) {
      value = false;
    }

    return value;
  };
  /**
   * Takes a type string and checks if its supported
   */


  pf.supportsType = function (type) {
    return type ? types[type] : true;
  };
  /**
   * Parses a sourceSize into mediaCondition (media) and sourceSizeValue (length)
   * @param sourceSizeStr
   * @returns {*}
   */


  pf.parseSize = memoize(function (sourceSizeStr) {
    var match = (sourceSizeStr || "").match(regSize);
    return {
      media: match && match[1],
      length: match && match[2]
    };
  });

  pf.parseSet = function (set) {
    if (!set.cands) {
      set.cands = parseSrcset(set.srcset, set);
    }

    return set.cands;
  };
  /**
   * returns 1em in css px for html/body default size
   * function taken from respondjs
   * @returns {*|number}
   */


  pf.getEmValue = function () {
    var body;

    if (!eminpx && (body = document.body)) {
      var div = document.createElement("div"),
          originalHTMLCSS = docElem.style.cssText,
          originalBodyCSS = body.style.cssText;
      div.style.cssText = baseStyle; // 1em in a media query is the value of the default font size of the browser
      // reset docElem and body to ensure the correct value is returned

      docElem.style.cssText = fsCss;
      body.style.cssText = fsCss;
      body.appendChild(div);
      eminpx = div.offsetWidth;
      body.removeChild(div); //also update eminpx before returning

      eminpx = parseFloat(eminpx, 10); // restore the original values

      docElem.style.cssText = originalHTMLCSS;
      body.style.cssText = originalBodyCSS;
    }

    return eminpx || 16;
  };
  /**
   * Takes a string of sizes and returns the width in pixels as a number
   */


  pf.calcListLength = function (sourceSizeListStr) {
    // Split up source size list, ie ( max-width: 30em ) 100%, ( max-width: 50em ) 50%, 33%
    //
    //                           or (min-width:30em) calc(30% - 15px)
    if (!(sourceSizeListStr in sizeLengthCache) || cfg.uT) {
      var winningLength = pf.calcLength(parseSizes(sourceSizeListStr));
      sizeLengthCache[sourceSizeListStr] = !winningLength ? units.width : winningLength;
    }

    return sizeLengthCache[sourceSizeListStr];
  };
  /**
   * Takes a candidate object with a srcset property in the form of url/
   * ex. "images/pic-medium.png 1x, images/pic-medium-2x.png 2x" or
   *     "images/pic-medium.png 400w, images/pic-medium-2x.png 800w" or
   *     "images/pic-small.png"
   * Get an array of image candidates in the form of
   *      {url: "/foo/bar.png", resolution: 1}
   * where resolution is http://dev.w3.org/csswg/css-values-3/#resolution-value
   * If sizes is specified, res is calculated
   */


  pf.setRes = function (set) {
    var candidates;

    if (set) {
      candidates = pf.parseSet(set);

      for (var i = 0, len = candidates.length; i < len; i++) {
        setResolution(candidates[i], set.sizes);
      }
    }

    return candidates;
  };

  pf.setRes.res = setResolution;

  pf.applySetCandidate = function (candidates, img) {
    if (!candidates.length) {
      return;
    }

    var candidate, i, j, length, bestCandidate, curSrc, curCan, candidateSrc, abortCurSrc;
    var imageData = img[pf.ns];
    var dpr = pf.DPR;
    curSrc = imageData.curSrc || img[curSrcProp];
    curCan = imageData.curCan || setSrcToCur(img, curSrc, candidates[0].set); // if we have a current source, we might either become lazy or give this source some advantage

    if (curCan && curCan.set === candidates[0].set) {
      // if browser can abort image request and the image has a higher pixel density than needed
      // and this image isn't downloaded yet, we skip next part and try to save bandwidth
      abortCurSrc = supportAbort && !img.complete && curCan.res - 0.1 > dpr;

      if (!abortCurSrc) {
        curCan.cached = true; // if current candidate is "best", "better" or "okay",
        // set it to bestCandidate

        if (curCan.res >= dpr) {
          bestCandidate = curCan;
        }
      }
    }

    if (!bestCandidate) {
      candidates.sort(ascendingSort);
      length = candidates.length;
      bestCandidate = candidates[length - 1];

      for (i = 0; i < length; i++) {
        candidate = candidates[i];

        if (candidate.res >= dpr) {
          j = i - 1; // we have found the perfect candidate,
          // but let's improve this a little bit with some assumptions ;-)

          if (candidates[j] && (abortCurSrc || curSrc !== pf.makeUrl(candidate.url)) && chooseLowRes(candidates[j].res, candidate.res, dpr, candidates[j].cached)) {
            bestCandidate = candidates[j];
          } else {
            bestCandidate = candidate;
          }

          break;
        }
      }
    }

    if (bestCandidate) {
      candidateSrc = pf.makeUrl(bestCandidate.url);
      imageData.curSrc = candidateSrc;
      imageData.curCan = bestCandidate;

      if (candidateSrc !== curSrc) {
        pf.setSrc(img, bestCandidate);
      }

      pf.setSize(img);
    }
  };

  pf.setSrc = function (img, bestCandidate) {
    var origWidth;
    img.src = bestCandidate.url; // although this is a specific Safari issue, we don't want to take too much different code paths

    if (bestCandidate.set.type === "image/svg+xml") {
      origWidth = img.style.width;
      img.style.width = img.offsetWidth + 1 + "px"; // next line only should trigger a repaint
      // if... is only done to trick dead code removal

      if (img.offsetWidth + 1) {
        img.style.width = origWidth;
      }
    }
  };

  pf.getSet = function (img) {
    var i, set, supportsType;
    var match = false;
    var sets = img[pf.ns].sets;

    for (i = 0; i < sets.length && !match; i++) {
      set = sets[i];

      if (!set.srcset || !pf.matchesMedia(set.media) || !(supportsType = pf.supportsType(set.type))) {
        continue;
      }

      if (supportsType === "pending") {
        set = supportsType;
      }

      match = set;
      break;
    }

    return match;
  };

  pf.parseSets = function (element, parent, options) {
    var srcsetAttribute, imageSet, isWDescripor, srcsetParsed;
    var hasPicture = parent && parent.nodeName.toUpperCase() === "PICTURE";
    var imageData = element[pf.ns];

    if (imageData.src === undefined || options.src) {
      imageData.src = getImgAttr.call(element, "src");

      if (imageData.src) {
        setImgAttr.call(element, srcAttr, imageData.src);
      } else {
        removeImgAttr.call(element, srcAttr);
      }
    }

    if (imageData.srcset === undefined || options.srcset || !pf.supSrcset || element.srcset) {
      srcsetAttribute = getImgAttr.call(element, "srcset");
      imageData.srcset = srcsetAttribute;
      srcsetParsed = true;
    }

    imageData.sets = [];

    if (hasPicture) {
      imageData.pic = true;
      getAllSourceElements(parent, imageData.sets);
    }

    if (imageData.srcset) {
      imageSet = {
        srcset: imageData.srcset,
        sizes: getImgAttr.call(element, "sizes")
      };
      imageData.sets.push(imageSet);
      isWDescripor = (alwaysCheckWDescriptor || imageData.src) && regWDesc.test(imageData.srcset || ""); // add normal src as candidate, if source has no w descriptor

      if (!isWDescripor && imageData.src && !getCandidateForSrc(imageData.src, imageSet) && !imageSet.has1x) {
        imageSet.srcset += ", " + imageData.src;
        imageSet.cands.push({
          url: imageData.src,
          d: 1,
          set: imageSet
        });
      }
    } else if (imageData.src) {
      imageData.sets.push({
        srcset: imageData.src,
        sizes: null
      });
    }

    imageData.curCan = null;
    imageData.curSrc = undefined; // if img has picture or the srcset was removed or has a srcset and does not support srcset at all
    // or has a w descriptor (and does not support sizes) set support to false to evaluate

    imageData.supported = !(hasPicture || imageSet && !pf.supSrcset || isWDescripor && !pf.supSizes);

    if (srcsetParsed && pf.supSrcset && !imageData.supported) {
      if (srcsetAttribute) {
        setImgAttr.call(element, srcsetAttr, srcsetAttribute);
        element.srcset = "";
      } else {
        removeImgAttr.call(element, srcsetAttr);
      }
    }

    if (imageData.supported && !imageData.srcset && (!imageData.src && element.src || element.src !== pf.makeUrl(imageData.src))) {
      if (imageData.src === null) {
        element.removeAttribute("src");
      } else {
        element.src = imageData.src;
      }
    }

    imageData.parsed = true;
  };

  pf.fillImg = function (element, options) {
    var imageData;
    var extreme = options.reselect || options.reevaluate; // expando for caching data on the img

    if (!element[pf.ns]) {
      element[pf.ns] = {};
    }

    imageData = element[pf.ns]; // if the element has already been evaluated, skip it
    // unless `options.reevaluate` is set to true ( this, for example,
    // is set to true when running `picturefill` on `resize` ).

    if (!extreme && imageData.evaled === evalId) {
      return;
    }

    if (!imageData.parsed || options.reevaluate) {
      pf.parseSets(element, element.parentNode, options);
    }

    if (!imageData.supported) {
      applyBestCandidate(element);
    } else {
      imageData.evaled = evalId;
    }
  };

  pf.setupRun = function () {
    if (!alreadyRun || isVwDirty || DPR !== window.devicePixelRatio) {
      updateMetrics();
    }
  }; // If picture is supported, well, that's awesome.


  if (pf.supPicture) {
    picturefill = noop;
    pf.fillImg = noop;
  } else {
    // Set up picture polyfill by polling the document
    (function () {
      var isDomReady;
      var regReady = window.attachEvent ? /d$|^c/ : /d$|^c|^i/;

      var run = function run() {
        var readyState = document.readyState || "";
        timerId = setTimeout(run, readyState === "loading" ? 200 : 999);

        if (document.body) {
          pf.fillImgs();
          isDomReady = isDomReady || regReady.test(readyState);

          if (isDomReady) {
            clearTimeout(timerId);
          }
        }
      };

      var timerId = setTimeout(run, document.body ? 9 : 99); // Also attach picturefill on resize and readystatechange
      // http://modernjavascript.blogspot.com/2013/08/building-better-debounce.html

      var debounce = function debounce(func, wait) {
        var timeout, timestamp;

        var later = function later() {
          var last = new Date() - timestamp;

          if (last < wait) {
            timeout = setTimeout(later, wait - last);
          } else {
            timeout = null;
            func();
          }
        };

        return function () {
          timestamp = new Date();

          if (!timeout) {
            timeout = setTimeout(later, wait);
          }
        };
      };

      var lastClientWidth = docElem.clientHeight;

      var onResize = function onResize() {
        isVwDirty = Math.max(window.innerWidth || 0, docElem.clientWidth) !== units.width || docElem.clientHeight !== lastClientWidth;
        lastClientWidth = docElem.clientHeight;

        if (isVwDirty) {
          pf.fillImgs();
        }
      };

      on(window, "resize", debounce(onResize, 99));
      on(document, "readystatechange", run);
    })();
  }

  pf.picturefill = picturefill; //use this internally for easy monkey patching/performance testing

  pf.fillImgs = picturefill;
  pf.teardownRun = noop;
  /* expose methods for testing */

  picturefill._ = pf;
  window.picturefillCFG = {
    pf: pf,
    push: function push(args) {
      var name = args.shift();

      if (typeof pf[name] === "function") {
        pf[name].apply(pf, args);
      } else {
        cfg[name] = args[0];

        if (alreadyRun) {
          pf.fillImgs({
            reselect: true
          });
        }
      }
    }
  };

  while (setOptions && setOptions.length) {
    window.picturefillCFG.push(setOptions.shift());
  }
  /* expose picturefill */


  window.picturefill = picturefill;
  /* expose picturefill */

  if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && _typeof(module.exports) === "object") {
    // CommonJS, just export
    module.exports = picturefill;
  } else if (typeof define === "function" && define.amd) {
    // AMD support
    define("picturefill", function () {
      return picturefill;
    });
  } // IE8 evals this sync, so it must be the last thing we do


  if (!pf.supPicture) {
    types["image/webp"] = detectTypeSupport("image/webp", "data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==");
  }
})(window, document);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBvbHlmaWxsLmVzNiJdLCJuYW1lcyI6WyJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJvYmplY3RGaXRJdGVtIiwib2JqZWN0Rml0SW1hZ2VzIiwiT0ZJIiwicHJvcFJlZ2V4IiwidGVzdEltZyIsIkltYWdlIiwic3R5bGUiLCJzdXBwb3J0c09iamVjdEZpdCIsInN1cHBvcnRzT2JqZWN0UG9zaXRpb24iLCJzdXBwb3J0c09GSSIsInN1cHBvcnRzQ3VycmVudFNyYyIsImN1cnJlbnRTcmMiLCJuYXRpdmVHZXRBdHRyaWJ1dGUiLCJnZXRBdHRyaWJ1dGUiLCJuYXRpdmVTZXRBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJhdXRvTW9kZUVuYWJsZWQiLCJjcmVhdGVQbGFjZWhvbGRlciIsInciLCJoIiwicG9seWZpbGxDdXJyZW50U3JjIiwiZWwiLCJzcmNzZXQiLCJ3aW5kb3ciLCJwaWN0dXJlZmlsbCIsInBmIiwiXyIsIm5zIiwiZXZhbGVkIiwiZmlsbEltZyIsInJlc2VsZWN0IiwiY3VyU3JjIiwic3VwcG9ydGVkIiwic3JjIiwiZ2V0U3R5bGUiLCJnZXRDb21wdXRlZFN0eWxlIiwiZm9udEZhbWlseSIsInBhcnNlZCIsInByb3BzIiwiZXhlYyIsInNldFBsYWNlaG9sZGVyIiwiaW1nIiwid2lkdGgiLCJoZWlnaHQiLCJwbGFjZWhvbGRlciIsImNhbGwiLCJvbkltYWdlUmVhZHkiLCJjYWxsYmFjayIsIm5hdHVyYWxXaWR0aCIsInNldFRpbWVvdXQiLCJmaXhPbmUiLCJvZmkiLCJza2lwVGVzdCIsIm5hdHVyYWxIZWlnaHQiLCJrZWVwU3JjVXNhYmxlIiwiZXJyIiwiY29uc29sZSIsIndhcm4iLCJiYWNrZ3JvdW5kSW1hZ2UiLCJyZXBsYWNlIiwiYmFja2dyb3VuZFBvc2l0aW9uIiwiYmFja2dyb3VuZFJlcGVhdCIsImJhY2tncm91bmRPcmlnaW4iLCJ0ZXN0IiwiYmFja2dyb3VuZFNpemUiLCJkZXNjcmlwdG9ycyIsImdldCIsInByb3AiLCJzZXQiLCJ2YWx1ZSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5Iiwic3MiLCJoaWphY2tBdHRyaWJ1dGVzIiwiZ2V0T2ZpSW1hZ2VNYXliZSIsIm5hbWUiLCJIVE1MSW1hZ2VFbGVtZW50IiwicHJvdG90eXBlIiwiU3RyaW5nIiwiZml4IiwiaW1ncyIsIm9wdHMiLCJzdGFydEF1dG9Nb2RlIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaSIsImxlbmd0aCIsImJvZHkiLCJlIiwidGFyZ2V0IiwidGFnTmFtZSIsIndhdGNoTVEiLCJiaW5kIiwic2VwcHVrdSIsImlzV2luZG93RGVmaW5lZCIsInRlc3ROb2RlIiwiY3JlYXRlRWxlbWVudCIsInNvbWUiLCJwcmVmaXgiLCJwb3NpdGlvbiIsImlzSW5pdGlhbGl6ZWQiLCJzaGFkb3dSb290RXhpc3RzIiwiU2hhZG93Um9vdCIsInNjcm9sbCIsInRvcCIsImxlZnQiLCJzdGlja2llcyIsImV4dGVuZCIsInRhcmdldE9iaiIsInNvdXJjZU9iamVjdCIsImtleSIsImhhc093blByb3BlcnR5IiwicGFyc2VOdW1lcmljIiwidmFsIiwicGFyc2VGbG9hdCIsImdldERvY09mZnNldFRvcCIsIm5vZGUiLCJkb2NPZmZzZXRUb3AiLCJvZmZzZXRUb3AiLCJvZmZzZXRQYXJlbnQiLCJTdGlja3kiLCJIVE1MRWxlbWVudCIsIkVycm9yIiwic3RpY2t5IiwiX25vZGUiLCJfc3RpY2t5TW9kZSIsIl9hY3RpdmUiLCJwdXNoIiwicmVmcmVzaCIsIl9yZW1vdmVkIiwiX2RlYWN0aXZhdGUiLCJub2RlQ29tcHV0ZWRTdHlsZSIsIm5vZGVDb21wdXRlZFByb3BzIiwiZGlzcGxheSIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsIm1hcmdpbkxlZnQiLCJtYXJnaW5SaWdodCIsImNzc0Zsb2F0IiwiaXNOYU4iLCJvcmlnaW5hbFBvc2l0aW9uIiwicmVmZXJlbmNlTm9kZSIsInBhcmVudE5vZGUiLCJob3N0Iiwibm9kZVdpbk9mZnNldCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInBhcmVudFdpbk9mZnNldCIsInBhcmVudENvbXB1dGVkU3R5bGUiLCJfcGFyZW50Iiwic3R5bGVzIiwib2Zmc2V0SGVpZ2h0IiwiX29mZnNldFRvV2luZG93IiwicmlnaHQiLCJkb2N1bWVudEVsZW1lbnQiLCJjbGllbnRXaWR0aCIsIl9vZmZzZXRUb1BhcmVudCIsImJvcmRlclRvcFdpZHRoIiwiYm9yZGVyTGVmdFdpZHRoIiwiYm9yZGVyUmlnaHRXaWR0aCIsIl9zdHlsZXMiLCJib3R0b20iLCJub2RlVG9wVmFsdWUiLCJfbGltaXRzIiwic3RhcnQiLCJwYWdlWU9mZnNldCIsImVuZCIsImJvcmRlckJvdHRvbVdpZHRoIiwicGFyZW50UG9zaXRpb24iLCJfcmVjYWxjUG9zaXRpb24iLCJjbG9uZSIsIl9jbG9uZSIsInBhZGRpbmciLCJib3JkZXIiLCJib3JkZXJTcGFjaW5nIiwiZm9udFNpemUiLCJpbnNlcnRCZWZvcmUiLCJzdGlja3lNb2RlIiwiTWF0aCIsImFicyIsInJlbW92ZUNoaWxkIiwiaW5kZXgiLCJzcGxpY2UiLCJTdGlja3lmaWxsIiwiZm9yY2VTdGlja3kiLCJpbml0IiwicmVmcmVzaEFsbCIsImFkZE9uZSIsImFkZCIsIm5vZGVMaXN0IiwiYWRkZWRTdGlja2llcyIsImZvckVhY2giLCJyZW1vdmVPbmUiLCJyZW1vdmUiLCJyZW1vdmVBbGwiLCJjaGVja1Njcm9sbCIsInBhZ2VYT2Zmc2V0IiwiZmFzdENoZWNrVGltZXIiLCJzdGFydEZhc3RDaGVja1RpbWVyIiwic2V0SW50ZXJ2YWwiLCJfZmFzdENoZWNrIiwic3RvcEZhc3RDaGVja1RpbWVyIiwiY2xlYXJJbnRlcnZhbCIsImRvY0hpZGRlbktleSIsInZpc2liaWxpdHlDaGFuZ2VFdmVudE5hbWUiLCJtb2R1bGUiLCJleHBvcnRzIiwidWEiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJIVE1MUGljdHVyZUVsZW1lbnQiLCJtYXRjaCIsIlJlZ0V4cCIsIiQxIiwidGltZXIiLCJkdW1teVNyYyIsImZpeFJlc3BpbWciLCJzb3VyY2UiLCJzaXplcyIsInBpY3R1cmUiLCJub2RlTmFtZSIsInRvVXBwZXJDYXNlIiwiY2xvbmVOb2RlIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJfcGZMYXN0U2l6ZSIsIm9mZnNldFdpZHRoIiwiZmluZFBpY3R1cmVJbWdzIiwib25SZXNpemUiLCJjbGVhclRpbWVvdXQiLCJtcSIsIm1hdGNoTWVkaWEiLCJhZGRMaXN0ZW5lciIsInJlYWR5U3RhdGUiLCJ1bmRlZmluZWQiLCJlbWlucHgiLCJhbHdheXNDaGVja1dEZXNjcmlwdG9yIiwiZXZhbElkIiwiaXNTdXBwb3J0VGVzdFJlYWR5Iiwibm9vcCIsImltYWdlIiwiZ2V0SW1nQXR0ciIsInNldEltZ0F0dHIiLCJyZW1vdmVJbWdBdHRyIiwicmVtb3ZlQXR0cmlidXRlIiwiZG9jRWxlbSIsInR5cGVzIiwiY2ZnIiwiYWxnb3JpdGhtIiwic3JjQXR0ciIsInNyY3NldEF0dHIiLCJzdXBwb3J0QWJvcnQiLCJjdXJTcmNQcm9wIiwicmVnV0Rlc2MiLCJyZWdTaXplIiwic2V0T3B0aW9ucyIsInBpY3R1cmVmaWxsQ0ZHIiwiYmFzZVN0eWxlIiwiZnNDc3MiLCJpc1Z3RGlydHkiLCJjc3NDYWNoZSIsInNpemVMZW5ndGhDYWNoZSIsIkRQUiIsImRldmljZVBpeGVsUmF0aW8iLCJ1bml0cyIsInB4IiwiYW5jaG9yIiwiYWxyZWFkeVJ1biIsInJlZ2V4TGVhZGluZ1NwYWNlcyIsInJlZ2V4TGVhZGluZ0NvbW1hc09yU3BhY2VzIiwicmVnZXhMZWFkaW5nTm90U3BhY2VzIiwicmVnZXhUcmFpbGluZ0NvbW1hcyIsInJlZ2V4Tm9uTmVnYXRpdmVJbnRlZ2VyIiwicmVnZXhGbG9hdGluZ1BvaW50Iiwib24iLCJvYmoiLCJldnQiLCJmbiIsImNhcHR1cmUiLCJhdHRhY2hFdmVudCIsIm1lbW9pemUiLCJjYWNoZSIsImlucHV0IiwiaXNTcGFjZSIsImMiLCJldmFsQ1NTIiwicmVnTGVuZ3RoIiwiYXJncyIsImFyZ3VtZW50cyIsInN0cmluZyIsImJ1aWxkU3RyIiwiY3NzIiwidG9Mb3dlckNhc2UiLCJwYXJzZWRMZW5ndGgiLCJGdW5jdGlvbiIsInNldFJlc29sdXRpb24iLCJjYW5kaWRhdGUiLCJzaXplc2F0dHIiLCJjV2lkdGgiLCJjYWxjTGlzdExlbmd0aCIsInJlcyIsImQiLCJvcHQiLCJlbGVtZW50cyIsInBsZW4iLCJvcHRpb25zIiwibm9kZVR5cGUiLCJjb250ZXh0IiwicXNhIiwicmVldmFsdWF0ZSIsInNlbCIsInNlbFNob3J0Iiwic2V0dXBSdW4iLCJ0ZWFyZG93blJ1biIsIm1lc3NhZ2UiLCJkZXRlY3RUeXBlU3VwcG9ydCIsInR5cGUiLCJ0eXBlVXJpIiwib25lcnJvciIsIm9ubG9hZCIsImltcGxlbWVudGF0aW9uIiwiaGFzRmVhdHVyZSIsInVwZGF0ZU1ldHJpY3MiLCJtYXgiLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJ2dyIsInZoIiwiam9pbiIsImVtIiwiZ2V0RW1WYWx1ZSIsInJlbSIsImNob29zZUxvd1JlcyIsImxvd2VyVmFsdWUiLCJoaWdoZXJWYWx1ZSIsImRwclZhbHVlIiwiaXNDYWNoZWQiLCJib251c0ZhY3RvciIsInRvb011Y2giLCJib251cyIsIm1lYW5EZW5zaXR5IiwicG93Iiwic3FydCIsImFwcGx5QmVzdENhbmRpZGF0ZSIsInNyY1NldENhbmRpZGF0ZXMiLCJtYXRjaGluZ1NldCIsImdldFNldCIsImV2YWx1YXRlZCIsInNldFJlcyIsImFwcGx5U2V0Q2FuZGlkYXRlIiwiYXNjZW5kaW5nU29ydCIsImEiLCJiIiwic2V0U3JjVG9DdXIiLCJzZXRzIiwiZ2V0Q2FuZGlkYXRlRm9yU3JjIiwibWFrZVVybCIsImN1ckNhbiIsImNhbmRpZGF0ZXMiLCJwYXJzZVNldCIsInVybCIsImdldEFsbFNvdXJjZUVsZW1lbnRzIiwibGVuIiwic291cmNlcyIsIm1lZGlhIiwicGFyc2VTcmNzZXQiLCJjb2xsZWN0Q2hhcmFjdGVycyIsInJlZ0V4IiwiY2hhcnMiLCJzdWJzdHJpbmciLCJwb3MiLCJpbnB1dExlbmd0aCIsImN1cnJlbnREZXNjcmlwdG9yIiwic3RhdGUiLCJwYXJzZURlc2NyaXB0b3JzIiwicEVycm9yIiwiZGVzYyIsImxhc3RDaGFyIiwiaW50VmFsIiwiZmxvYXRWYWwiLCJwYXJzZUludCIsImhhczF4IiwidG9rZW5pemUiLCJjaGFyQXQiLCJzbGljZSIsInBhcnNlU2l6ZXMiLCJzdHJWYWx1ZSIsInJlZ2V4Q3NzTGVuZ3RoV2l0aFVuaXRzIiwicmVnZXhDc3NDYWxjIiwidW5wYXJzZWRTaXplc0xpc3QiLCJ1bnBhcnNlZFNpemVzTGlzdExlbmd0aCIsInVucGFyc2VkU2l6ZSIsImxhc3RDb21wb25lbnRWYWx1ZSIsInNpemUiLCJwYXJzZUNvbXBvbmVudFZhbHVlcyIsInN0ciIsImNocmN0ciIsImNvbXBvbmVudCIsImNvbXBvbmVudEFycmF5IiwibGlzdEFycmF5IiwicGFyZW5EZXB0aCIsImluQ29tbWVudCIsInB1c2hDb21wb25lbnQiLCJwdXNoQ29tcG9uZW50QXJyYXkiLCJpc1ZhbGlkTm9uTmVnYXRpdmVTb3VyY2VTaXplVmFsdWUiLCJzIiwicG9wIiwibWF0Y2hlc01lZGlhIiwiRGF0ZSIsImdldFRpbWUiLCJzdWJzdHIiLCJzdXBTcmNzZXQiLCJzdXBTaXplcyIsInN1cFBpY3R1cmUiLCJpbWFnZTIiLCJjb21wbGV0ZSIsIndpZHRoMiIsIndpZHRoMSIsInUiLCJzZXRTaXplIiwiaHJlZiIsIm1hdGNoZXMiLCJtTVEiLCJhcHBseSIsImNhbGNMZW5ndGgiLCJzb3VyY2VTaXplVmFsdWUiLCJzdXBwb3J0c1R5cGUiLCJwYXJzZVNpemUiLCJzb3VyY2VTaXplU3RyIiwiY2FuZHMiLCJkaXYiLCJvcmlnaW5hbEhUTUxDU1MiLCJjc3NUZXh0Iiwib3JpZ2luYWxCb2R5Q1NTIiwiYXBwZW5kQ2hpbGQiLCJzb3VyY2VTaXplTGlzdFN0ciIsInVUIiwid2lubmluZ0xlbmd0aCIsImoiLCJiZXN0Q2FuZGlkYXRlIiwiY2FuZGlkYXRlU3JjIiwiYWJvcnRDdXJTcmMiLCJpbWFnZURhdGEiLCJkcHIiLCJjYWNoZWQiLCJzb3J0Iiwic2V0U3JjIiwib3JpZ1dpZHRoIiwicGFyc2VTZXRzIiwiZWxlbWVudCIsInBhcmVudCIsInNyY3NldEF0dHJpYnV0ZSIsImltYWdlU2V0IiwiaXNXRGVzY3JpcG9yIiwic3Jjc2V0UGFyc2VkIiwiaGFzUGljdHVyZSIsInBpYyIsImV4dHJlbWUiLCJpc0RvbVJlYWR5IiwicmVnUmVhZHkiLCJydW4iLCJ0aW1lcklkIiwiZmlsbEltZ3MiLCJkZWJvdW5jZSIsImZ1bmMiLCJ3YWl0IiwidGltZW91dCIsInRpbWVzdGFtcCIsImxhdGVyIiwibGFzdCIsImxhc3RDbGllbnRXaWR0aCIsInNoaWZ0IiwiZGVmaW5lIiwiYW1kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLFFBQVEsQ0FBQ0MsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFlBQVk7QUFDeEQ7QUFDQSxNQUFNQyxhQUFhLEdBQUcsb0JBQXRCO0FBQ0FDLEVBQUFBLGVBQWUsQ0FBQ0QsYUFBRCxDQUFmLENBSHdELENBS3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRCxDQTFCRCxFQTBCRyxLQTFCSDtBQTRCQTs7QUFDQSxJQUFJQyxlQUFlLEdBQUksWUFBWTtBQUVqQyxNQUFJQyxHQUFHLEdBQUcsNEJBQVY7QUFDQSxNQUFJQyxTQUFTLEdBQUcsa0RBQWhCO0FBQ0EsTUFBSUMsT0FBTyxHQUFHLE9BQU9DLEtBQVAsS0FBaUIsV0FBakIsR0FBK0I7QUFDM0NDLElBQUFBLEtBQUssRUFBRTtBQUNMLHlCQUFtQjtBQURkO0FBRG9DLEdBQS9CLEdBSVYsSUFBSUQsS0FBSixFQUpKO0FBS0EsTUFBSUUsaUJBQWlCLEdBQUcsZ0JBQWdCSCxPQUFPLENBQUNFLEtBQWhEO0FBQ0EsTUFBSUUsc0JBQXNCLEdBQUcscUJBQXFCSixPQUFPLENB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WjtBQUdEO0FBQ0Y7QUFDRjtBQWRxQixHQUF4Qjs7QUFpQkEsU0FBTytOLFVBQVUsSUFBSUEsVUFBVSxDQUFDdkssTUFBaEMsRUFBd0M7QUFDdEMvRCxJQUFBQSxNQUFNLENBQUN1TyxjQUFQLENBQXNCL0gsSUFBdEIsQ0FBMkI4SCxVQUFVLENBQUN5TixLQUFYLEVBQTNCO0FBQ0Q7QUFFRDs7O0FBQ0EvYixFQUFBQSxNQUFNLENBQUNDLFdBQVAsR0FBcUJBLFdBQXJCO0FBRUE7O0FBQ0EsTUFBSSxRQUFPb0wsTUFBUCx5Q0FBT0EsTUFBUCxPQUFrQixRQUFsQixJQUE4QixRQUFPQSxNQUFNLENBQUNDLE9BQWQsTUFBMEIsUUFBNUQsRUFBc0U7QUFDcEU7QUFDQUQsSUFBQUEsTUFBTSxDQUFDQyxPQUFQLEdBQWlCckwsV0FBakI7QUFDRCxHQUhELE1BR08sSUFBSSxPQUFPK2IsTUFBUCxLQUFrQixVQUFsQixJQUFnQ0EsTUFBTSxDQUFDQyxHQUEzQyxFQUFnRDtBQUNyRDtBQUNBRCxJQUFBQSxNQUFNLENBQUMsYUFBRCxFQUFnQixZQUFZO0FBQ2hDLGFBQU8vYixXQUFQO0FBQ0QsS0FGSyxDQUFOO0FBR0QsR0E5OUNxQyxDQWcrQ3RDOzs7QUFDQSxNQUFJLENBQUNDLEVBQUUsQ0FBQ21ZLFVBQVIsRUFBb0I7QUFDbEJ4SyxJQUFBQSxLQUFLLENBQUMsWUFBRCxDQUFMLEdBQXNCcUUsaUJBQWlCLENBQUMsWUFBRCxFQUFlLHlJQUFmLENBQXZDO0FBQ0Q7QUFFRixDQXIrQ0QsRUFxK0NHbFMsTUFyK0NILEVBcStDV3pCLFFBcitDWCIsInNvdXJjZXNDb250ZW50IjpbImRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gIC8vKiBbaWUgMTFdIGltZyBvYmplY3QgZml0ICogUG9seWZpbGxcbiAgY29uc3Qgb2JqZWN0Rml0SXRlbSA9ICdpbWcub2JqZWN0LWZpdC1pbWcnO1xuICBvYmplY3RGaXRJbWFnZXMob2JqZWN0Rml0SXRlbSk7XG5cbiAgLy8qIFtpZSAxMV0gcG9zaXRpb246c3RpY2t5ICogUG9seWZpbGxcbiAgLy8gY29uc3QgbXFsVyA9IHdpbmRvdy5tYXRjaE1lZGlhKCdzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDk5MXB4KScpO1xuICAvLyBjb25zdCBtcWxIID0gd2luZG93Lm1hdGNoTWVkaWEoJ3NjcmVlbiBhbmQgKG1heC1oZWlnaHQ6IDcxMHB4KScpO1xuICAvLyBjb25zdCBzdWJwYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1YnBhZ2VTaWRlJyk7XG4gIC8vIGlmIChzdWJwYWdlICE9PSBudWxsICYmIHdpbmRvdy5pbm5lcldpZHRoID4gNzY3KSB7XG4gIC8vICAgc2lkZWJhclRvZ2dsZSgpO1xuICAvLyAgIG1xbFcuYWRkTGlzdGVuZXIoc2lkZWJhclRvZ2dsZSk7XG4gIC8vICAgbXFsSC5hZGRMaXN0ZW5lcihzaWRlYmFyVG9nZ2xlKTtcbiAgLy8gfVxuXG4gIC8vIGZ1bmN0aW9uIHNpZGViYXJUb2dnbGUoKSB7XG4gIC8vICAgaWYgKG1xbFcubWF0Y2hlcyB8fCBtcWxILm1hdGNoZXMpIHtcbiAgLy8gICAgIFN0aWNreWZpbGwucmVtb3ZlKHN1YnBhZ2UpO1xuICAvLyAgICAgc3VicGFnZS5zdHlsZS5wb3NpdGlvbiA9ICdzdGF0aWMnO1xuICAvLyAgICAgc3VicGFnZS5zdHlsZS50b3AgPSAwO1xuICAvLyAgIH0gZWxzZSB7XG4gIC8vICAgICBTdGlja3lmaWxsLmFkZChzdWJwYWdlKTtcbiAgLy8gICAgIHN1YnBhZ2Uuc3R5bGUucG9zaXRpb24gPSAnJztcbiAgLy8gICAgIHN1YnBhZ2Uuc3R5bGUudG9wID0gJyc7XG4gIC8vICAgfVxuICAvLyB9XG59LCBmYWxzZSk7XG5cbi8qISBucG0uaW0vb2JqZWN0LWZpdC1pbWFnZXMgMy4yLjQgKi9cbnZhciBvYmplY3RGaXRJbWFnZXMgPSAoZnVuY3Rpb24gKCkge1xuXG4gIHZhciBPRkkgPSAnYmZyZWQtaXQ6b2JqZWN0LWZpdC1pbWFnZXMnO1xuICB2YXIgcHJvcFJlZ2V4ID0gLyhvYmplY3QtZml0fG9iamVjdC1wb3NpdGlvbilcXHMqOlxccyooWy0uXFx3XFxzJV0rKS9nO1xuICB2YXIgdGVzdEltZyA9IHR5cGVvZiBJbWFnZSA9PT0gJ3VuZGVmaW5lZCcgPyB7XG4gICAgc3R5bGU6IHtcbiAgICAgICdvYmplY3QtcG9zaXRpb24nOiAxXG4gICAgfVxuICB9IDogbmV3IEltYWdlKCk7XG4gIHZhciBzdXBwb3J0c09iamVjdEZpdCA9ICdvYmplY3QtZml0JyBpbiB0ZXN0SW1nLnN0eWxlO1xuICB2YXIgc3VwcG9ydHNPYmplY3RQb3NpdGlvbiA9ICdvYmplY3QtcG9zaXRpb24nIGluIHRlc3RJbWcuc3R5bGU7XG4gIHZhciBzdXBwb3J0c09GSSA9ICdiYWNrZ3JvdW5kLXNpemUnIGluIHRlc3RJbWcuc3R5bGU7XG4gIHZhciBzdXBwb3J0c0N1cnJlbnRTcmMgPSB0eXBlb2YgdGVzdEltZy5jdXJyZW50U3JjID09PSAnc3RyaW5nJztcbiAgdmFyIG5hdGl2ZUdldEF0dHJpYnV0ZSA9IHRlc3RJbWcuZ2V0QXR0cmlidXRlO1xuICB2YXIgbmF0aXZlU2V0QXR0cmlidXRlID0gdGVzdEltZy5zZXRBdHRyaWJ1dGU7XG4gIHZhciBhdXRvTW9kZUVuYWJsZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBjcmVhdGVQbGFjZWhvbGRlcih3LCBoKSB7XG4gICAgcmV0dXJuIChcImRhdGE6aW1hZ2Uvc3ZnK3htbCwlM0NzdmcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB3aWR0aD0nXCIgKyB3ICsgXCInIGhlaWdodD0nXCIgKyBoICsgXCInJTNFJTNDL3N2ZyUzRVwiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBvbHlmaWxsQ3VycmVudFNyYyhlbCkge1xuICAgIGlmIChlbC5zcmNzZXQgJiYgIXN1cHBvcnRzQ3VycmVudFNyYyAmJiB3aW5kb3cucGljdHVyZWZpbGwpIHtcbiAgICAgIHZhciBwZiA9IHdpbmRvdy5waWN0dXJlZmlsbC5fO1xuICAgICAgLy8gcGFyc2Ugc3Jjc2V0IHdpdGggcGljdHVyZWZpbGwgd2hlcmUgY3VycmVudFNyYyBpc24ndCBhdmFpbGFibGVcbiAgICAgIGlmICghZWxbcGYubnNdIHx8ICFlbFtwZi5uc10uZXZhbGVkKSB7XG4gICAgICAgIC8vIGZvcmNlIHN5bmNocm9ub3VzIHNyY3NldCBwYXJzaW5nXG4gICAgICAgIHBmLmZpbGxJbWcoZWwsIHtcbiAgICAgICAgICByZXNlbGVjdDogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFlbFtwZi5uc10uY3VyU3JjKSB7XG4gICAgICAgIC8vIGZvcmNlIHBpY3R1cmVmaWxsIHRvIHBhcnNlIHNyY3NldFxuICAgICAgICBlbFtwZi5uc10uc3VwcG9ydGVkID0gZmFsc2U7XG4gICAgICAgIHBmLmZpbGxJbWcoZWwsIHtcbiAgICAgICAgICByZXNlbGVjdDogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gcmV0cmlldmUgcGFyc2VkIGN1cnJlbnRTcmMsIGlmIGFueVxuICAgICAgZWwuY3VycmVudFNyYyA9IGVsW3BmLm5zXS5jdXJTcmMgfHwgZWwuc3JjO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFN0eWxlKGVsKSB7XG4gICAgdmFyIHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZm9udEZhbWlseTtcbiAgICB2YXIgcGFyc2VkO1xuICAgIHZhciBwcm9wcyA9IHt9O1xuICAgIHdoaWxlICgocGFyc2VkID0gcHJvcFJlZ2V4LmV4ZWMoc3R5bGUpKSAhPT0gbnVsbCkge1xuICAgICAgcHJvcHNbcGFyc2VkWzFdXSA9IHBhcnNlZFsyXTtcbiAgICB9XG4gICAgcmV0dXJuIHByb3BzO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0UGxhY2Vob2xkZXIoaW1nLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgLy8gRGVmYXVsdDogZmlsbCB3aWR0aCwgbm8gaGVpZ2h0XG4gICAgdmFyIHBsYWNlaG9sZGVyID0gY3JlYXRlUGxhY2Vob2xkZXIod2lkdGggfHwgMSwgaGVpZ2h0IHx8IDApO1xuXG4gICAgLy8gT25seSBzZXQgcGxhY2Vob2xkZXIgaWYgaXQncyBkaWZmZXJlbnRcbiAgICBpZiAobmF0aXZlR2V0QXR0cmlidXRlLmNhbGwoaW1nLCAnc3JjJykgIT09IHBsYWNlaG9sZGVyKSB7XG4gICAgICBuYXRpdmVTZXRBdHRyaWJ1dGUuY2FsbChpbWcsICdzcmMnLCBwbGFjZWhvbGRlcik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25JbWFnZVJlYWR5KGltZywgY2FsbGJhY2spIHtcbiAgICAvLyBuYXR1cmFsV2lkdGggaXMgb25seSBhdmFpbGFibGUgd2hlbiB0aGUgaW1hZ2UgaGVhZGVycyBhcmUgbG9hZGVkLFxuICAgIC8vIHRoaXMgbG9vcCB3aWxsIHBvbGwgaXQgZXZlcnkgMTAwbXMuXG4gICAgaWYgKGltZy5uYXR1cmFsV2lkdGgpIHtcbiAgICAgIGNhbGxiYWNrKGltZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldFRpbWVvdXQob25JbWFnZVJlYWR5LCAxMDAsIGltZywgY2FsbGJhY2spO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGZpeE9uZShlbCkge1xuICAgIHZhciBzdHlsZSA9IGdldFN0eWxlKGVsKTtcbiAgICB2YXIgb2ZpID0gZWxbT0ZJXTtcbiAgICBzdHlsZVsnb2JqZWN0LWZpdCddID0gc3R5bGVbJ29iamVjdC1maXQnXSB8fCAnZmlsbCc7IC8vIGRlZmF1bHQgdmFsdWVcblxuICAgIC8vIEF2b2lkIHJ1bm5pbmcgd2hlcmUgdW5uZWNlc3NhcnksIHVubGVzcyBPRkkgaGFkIGFscmVhZHkgZG9uZSBpdHMgZGVlZFxuICAgIGlmICghb2ZpLmltZykge1xuICAgICAgLy8gZmlsbCBpcyB0aGUgZGVmYXVsdCBiZWhhdmlvciBzbyBubyBhY3Rpb24gaXMgbmVjZXNzYXJ5XG4gICAgICBpZiAoc3R5bGVbJ29iamVjdC1maXQnXSA9PT0gJ2ZpbGwnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gV2hlcmUgb2JqZWN0LWZpdCBpcyBzdXBwb3J0ZWQgYW5kIG9iamVjdC1wb3NpdGlvbiBpc24ndCAoU2FmYXJpIDwgMTApXG4gICAgICBpZiAoXG4gICAgICAgICFvZmkuc2tpcFRlc3QgJiYgLy8gdW5sZXNzIHVzZXIgd2FudHMgdG8gYXBwbHkgcmVnYXJkbGVzcyBvZiBicm93c2VyIHN1cHBvcnRcbiAgICAgICAgc3VwcG9ydHNPYmplY3RGaXQgJiYgLy8gaWYgYnJvd3NlciBhbHJlYWR5IHN1cHBvcnRzIG9iamVjdC1maXRcbiAgICAgICAgIXN0eWxlWydvYmplY3QtcG9zaXRpb24nXSAvLyB1bmxlc3Mgb2JqZWN0LXBvc2l0aW9uIGlzIHVzZWRcbiAgICAgICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8ga2VlcCBhIGNsb25lIGluIG1lbW9yeSB3aGlsZSByZXNldHRpbmcgdGhlIG9yaWdpbmFsIHRvIGEgYmxhbmtcbiAgICBpZiAoIW9maS5pbWcpIHtcbiAgICAgIG9maS5pbWcgPSBuZXcgSW1hZ2UoZWwud2lkdGgsIGVsLmhlaWdodCk7XG4gICAgICBvZmkuaW1nLnNyY3NldCA9IG5hdGl2ZUdldEF0dHJpYnV0ZS5jYWxsKGVsLCBcImRhdGEtb2ZpLXNyY3NldFwiKSB8fCBlbC5zcmNzZXQ7XG4gICAgICBvZmkuaW1nLnNyYyA9IG5hdGl2ZUdldEF0dHJpYnV0ZS5jYWxsKGVsLCBcImRhdGEtb2ZpLXNyY1wiKSB8fCBlbC5zcmM7XG5cbiAgICAgIC8vIHByZXNlcnZlIGZvciBhbnkgZnV0dXJlIGNsb25lTm9kZSBjYWxsc1xuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2JmcmVkLWl0L29iamVjdC1maXQtaW1hZ2VzL2lzc3Vlcy81M1xuICAgICAgbmF0aXZlU2V0QXR0cmlidXRlLmNhbGwoZWwsIFwiZGF0YS1vZmktc3JjXCIsIGVsLnNyYyk7XG4gICAgICBpZiAoZWwuc3Jjc2V0KSB7XG4gICAgICAgIG5hdGl2ZVNldEF0dHJpYnV0ZS5jYWxsKGVsLCBcImRhdGEtb2ZpLXNyY3NldFwiLCBlbC5zcmNzZXQpO1xuICAgICAgfVxuXG4gICAgICBzZXRQbGFjZWhvbGRlcihlbCwgZWwubmF0dXJhbFdpZHRoIHx8IGVsLndpZHRoLCBlbC5uYXR1cmFsSGVpZ2h0IHx8IGVsLmhlaWdodCk7XG5cbiAgICAgIC8vIHJlbW92ZSBzcmNzZXQgYmVjYXVzZSBpdCBvdmVycmlkZXMgc3JjXG4gICAgICBpZiAoZWwuc3Jjc2V0KSB7XG4gICAgICAgIGVsLnNyY3NldCA9ICcnO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAga2VlcFNyY1VzYWJsZShlbCk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5jb25zb2xlKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdodHRwczovL2JpdC5seS9vZmktb2xkLWJyb3dzZXInKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHBvbHlmaWxsQ3VycmVudFNyYyhvZmkuaW1nKTtcblxuICAgIGVsLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKFxcXCJcIiArICgob2ZpLmltZy5jdXJyZW50U3JjIHx8IG9maS5pbWcuc3JjKS5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykpICsgXCJcXFwiKVwiO1xuICAgIGVsLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IHN0eWxlWydvYmplY3QtcG9zaXRpb24nXSB8fCAnY2VudGVyJztcbiAgICBlbC5zdHlsZS5iYWNrZ3JvdW5kUmVwZWF0ID0gJ25vLXJlcGVhdCc7XG4gICAgZWwuc3R5bGUuYmFja2dyb3VuZE9yaWdpbiA9ICdjb250ZW50LWJveCc7XG5cbiAgICBpZiAoL3NjYWxlLWRvd24vLnRlc3Qoc3R5bGVbJ29iamVjdC1maXQnXSkpIHtcbiAgICAgIG9uSW1hZ2VSZWFkeShvZmkuaW1nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChvZmkuaW1nLm5hdHVyYWxXaWR0aCA+IGVsLndpZHRoIHx8IG9maS5pbWcubmF0dXJhbEhlaWdodCA+IGVsLmhlaWdodCkge1xuICAgICAgICAgIGVsLnN0eWxlLmJhY2tncm91bmRTaXplID0gJ2NvbnRhaW4nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsLnN0eWxlLmJhY2tncm91bmRTaXplID0gJ2F1dG8nO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwuc3R5bGUuYmFja2dyb3VuZFNpemUgPSBzdHlsZVsnb2JqZWN0LWZpdCddLnJlcGxhY2UoJ25vbmUnLCAnYXV0bycpLnJlcGxhY2UoJ2ZpbGwnLCAnMTAwJSAxMDAlJyk7XG4gICAgfVxuXG4gICAgb25JbWFnZVJlYWR5KG9maS5pbWcsIGZ1bmN0aW9uIChpbWcpIHtcbiAgICAgIHNldFBsYWNlaG9sZGVyKGVsLCBpbWcubmF0dXJhbFdpZHRoLCBpbWcubmF0dXJhbEhlaWdodCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBrZWVwU3JjVXNhYmxlKGVsKSB7XG4gICAgdmFyIGRlc2NyaXB0b3JzID0ge1xuICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQocHJvcCkge1xuICAgICAgICByZXR1cm4gZWxbT0ZJXS5pbWdbcHJvcCA/IHByb3AgOiAnc3JjJ107XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUsIHByb3ApIHtcbiAgICAgICAgZWxbT0ZJXS5pbWdbcHJvcCA/IHByb3AgOiAnc3JjJ10gPSB2YWx1ZTtcbiAgICAgICAgbmF0aXZlU2V0QXR0cmlidXRlLmNhbGwoZWwsIChcImRhdGEtb2ZpLVwiICsgcHJvcCksIHZhbHVlKTsgLy8gcHJlc2VydmUgZm9yIGFueSBmdXR1cmUgY2xvbmVOb2RlXG4gICAgICAgIGZpeE9uZShlbCk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbCwgJ3NyYycsIGRlc2NyaXB0b3JzKTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWwsICdjdXJyZW50U3JjJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9ycy5nZXQoJ2N1cnJlbnRTcmMnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWwsICdzcmNzZXQnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3JzLmdldCgnc3Jjc2V0Jyk7XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbiAoc3MpIHtcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3JzLnNldChzcywgJ3NyY3NldCcpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaGlqYWNrQXR0cmlidXRlcygpIHtcbiAgICBmdW5jdGlvbiBnZXRPZmlJbWFnZU1heWJlKGVsLCBuYW1lKSB7XG4gICAgICByZXR1cm4gZWxbT0ZJXSAmJiBlbFtPRkldLmltZyAmJiAobmFtZSA9PT0gJ3NyYycgfHwgbmFtZSA9PT0gJ3NyY3NldCcpID8gZWxbT0ZJXS5pbWcgOiBlbDtcbiAgICB9XG4gICAgaWYgKCFzdXBwb3J0c09iamVjdFBvc2l0aW9uKSB7XG4gICAgICBIVE1MSW1hZ2VFbGVtZW50LnByb3RvdHlwZS5nZXRBdHRyaWJ1dGUgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICByZXR1cm4gbmF0aXZlR2V0QXR0cmlidXRlLmNhbGwoZ2V0T2ZpSW1hZ2VNYXliZSh0aGlzLCBuYW1lKSwgbmFtZSk7XG4gICAgICB9O1xuXG4gICAgICBIVE1MSW1hZ2VFbGVtZW50LnByb3RvdHlwZS5zZXRBdHRyaWJ1dGUgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG5hdGl2ZVNldEF0dHJpYnV0ZS5jYWxsKGdldE9maUltYWdlTWF5YmUodGhpcywgbmFtZSksIG5hbWUsIFN0cmluZyh2YWx1ZSkpO1xuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBmaXgoaW1ncywgb3B0cykge1xuICAgIHZhciBzdGFydEF1dG9Nb2RlID0gIWF1dG9Nb2RlRW5hYmxlZCAmJiAhaW1ncztcbiAgICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgICBpbWdzID0gaW1ncyB8fCAnaW1nJztcblxuICAgIGlmICgoc3VwcG9ydHNPYmplY3RQb3NpdGlvbiAmJiAhb3B0cy5za2lwVGVzdCkgfHwgIXN1cHBvcnRzT0ZJKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gdXNlIGltZ3MgYXMgYSBzZWxlY3RvciBvciBqdXN0IHNlbGVjdCBhbGwgaW1hZ2VzXG4gICAgaWYgKGltZ3MgPT09ICdpbWcnKSB7XG4gICAgICBpbWdzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2ltZycpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGltZ3MgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpbWdzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChpbWdzKTtcbiAgICB9IGVsc2UgaWYgKCEoJ2xlbmd0aCcgaW4gaW1ncykpIHtcbiAgICAgIGltZ3MgPSBbaW1nc107XG4gICAgfVxuXG4gICAgLy8gYXBwbHkgZml4IHRvIGFsbFxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW1ncy5sZW5ndGg7IGkrKykge1xuICAgICAgaW1nc1tpXVtPRkldID0gaW1nc1tpXVtPRkldIHx8IHtcbiAgICAgICAgc2tpcFRlc3Q6IG9wdHMuc2tpcFRlc3RcbiAgICAgIH07XG4gICAgICBmaXhPbmUoaW1nc1tpXSk7XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0QXV0b01vZGUpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlLnRhcmdldC50YWdOYW1lID09PSAnSU1HJykge1xuICAgICAgICAgIGZpeChlLnRhcmdldCwge1xuICAgICAgICAgICAgc2tpcFRlc3Q6IG9wdHMuc2tpcFRlc3RcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSwgdHJ1ZSk7XG4gICAgICBhdXRvTW9kZUVuYWJsZWQgPSB0cnVlO1xuICAgICAgaW1ncyA9ICdpbWcnOyAvLyByZXNldCB0byBhIGdlbmVyaWMgc2VsZWN0b3IgZm9yIHdhdGNoTVFcbiAgICB9XG5cbiAgICAvLyBpZiByZXF1ZXN0ZWQsIHdhdGNoIG1lZGlhIHF1ZXJpZXMgZm9yIG9iamVjdC1maXQgY2hhbmdlXG4gICAgaWYgKG9wdHMud2F0Y2hNUSkge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZpeC5iaW5kKG51bGwsIGltZ3MsIHtcbiAgICAgICAgc2tpcFRlc3Q6IG9wdHMuc2tpcFRlc3RcbiAgICAgIH0pKTtcbiAgICB9XG4gIH1cblxuICBmaXguc3VwcG9ydHNPYmplY3RGaXQgPSBzdXBwb3J0c09iamVjdEZpdDtcbiAgZml4LnN1cHBvcnRzT2JqZWN0UG9zaXRpb24gPSBzdXBwb3J0c09iamVjdFBvc2l0aW9uO1xuXG4gIGhpamFja0F0dHJpYnV0ZXMoKTtcblxuICByZXR1cm4gZml4O1xuXG59KCkpO1xuXG4vKiFcbiAqIFN0aWNreWZpbGwg4oCTIGBwb3NpdGlvbjogc3RpY2t5YCBwb2x5ZmlsbFxuICogdi4gMi4xLjAgfCBodHRwczovL2dpdGh1Yi5jb20vd2lsZGRlZXIvc3RpY2t5ZmlsbFxuICogTUlUIExpY2Vuc2VcbiAqL1xuXG4vKlxuICogMS4gQ2hlY2sgaWYgdGhlIGJyb3dzZXIgc3VwcG9ydHMgYHBvc2l0aW9uOiBzdGlja3lgIG5hdGl2ZWx5IG9yIGlzIHRvbyBvbGQgdG8gcnVuIHRoZSBwb2x5ZmlsbC5cbiAqICAgIElmIGVpdGhlciBvZiB0aGVzZSBpcyB0aGUgY2FzZSBzZXQgYHNlcHB1a3VgIGZsYWcuIEl0IHdpbGwgYmUgY2hlY2tlZCBsYXRlciB0byBkaXNhYmxlIGtleSBmZWF0dXJlc1xuICogICAgb2YgdGhlIHBvbHlmaWxsLCBidXQgdGhlIEFQSSB3aWxsIHJlbWFpbiBmdW5jdGlvbmFsIHRvIGF2b2lkIGJyZWFraW5nIHRoaW5ncy5cbiAqL1xubGV0IHNlcHB1a3UgPSBmYWxzZTtcblxuY29uc3QgaXNXaW5kb3dEZWZpbmVkID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XG5cbi8vIFRoZSBwb2x5ZmlsbCBjYW7igJl0IGZ1bmN0aW9uIHByb3Blcmx5IHdpdGhvdXQgYHdpbmRvd2Agb3IgYHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlYC5cbmlmICghaXNXaW5kb3dEZWZpbmVkIHx8ICF3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkgc2VwcHVrdSA9IHRydWU7XG4vLyBEb2504oCZdCBnZXQgaW4gYSB3YXkgaWYgdGhlIGJyb3dzZXIgc3VwcG9ydHMgYHBvc2l0aW9uOiBzdGlja3lgIG5hdGl2ZWx5LlxuZWxzZSB7XG4gIGNvbnN0IHRlc3ROb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgaWYgKFxuICAgIFsnJywgJy13ZWJraXQtJywgJy1tb3otJywgJy1tcy0nXS5zb21lKHByZWZpeCA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICB0ZXN0Tm9kZS5zdHlsZS5wb3NpdGlvbiA9IHByZWZpeCArICdzdGlja3knO1xuICAgICAgfSBjYXRjaCAoZSkge31cblxuICAgICAgcmV0dXJuIHRlc3ROb2RlLnN0eWxlLnBvc2l0aW9uICE9ICcnO1xuICAgIH0pXG4gICkgc2VwcHVrdSA9IHRydWU7XG59XG5cblxuLypcbiAqIDIuIOKAnEdsb2JhbOKAnSB2YXJzIHVzZWQgYWNyb3NzIHRoZSBwb2x5ZmlsbFxuICovXG5sZXQgaXNJbml0aWFsaXplZCA9IGZhbHNlO1xuXG4vLyBDaGVjayBpZiBTaGFkb3cgUm9vdCBjb25zdHJ1Y3RvciBleGlzdHMgdG8gbWFrZSBmdXJ0aGVyIGNoZWNrcyBzaW1wbGVyXG5jb25zdCBzaGFkb3dSb290RXhpc3RzID0gdHlwZW9mIFNoYWRvd1Jvb3QgIT09ICd1bmRlZmluZWQnO1xuXG4vLyBMYXN0IHNhdmVkIHNjcm9sbCBwb3NpdGlvblxuY29uc3Qgc2Nyb2xsID0ge1xuICB0b3A6IG51bGwsXG4gIGxlZnQ6IG51bGxcbn07XG5cbi8vIEFycmF5IG9mIGNyZWF0ZWQgU3RpY2t5IGluc3RhbmNlc1xuY29uc3Qgc3RpY2tpZXMgPSBbXTtcblxuXG4vKlxuICogMy4gVXRpbGl0eSBmdW5jdGlvbnNcbiAqL1xuZnVuY3Rpb24gZXh0ZW5kKHRhcmdldE9iaiwgc291cmNlT2JqZWN0KSB7XG4gIGZvciAodmFyIGtleSBpbiBzb3VyY2VPYmplY3QpIHtcbiAgICBpZiAoc291cmNlT2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHRhcmdldE9ialtrZXldID0gc291cmNlT2JqZWN0W2tleV07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlTnVtZXJpYyh2YWwpIHtcbiAgcmV0dXJuIHBhcnNlRmxvYXQodmFsKSB8fCAwO1xufVxuXG5mdW5jdGlvbiBnZXREb2NPZmZzZXRUb3Aobm9kZSkge1xuICBsZXQgZG9jT2Zmc2V0VG9wID0gMDtcblxuICB3aGlsZSAobm9kZSkge1xuICAgIGRvY09mZnNldFRvcCArPSBub2RlLm9mZnNldFRvcDtcbiAgICBub2RlID0gbm9kZS5vZmZzZXRQYXJlbnQ7XG4gIH1cblxuICByZXR1cm4gZG9jT2Zmc2V0VG9wO1xufVxuXG5cbi8qXG4gKiA0LiBTdGlja3kgY2xhc3NcbiAqL1xuY2xhc3MgU3RpY2t5IHtcbiAgY29uc3RydWN0b3Iobm9kZSkge1xuICAgIGlmICghKG5vZGUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG11c3QgYmUgSFRNTEVsZW1lbnQnKTtcbiAgICBpZiAoc3RpY2tpZXMuc29tZShzdGlja3kgPT4gc3RpY2t5Ll9ub2RlID09PSBub2RlKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignU3RpY2t5ZmlsbCBpcyBhbHJlYWR5IGFwcGxpZWQgdG8gdGhpcyBub2RlJyk7XG5cbiAgICB0aGlzLl9ub2RlID0gbm9kZTtcbiAgICB0aGlzLl9zdGlja3lNb2RlID0gbnVsbDtcbiAgICB0aGlzLl9hY3RpdmUgPSBmYWxzZTtcblxuICAgIHN0aWNraWVzLnB1c2godGhpcyk7XG5cbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgfVxuXG4gIHJlZnJlc2goKSB7XG4gICAgaWYgKHNlcHB1a3UgfHwgdGhpcy5fcmVtb3ZlZCkgcmV0dXJuO1xuICAgIGlmICh0aGlzLl9hY3RpdmUpIHRoaXMuX2RlYWN0aXZhdGUoKTtcblxuICAgIGNvbnN0IG5vZGUgPSB0aGlzLl9ub2RlO1xuXG4gICAgLypcbiAgICAgKiAxLiBTYXZlIG5vZGUgY29tcHV0ZWQgcHJvcHNcbiAgICAgKi9cbiAgICBjb25zdCBub2RlQ29tcHV0ZWRTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgY29uc3Qgbm9kZUNvbXB1dGVkUHJvcHMgPSB7XG4gICAgICBwb3NpdGlvbjogbm9kZUNvbXB1dGVkU3R5bGUucG9zaXRpb24sXG4gICAgICB0b3A6IG5vZGVDb21wdXRlZFN0eWxlLnRvcCxcbiAgICAgIGRpc3BsYXk6IG5vZGVDb21wdXRlZFN0eWxlLmRpc3BsYXksXG4gICAgICBtYXJnaW5Ub3A6IG5vZGVDb21wdXRlZFN0eWxlLm1hcmdpblRvcCxcbiAgICAgIG1hcmdpbkJvdHRvbTogbm9kZUNvbXB1dGVkU3R5bGUubWFyZ2luQm90dG9tLFxuICAgICAgbWFyZ2luTGVmdDogbm9kZUNvbXB1dGVkU3R5bGUubWFyZ2luTGVmdCxcbiAgICAgIG1hcmdpblJpZ2h0OiBub2RlQ29tcHV0ZWRTdHlsZS5tYXJnaW5SaWdodCxcbiAgICAgIGNzc0Zsb2F0OiBub2RlQ29tcHV0ZWRTdHlsZS5jc3NGbG9hdFxuICAgIH07XG5cbiAgICAvKlxuICAgICAqIDIuIENoZWNrIGlmIHRoZSBub2RlIGNhbiBiZSBhY3RpdmF0ZWRcbiAgICAgKi9cbiAgICBpZiAoXG4gICAgICBpc05hTihwYXJzZUZsb2F0KG5vZGVDb21wdXRlZFByb3BzLnRvcCkpIHx8XG4gICAgICBub2RlQ29tcHV0ZWRQcm9wcy5kaXNwbGF5ID09ICd0YWJsZS1jZWxsJyB8fFxuICAgICAgbm9kZUNvbXB1dGVkUHJvcHMuZGlzcGxheSA9PSAnbm9uZSdcbiAgICApIHJldHVybjtcblxuICAgIHRoaXMuX2FjdGl2ZSA9IHRydWU7XG5cbiAgICAvKlxuICAgICAqIDMuIENoZWNrIGlmIHRoZSBjdXJyZW50IG5vZGUgcG9zaXRpb24gaXMgYHN0aWNreWAuIElmIGl0IGlzLCBpdCBtZWFucyB0aGF0IHRoZSBicm93c2VyIHN1cHBvcnRzIHN0aWNreSBwb3NpdGlvbmluZyxcbiAgICAgKiAgICBidXQgdGhlIHBvbHlmaWxsIHdhcyBmb3JjZS1lbmFibGVkLiBXZSBzZXQgdGhlIG5vZGXigJlzIHBvc2l0aW9uIHRvIGBzdGF0aWNgIGJlZm9yZSBjb250aW51aW5nLCBzbyB0aGF0IHRoZSBub2RlXG4gICAgICogICAgaXMgaW4gaXTigJlzIGluaXRpYWwgcG9zaXRpb24gd2hlbiB3ZSBnYXRoZXIgaXRzIHBhcmFtcy5cbiAgICAgKi9cbiAgICBjb25zdCBvcmlnaW5hbFBvc2l0aW9uID0gbm9kZS5zdHlsZS5wb3NpdGlvbjtcbiAgICBpZiAobm9kZUNvbXB1dGVkU3R5bGUucG9zaXRpb24gPT0gJ3N0aWNreScgfHwgbm9kZUNvbXB1dGVkU3R5bGUucG9zaXRpb24gPT0gJy13ZWJraXQtc3RpY2t5JylcbiAgICAgIG5vZGUuc3R5bGUucG9zaXRpb24gPSAnc3RhdGljJztcblxuICAgIC8qXG4gICAgICogNC4gR2V0IG5lY2Vzc2FyeSBub2RlIHBhcmFtZXRlcnNcbiAgICAgKi9cbiAgICBjb25zdCByZWZlcmVuY2VOb2RlID0gbm9kZS5wYXJlbnROb2RlO1xuICAgIGNvbnN0IHBhcmVudE5vZGUgPSBzaGFkb3dSb290RXhpc3RzICYmIHJlZmVyZW5jZU5vZGUgaW5zdGFuY2VvZiBTaGFkb3dSb290ID8gcmVmZXJlbmNlTm9kZS5ob3N0IDogcmVmZXJlbmNlTm9kZTtcbiAgICBjb25zdCBub2RlV2luT2Zmc2V0ID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBwYXJlbnRXaW5PZmZzZXQgPSBwYXJlbnROb2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHBhcmVudENvbXB1dGVkU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKHBhcmVudE5vZGUpO1xuXG4gICAgdGhpcy5fcGFyZW50ID0ge1xuICAgICAgbm9kZTogcGFyZW50Tm9kZSxcbiAgICAgIHN0eWxlczoge1xuICAgICAgICBwb3NpdGlvbjogcGFyZW50Tm9kZS5zdHlsZS5wb3NpdGlvblxuICAgICAgfSxcbiAgICAgIG9mZnNldEhlaWdodDogcGFyZW50Tm9kZS5vZmZzZXRIZWlnaHRcbiAgICB9O1xuICAgIHRoaXMuX29mZnNldFRvV2luZG93ID0ge1xuICAgICAgbGVmdDogbm9kZVdpbk9mZnNldC5sZWZ0LFxuICAgICAgcmlnaHQ6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCAtIG5vZGVXaW5PZmZzZXQucmlnaHRcbiAgICB9O1xuICAgIHRoaXMuX29mZnNldFRvUGFyZW50ID0ge1xuICAgICAgdG9wOiBub2RlV2luT2Zmc2V0LnRvcCAtIHBhcmVudFdpbk9mZnNldC50b3AgLSBwYXJzZU51bWVyaWMocGFyZW50Q29tcHV0ZWRTdHlsZS5ib3JkZXJUb3BXaWR0aCksXG4gICAgICBsZWZ0OiBub2RlV2luT2Zmc2V0LmxlZnQgLSBwYXJlbnRXaW5PZmZzZXQubGVmdCAtIHBhcnNlTnVtZXJpYyhwYXJlbnRDb21wdXRlZFN0eWxlLmJvcmRlckxlZnRXaWR0aCksXG4gICAgICByaWdodDogLW5vZGVXaW5PZmZzZXQucmlnaHQgKyBwYXJlbnRXaW5PZmZzZXQucmlnaHQgLSBwYXJzZU51bWVyaWMocGFyZW50Q29tcHV0ZWRTdHlsZS5ib3JkZXJSaWdodFdpZHRoKVxuICAgIH07XG4gICAgdGhpcy5fc3R5bGVzID0ge1xuICAgICAgcG9zaXRpb246IG9yaWdpbmFsUG9zaXRpb24sXG4gICAgICB0b3A6IG5vZGUuc3R5bGUudG9wLFxuICAgICAgYm90dG9tOiBub2RlLnN0eWxlLmJvdHRvbSxcbiAgICAgIGxlZnQ6IG5vZGUuc3R5bGUubGVmdCxcbiAgICAgIHJpZ2h0OiBub2RlLnN0eWxlLnJpZ2h0LFxuICAgICAgd2lkdGg6IG5vZGUuc3R5bGUud2lkdGgsXG4gICAgICBtYXJnaW5Ub3A6IG5vZGUuc3R5bGUubWFyZ2luVG9wLFxuICAgICAgbWFyZ2luTGVmdDogbm9kZS5zdHlsZS5tYXJnaW5MZWZ0LFxuICAgICAgbWFyZ2luUmlnaHQ6IG5vZGUuc3R5bGUubWFyZ2luUmlnaHRcbiAgICB9O1xuXG4gICAgY29uc3Qgbm9kZVRvcFZhbHVlID0gcGFyc2VOdW1lcmljKG5vZGVDb21wdXRlZFByb3BzLnRvcCk7XG4gICAgdGhpcy5fbGltaXRzID0ge1xuICAgICAgc3RhcnQ6IG5vZGVXaW5PZmZzZXQudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0IC0gbm9kZVRvcFZhbHVlLFxuICAgICAgZW5kOiBwYXJlbnRXaW5PZmZzZXQudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0ICsgcGFyZW50Tm9kZS5vZmZzZXRIZWlnaHQgLVxuICAgICAgICBwYXJzZU51bWVyaWMocGFyZW50Q29tcHV0ZWRTdHlsZS5ib3JkZXJCb3R0b21XaWR0aCkgLSBub2RlLm9mZnNldEhlaWdodCAtXG4gICAgICAgIG5vZGVUb3BWYWx1ZSAtIHBhcnNlTnVtZXJpYyhub2RlQ29tcHV0ZWRQcm9wcy5tYXJnaW5Cb3R0b20pXG4gICAgfTtcblxuICAgIC8qXG4gICAgICogNS4gRW5zdXJlIHRoYXQgdGhlIG5vZGUgd2lsbCBiZSBwb3NpdGlvbmVkIHJlbGF0aXZlbHkgdG8gdGhlIHBhcmVudCBub2RlXG4gICAgICovXG4gICAgY29uc3QgcGFyZW50UG9zaXRpb24gPSBwYXJlbnRDb21wdXRlZFN0eWxlLnBvc2l0aW9uO1xuXG4gICAgaWYgKFxuICAgICAgcGFyZW50UG9zaXRpb24gIT0gJ2Fic29sdXRlJyAmJlxuICAgICAgcGFyZW50UG9zaXRpb24gIT0gJ3JlbGF0aXZlJ1xuICAgICkge1xuICAgICAgcGFyZW50Tm9kZS5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiA2LiBSZWNhbGMgbm9kZSBwb3NpdGlvbi5cbiAgICAgKiAgICBJdOKAmXMgaW1wb3J0YW50IHRvIGRvIHRoaXMgYmVmb3JlIGNsb25lIGluamVjdGlvbiB0byBhdm9pZCBzY3JvbGxpbmcgYnVnIGluIENocm9tZS5cbiAgICAgKi9cbiAgICB0aGlzLl9yZWNhbGNQb3NpdGlvbigpO1xuXG4gICAgLypcbiAgICAgKiA3LiBDcmVhdGUgYSBjbG9uZVxuICAgICAqL1xuICAgIGNvbnN0IGNsb25lID0gdGhpcy5fY2xvbmUgPSB7fTtcbiAgICBjbG9uZS5ub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAvLyBBcHBseSBzdHlsZXMgdG8gdGhlIGNsb25lXG4gICAgZXh0ZW5kKGNsb25lLm5vZGUuc3R5bGUsIHtcbiAgICAgIHdpZHRoOiBub2RlV2luT2Zmc2V0LnJpZ2h0IC0gbm9kZVdpbk9mZnNldC5sZWZ0ICsgJ3B4JyxcbiAgICAgIGhlaWdodDogbm9kZVdpbk9mZnNldC5ib3R0b20gLSBub2RlV2luT2Zmc2V0LnRvcCArICdweCcsXG4gICAgICBtYXJnaW5Ub3A6IG5vZGVDb21wdXRlZFByb3BzLm1hcmdpblRvcCxcbiAgICAgIG1hcmdpbkJvdHRvbTogbm9kZUNvbXB1dGVkUHJvcHMubWFyZ2luQm90dG9tLFxuICAgICAgbWFyZ2luTGVmdDogbm9kZUNvbXB1dGVkUHJvcHMubWFyZ2luTGVmdCxcbiAgICAgIG1hcmdpblJpZ2h0OiBub2RlQ29tcHV0ZWRQcm9wcy5tYXJnaW5SaWdodCxcbiAgICAgIGNzc0Zsb2F0OiBub2RlQ29tcHV0ZWRQcm9wcy5jc3NGbG9hdCxcbiAgICAgIHBhZGRpbmc6IDAsXG4gICAgICBib3JkZXI6IDAsXG4gICAgICBib3JkZXJTcGFjaW5nOiAwLFxuICAgICAgZm9udFNpemU6ICcxZW0nLFxuICAgICAgcG9zaXRpb246ICdzdGF0aWMnXG4gICAgfSk7XG5cbiAgICByZWZlcmVuY2VOb2RlLmluc2VydEJlZm9yZShjbG9uZS5ub2RlLCBub2RlKTtcbiAgICBjbG9uZS5kb2NPZmZzZXRUb3AgPSBnZXREb2NPZmZzZXRUb3AoY2xvbmUubm9kZSk7XG4gIH1cblxuICBfcmVjYWxjUG9zaXRpb24oKSB7XG4gICAgaWYgKCF0aGlzLl9hY3RpdmUgfHwgdGhpcy5fcmVtb3ZlZCkgcmV0dXJuO1xuXG4gICAgY29uc3Qgc3RpY2t5TW9kZSA9IHNjcm9sbC50b3AgPD0gdGhpcy5fbGltaXRzLnN0YXJ0ID8gJ3N0YXJ0JyA6IHNjcm9sbC50b3AgPj0gdGhpcy5fbGltaXRzLmVuZCA/ICdlbmQnIDogJ21pZGRsZSc7XG5cbiAgICBpZiAodGhpcy5fc3RpY2t5TW9kZSA9PSBzdGlja3lNb2RlKSByZXR1cm47XG5cbiAgICBzd2l0Y2ggKHN0aWNreU1vZGUpIHtcbiAgICAgIGNhc2UgJ3N0YXJ0JzpcbiAgICAgICAgZXh0ZW5kKHRoaXMuX25vZGUuc3R5bGUsIHtcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBsZWZ0OiB0aGlzLl9vZmZzZXRUb1BhcmVudC5sZWZ0ICsgJ3B4JyxcbiAgICAgICAgICByaWdodDogdGhpcy5fb2Zmc2V0VG9QYXJlbnQucmlnaHQgKyAncHgnLFxuICAgICAgICAgIHRvcDogdGhpcy5fb2Zmc2V0VG9QYXJlbnQudG9wICsgJ3B4JyxcbiAgICAgICAgICBib3R0b206ICdhdXRvJyxcbiAgICAgICAgICB3aWR0aDogJ2F1dG8nLFxuICAgICAgICAgIG1hcmdpbkxlZnQ6IDAsXG4gICAgICAgICAgbWFyZ2luUmlnaHQ6IDAsXG4gICAgICAgICAgbWFyZ2luVG9wOiAwXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnbWlkZGxlJzpcbiAgICAgICAgZXh0ZW5kKHRoaXMuX25vZGUuc3R5bGUsIHtcbiAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICBsZWZ0OiB0aGlzLl9vZmZzZXRUb1dpbmRvdy5sZWZ0ICsgJ3B4JyxcbiAgICAgICAgICByaWdodDogdGhpcy5fb2Zmc2V0VG9XaW5kb3cucmlnaHQgKyAncHgnLFxuICAgICAgICAgIHRvcDogdGhpcy5fc3R5bGVzLnRvcCxcbiAgICAgICAgICBib3R0b206ICdhdXRvJyxcbiAgICAgICAgICB3aWR0aDogJ2F1dG8nLFxuICAgICAgICAgIG1hcmdpbkxlZnQ6IDAsXG4gICAgICAgICAgbWFyZ2luUmlnaHQ6IDAsXG4gICAgICAgICAgbWFyZ2luVG9wOiAwXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnZW5kJzpcbiAgICAgICAgZXh0ZW5kKHRoaXMuX25vZGUuc3R5bGUsIHtcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBsZWZ0OiB0aGlzLl9vZmZzZXRUb1BhcmVudC5sZWZ0ICsgJ3B4JyxcbiAgICAgICAgICByaWdodDogdGhpcy5fb2Zmc2V0VG9QYXJlbnQucmlnaHQgKyAncHgnLFxuICAgICAgICAgIHRvcDogJ2F1dG8nLFxuICAgICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgICB3aWR0aDogJ2F1dG8nLFxuICAgICAgICAgIG1hcmdpbkxlZnQ6IDAsXG4gICAgICAgICAgbWFyZ2luUmlnaHQ6IDBcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMuX3N0aWNreU1vZGUgPSBzdGlja3lNb2RlO1xuICB9XG5cbiAgX2Zhc3RDaGVjaygpIHtcbiAgICBpZiAoIXRoaXMuX2FjdGl2ZSB8fCB0aGlzLl9yZW1vdmVkKSByZXR1cm47XG5cbiAgICBpZiAoXG4gICAgICBNYXRoLmFicyhnZXREb2NPZmZzZXRUb3AodGhpcy5fY2xvbmUubm9kZSkgLSB0aGlzLl9jbG9uZS5kb2NPZmZzZXRUb3ApID4gMSB8fFxuICAgICAgTWF0aC5hYnModGhpcy5fcGFyZW50Lm5vZGUub2Zmc2V0SGVpZ2h0IC0gdGhpcy5fcGFyZW50Lm9mZnNldEhlaWdodCkgPiAxXG4gICAgKSB0aGlzLnJlZnJlc2goKTtcbiAgfVxuXG4gIF9kZWFjdGl2YXRlKCkge1xuICAgIGlmICghdGhpcy5fYWN0aXZlIHx8IHRoaXMuX3JlbW92ZWQpIHJldHVybjtcblxuICAgIHRoaXMuX2Nsb25lLm5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLl9jbG9uZS5ub2RlKTtcbiAgICBkZWxldGUgdGhpcy5fY2xvbmU7XG5cbiAgICBleHRlbmQodGhpcy5fbm9kZS5zdHlsZSwgdGhpcy5fc3R5bGVzKTtcbiAgICBkZWxldGUgdGhpcy5fc3R5bGVzO1xuXG4gICAgLy8gQ2hlY2sgd2hldGhlciBlbGVtZW504oCZcyBwYXJlbnQgbm9kZSBpcyB1c2VkIGJ5IG90aGVyIHN0aWNraWVzLlxuICAgIC8vIElmIG5vdCwgcmVzdG9yZSBwYXJlbnQgbm9kZeKAmXMgc3R5bGVzLlxuICAgIGlmICghc3RpY2tpZXMuc29tZShzdGlja3kgPT4gc3RpY2t5ICE9PSB0aGlzICYmIHN0aWNreS5fcGFyZW50ICYmIHN0aWNreS5fcGFyZW50Lm5vZGUgPT09IHRoaXMuX3BhcmVudC5ub2RlKSkge1xuICAgICAgZXh0ZW5kKHRoaXMuX3BhcmVudC5ub2RlLnN0eWxlLCB0aGlzLl9wYXJlbnQuc3R5bGVzKTtcbiAgICB9XG4gICAgZGVsZXRlIHRoaXMuX3BhcmVudDtcblxuICAgIHRoaXMuX3N0aWNreU1vZGUgPSBudWxsO1xuICAgIHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xuXG4gICAgZGVsZXRlIHRoaXMuX29mZnNldFRvV2luZG93O1xuICAgIGRlbGV0ZSB0aGlzLl9vZmZzZXRUb1BhcmVudDtcbiAgICBkZWxldGUgdGhpcy5fbGltaXRzO1xuICB9XG5cbiAgcmVtb3ZlKCkge1xuICAgIHRoaXMuX2RlYWN0aXZhdGUoKTtcblxuICAgIHN0aWNraWVzLnNvbWUoKHN0aWNreSwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChzdGlja3kuX25vZGUgPT09IHRoaXMuX25vZGUpIHtcbiAgICAgICAgc3RpY2tpZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLl9yZW1vdmVkID0gdHJ1ZTtcbiAgfVxufVxuXG5cbi8qXG4gKiA1LiBTdGlja3lmaWxsIEFQSVxuICovXG5jb25zdCBTdGlja3lmaWxsID0ge1xuICBzdGlja2llcyxcbiAgU3RpY2t5LFxuXG4gIGZvcmNlU3RpY2t5KCkge1xuICAgIHNlcHB1a3UgPSBmYWxzZTtcbiAgICBpbml0KCk7XG5cbiAgICB0aGlzLnJlZnJlc2hBbGwoKTtcbiAgfSxcblxuICBhZGRPbmUobm9kZSkge1xuICAgIC8vIENoZWNrIHdoZXRoZXIgaXTigJlzIGEgbm9kZVxuICAgIGlmICghKG5vZGUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHtcbiAgICAgIC8vIE1heWJlIGl04oCZcyBhIG5vZGUgbGlzdCBvZiBzb21lIHNvcnQ/XG4gICAgICAvLyBUYWtlIGZpcnN0IG5vZGUgZnJvbSB0aGUgbGlzdCB0aGVuXG4gICAgICBpZiAobm9kZS5sZW5ndGggJiYgbm9kZVswXSkgbm9kZSA9IG5vZGVbMF07XG4gICAgICBlbHNlIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiBTdGlja3lmaWxsIGlzIGFscmVhZHkgYXBwbGllZCB0byB0aGUgbm9kZVxuICAgIC8vIGFuZCByZXR1cm4gZXhpc3Rpbmcgc3RpY2t5XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGlja2llcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHN0aWNraWVzW2ldLl9ub2RlID09PSBub2RlKSByZXR1cm4gc3RpY2tpZXNbaV07XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIGFuZCByZXR1cm4gbmV3IHN0aWNreVxuICAgIHJldHVybiBuZXcgU3RpY2t5KG5vZGUpO1xuICB9LFxuXG4gIGFkZChub2RlTGlzdCkge1xuICAgIC8vIElmIGl04oCZcyBhIG5vZGUgbWFrZSBhbiBhcnJheSBvZiBvbmUgbm9kZVxuICAgIGlmIChub2RlTGlzdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSBub2RlTGlzdCA9IFtub2RlTGlzdF07XG4gICAgLy8gQ2hlY2sgaWYgdGhlIGFyZ3VtZW50IGlzIGFuIGl0ZXJhYmxlIG9mIHNvbWUgc29ydFxuICAgIGlmICghbm9kZUxpc3QubGVuZ3RoKSByZXR1cm47XG5cbiAgICAvLyBBZGQgZXZlcnkgZWxlbWVudCBhcyBhIHN0aWNreSBhbmQgcmV0dXJuIGFuIGFycmF5IG9mIGNyZWF0ZWQgU3RpY2t5IGluc3RhbmNlc1xuICAgIGNvbnN0IGFkZGVkU3RpY2tpZXMgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG5vZGUgPSBub2RlTGlzdFtpXTtcblxuICAgICAgLy8gSWYgaXTigJlzIG5vdCBhbiBIVE1MRWxlbWVudCDigJMgY3JlYXRlIGFuIGVtcHR5IGVsZW1lbnQgdG8gcHJlc2VydmUgMS10by0xXG4gICAgICAvLyBjb3JyZWxhdGlvbiB3aXRoIGlucHV0IGxpc3RcbiAgICAgIGlmICghKG5vZGUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHtcbiAgICAgICAgYWRkZWRTdGlja2llcy5wdXNoKHZvaWQgMCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBTdGlja3lmaWxsIGlzIGFscmVhZHkgYXBwbGllZCB0byB0aGUgbm9kZVxuICAgICAgLy8gYWRkIGV4aXN0aW5nIHN0aWNreVxuICAgICAgaWYgKHN0aWNraWVzLnNvbWUoc3RpY2t5ID0+IHtcbiAgICAgICAgICBpZiAoc3RpY2t5Ll9ub2RlID09PSBub2RlKSB7XG4gICAgICAgICAgICBhZGRlZFN0aWNraWVzLnB1c2goc3RpY2t5KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkpIGNvbnRpbnVlO1xuXG4gICAgICAvLyBDcmVhdGUgYW5kIGFkZCBuZXcgc3RpY2t5XG4gICAgICBhZGRlZFN0aWNraWVzLnB1c2gobmV3IFN0aWNreShub2RlKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFkZGVkU3RpY2tpZXM7XG4gIH0sXG5cbiAgcmVmcmVzaEFsbCgpIHtcbiAgICBzdGlja2llcy5mb3JFYWNoKHN0aWNreSA9PiBzdGlja3kucmVmcmVzaCgpKTtcbiAgfSxcblxuICByZW1vdmVPbmUobm9kZSkge1xuICAgIC8vIENoZWNrIHdoZXRoZXIgaXTigJlzIGEgbm9kZVxuICAgIGlmICghKG5vZGUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHtcbiAgICAgIC8vIE1heWJlIGl04oCZcyBhIG5vZGUgbGlzdCBvZiBzb21lIHNvcnQ/XG4gICAgICAvLyBUYWtlIGZpcnN0IG5vZGUgZnJvbSB0aGUgbGlzdCB0aGVuXG4gICAgICBpZiAobm9kZS5sZW5ndGggJiYgbm9kZVswXSkgbm9kZSA9IG5vZGVbMF07XG4gICAgICBlbHNlIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgdGhlIHN0aWNraWVzIGJvdW5kIHRvIHRoZSBub2RlcyBpbiB0aGUgbGlzdFxuICAgIHN0aWNraWVzLnNvbWUoc3RpY2t5ID0+IHtcbiAgICAgIGlmIChzdGlja3kuX25vZGUgPT09IG5vZGUpIHtcbiAgICAgICAgc3RpY2t5LnJlbW92ZSgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICByZW1vdmUobm9kZUxpc3QpIHtcbiAgICAvLyBJZiBpdOKAmXMgYSBub2RlIG1ha2UgYW4gYXJyYXkgb2Ygb25lIG5vZGVcbiAgICBpZiAobm9kZUxpc3QgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkgbm9kZUxpc3QgPSBbbm9kZUxpc3RdO1xuICAgIC8vIENoZWNrIGlmIHRoZSBhcmd1bWVudCBpcyBhbiBpdGVyYWJsZSBvZiBzb21lIHNvcnRcbiAgICBpZiAoIW5vZGVMaXN0Lmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgLy8gUmVtb3ZlIHRoZSBzdGlja2llcyBib3VuZCB0byB0aGUgbm9kZXMgaW4gdGhlIGxpc3RcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBub2RlID0gbm9kZUxpc3RbaV07XG5cbiAgICAgIHN0aWNraWVzLnNvbWUoc3RpY2t5ID0+IHtcbiAgICAgICAgaWYgKHN0aWNreS5fbm9kZSA9PT0gbm9kZSkge1xuICAgICAgICAgIHN0aWNreS5yZW1vdmUoKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9LFxuXG4gIHJlbW92ZUFsbCgpIHtcbiAgICB3aGlsZSAoc3RpY2tpZXMubGVuZ3RoKSBzdGlja2llc1swXS5yZW1vdmUoKTtcbiAgfVxufTtcblxuXG4vKlxuICogNi4gU2V0dXAgZXZlbnRzICh1bmxlc3MgdGhlIHBvbHlmaWxsIHdhcyBkaXNhYmxlZClcbiAqL1xuZnVuY3Rpb24gaW5pdCgpIHtcbiAgaWYgKGlzSW5pdGlhbGl6ZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpc0luaXRpYWxpemVkID0gdHJ1ZTtcblxuICAvLyBXYXRjaCBmb3Igc2Nyb2xsIHBvc2l0aW9uIGNoYW5nZXMgYW5kIHRyaWdnZXIgcmVjYWxjL3JlZnJlc2ggaWYgbmVlZGVkXG4gIGZ1bmN0aW9uIGNoZWNrU2Nyb2xsKCkge1xuICAgIGlmICh3aW5kb3cucGFnZVhPZmZzZXQgIT0gc2Nyb2xsLmxlZnQpIHtcbiAgICAgIHNjcm9sbC50b3AgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgICBzY3JvbGwubGVmdCA9IHdpbmRvdy5wYWdlWE9mZnNldDtcblxuICAgICAgU3RpY2t5ZmlsbC5yZWZyZXNoQWxsKCk7XG4gICAgfSBlbHNlIGlmICh3aW5kb3cucGFnZVlPZmZzZXQgIT0gc2Nyb2xsLnRvcCkge1xuICAgICAgc2Nyb2xsLnRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgIHNjcm9sbC5sZWZ0ID0gd2luZG93LnBhZ2VYT2Zmc2V0O1xuXG4gICAgICAvLyByZWNhbGMgcG9zaXRpb24gZm9yIGFsbCBzdGlja2llc1xuICAgICAgc3RpY2tpZXMuZm9yRWFjaChzdGlja3kgPT4gc3RpY2t5Ll9yZWNhbGNQb3NpdGlvbigpKTtcbiAgICB9XG4gIH1cblxuICBjaGVja1Njcm9sbCgpO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgY2hlY2tTY3JvbGwpO1xuXG4gIC8vIFdhdGNoIGZvciB3aW5kb3cgcmVzaXplcyBhbmQgZGV2aWNlIG9yaWVudGF0aW9uIGNoYW5nZXMgYW5kIHRyaWdnZXIgcmVmcmVzaFxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgU3RpY2t5ZmlsbC5yZWZyZXNoQWxsKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgU3RpY2t5ZmlsbC5yZWZyZXNoQWxsKTtcblxuICAvL0Zhc3QgZGlydHkgY2hlY2sgZm9yIGxheW91dCBjaGFuZ2VzIGV2ZXJ5IDUwMG1zXG4gIGxldCBmYXN0Q2hlY2tUaW1lcjtcblxuICBmdW5jdGlvbiBzdGFydEZhc3RDaGVja1RpbWVyKCkge1xuICAgIGZhc3RDaGVja1RpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgc3RpY2tpZXMuZm9yRWFjaChzdGlja3kgPT4gc3RpY2t5Ll9mYXN0Q2hlY2soKSk7XG4gICAgfSwgNTAwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0b3BGYXN0Q2hlY2tUaW1lcigpIHtcbiAgICBjbGVhckludGVydmFsKGZhc3RDaGVja1RpbWVyKTtcbiAgfVxuXG4gIGxldCBkb2NIaWRkZW5LZXk7XG4gIGxldCB2aXNpYmlsaXR5Q2hhbmdlRXZlbnROYW1lO1xuXG4gIGlmICgnaGlkZGVuJyBpbiBkb2N1bWVudCkge1xuICAgIGRvY0hpZGRlbktleSA9ICdoaWRkZW4nO1xuICAgIHZpc2liaWxpdHlDaGFuZ2VFdmVudE5hbWUgPSAndmlzaWJpbGl0eWNoYW5nZSc7XG4gIH0gZWxzZSBpZiAoJ3dlYmtpdEhpZGRlbicgaW4gZG9jdW1lbnQpIHtcbiAgICBkb2NIaWRkZW5LZXkgPSAnd2Via2l0SGlkZGVuJztcbiAgICB2aXNpYmlsaXR5Q2hhbmdlRXZlbnROYW1lID0gJ3dlYmtpdHZpc2liaWxpdHljaGFuZ2UnO1xuICB9XG5cbiAgaWYgKHZpc2liaWxpdHlDaGFuZ2VFdmVudE5hbWUpIHtcbiAgICBpZiAoIWRvY3VtZW50W2RvY0hpZGRlbktleV0pIHN0YXJ0RmFzdENoZWNrVGltZXIoKTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIodmlzaWJpbGl0eUNoYW5nZUV2ZW50TmFtZSwgKCkgPT4ge1xuICAgICAgaWYgKGRvY3VtZW50W2RvY0hpZGRlbktleV0pIHtcbiAgICAgICAgc3RvcEZhc3RDaGVja1RpbWVyKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGFydEZhc3RDaGVja1RpbWVyKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSBzdGFydEZhc3RDaGVja1RpbWVyKCk7XG59XG5cbmlmICghc2VwcHVrdSkgaW5pdCgpO1xuXG5cbi8qXG4gKiA3LiBFeHBvc2UgU3RpY2t5ZmlsbFxuICovXG5pZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICBtb2R1bGUuZXhwb3J0cyA9IFN0aWNreWZpbGw7XG59IGVsc2UgaWYgKGlzV2luZG93RGVmaW5lZCkge1xuICB3aW5kb3cuU3RpY2t5ZmlsbCA9IFN0aWNreWZpbGw7XG59XG5cbi8qISBwaWN0dXJlZmlsbCAtIHYzLjAuMiAtIDIwMTYtMDItMTJcbiAqIGh0dHBzOi8vc2NvdHRqZWhsLmdpdGh1Yi5pby9waWN0dXJlZmlsbC9cbiAqIENvcHlyaWdodCAoYykgMjAxNiBodHRwczovL2dpdGh1Yi5jb20vc2NvdHRqZWhsL3BpY3R1cmVmaWxsL2Jsb2IvbWFzdGVyL0F1dGhvcnMudHh0OyBMaWNlbnNlZCBNSVRcbiAqL1xuLyohIEdlY2tvLVBpY3R1cmUgLSB2MS4wXG4gKiBodHRwczovL2dpdGh1Yi5jb20vc2NvdHRqZWhsL3BpY3R1cmVmaWxsL3RyZWUvMy4wL3NyYy9wbHVnaW5zL2dlY2tvLXBpY3R1cmVcbiAqIEZpcmVmb3gncyBlYXJseSBwaWN0dXJlIGltcGxlbWVudGF0aW9uIChwcmlvciB0byBGRjQxKSBpcyBzdGF0aWMgYW5kIGRvZXNcbiAqIG5vdCByZWFjdCB0byB2aWV3cG9ydCBjaGFuZ2VzLiBUaGlzIHRpbnkgbW9kdWxlIGZpeGVzIHRoaXMuXG4gKi9cbihmdW5jdGlvbiAod2luZG93KSB7XG4gIC8qanNoaW50IGVxbnVsbDp0cnVlICovXG4gIHZhciB1YSA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG5cbiAgaWYgKHdpbmRvdy5IVE1MUGljdHVyZUVsZW1lbnQgJiYgKCgvZWNrby8pLnRlc3QodWEpICYmIHVhLm1hdGNoKC9ydlxcOihcXGQrKS8pICYmIFJlZ0V4cC4kMSA8IDQ1KSkge1xuICAgIGFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0aW1lcjtcblxuICAgICAgdmFyIGR1bW15U3JjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNvdXJjZVwiKTtcblxuICAgICAgdmFyIGZpeFJlc3BpbWcgPSBmdW5jdGlvbiAoaW1nKSB7XG4gICAgICAgIHZhciBzb3VyY2UsIHNpemVzO1xuICAgICAgICB2YXIgcGljdHVyZSA9IGltZy5wYXJlbnROb2RlO1xuXG4gICAgICAgIGlmIChwaWN0dXJlLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgPT09IFwiUElDVFVSRVwiKSB7XG4gICAgICAgICAgc291cmNlID0gZHVtbXlTcmMuY2xvbmVOb2RlKCk7XG5cbiAgICAgICAgICBwaWN0dXJlLmluc2VydEJlZm9yZShzb3VyY2UsIHBpY3R1cmUuZmlyc3RFbGVtZW50Q2hpbGQpO1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcGljdHVyZS5yZW1vdmVDaGlsZChzb3VyY2UpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKCFpbWcuX3BmTGFzdFNpemUgfHwgaW1nLm9mZnNldFdpZHRoID4gaW1nLl9wZkxhc3RTaXplKSB7XG4gICAgICAgICAgaW1nLl9wZkxhc3RTaXplID0gaW1nLm9mZnNldFdpZHRoO1xuICAgICAgICAgIHNpemVzID0gaW1nLnNpemVzO1xuICAgICAgICAgIGltZy5zaXplcyArPSBcIiwxMDB2d1wiO1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaW1nLnNpemVzID0gc2l6ZXM7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHZhciBmaW5kUGljdHVyZUltZ3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIgaW1ncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJwaWN0dXJlID4gaW1nLCBpbWdbc3Jjc2V0XVtzaXplc11cIik7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBpbWdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZml4UmVzcGltZyhpbWdzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHZhciBvblJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KGZpbmRQaWN0dXJlSW1ncywgOTkpO1xuICAgICAgfTtcbiAgICAgIHZhciBtcSA9IHdpbmRvdy5tYXRjaE1lZGlhICYmIG1hdGNoTWVkaWEoXCIob3JpZW50YXRpb246IGxhbmRzY2FwZSlcIik7XG4gICAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb25SZXNpemUoKTtcblxuICAgICAgICBpZiAobXEgJiYgbXEuYWRkTGlzdGVuZXIpIHtcbiAgICAgICAgICBtcS5hZGRMaXN0ZW5lcihvblJlc2l6ZSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGR1bW15U3JjLnNyY3NldCA9IFwiZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoQVFBQkFBQUFBQ0g1QkFFS0FBRUFMQUFBQUFBQkFBRUFBQUlDVEFFQU93PT1cIjtcblxuICAgICAgaWYgKC9eW2N8aV18ZCQvLnRlc3QoZG9jdW1lbnQucmVhZHlTdGF0ZSB8fCBcIlwiKSkge1xuICAgICAgICBpbml0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBpbml0KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG9uUmVzaXplO1xuICAgIH0pKCkpO1xuICB9XG59KSh3aW5kb3cpO1xuXG4vKiEgUGljdHVyZWZpbGwgLSB2My4wLjJcbiAqIGh0dHA6Ly9zY290dGplaGwuZ2l0aHViLmlvL3BpY3R1cmVmaWxsXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUgaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0amVobC9waWN0dXJlZmlsbC9ibG9iL21hc3Rlci9BdXRob3JzLnR4dDtcbiAqICBMaWNlbnNlOiBNSVRcbiAqL1xuXG4oZnVuY3Rpb24gKHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAvLyBFbmFibGUgc3RyaWN0IG1vZGVcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLy8gSFRNTCBzaGltfHYgaXQgZm9yIG9sZCBJRSAoSUU5IHdpbGwgc3RpbGwgbmVlZCB0aGUgSFRNTCB2aWRlbyB0YWcgd29ya2Fyb3VuZClcbiAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBpY3R1cmVcIik7XG5cbiAgdmFyIHdhcm4sIGVtaW5weCwgYWx3YXlzQ2hlY2tXRGVzY3JpcHRvciwgZXZhbElkO1xuICAvLyBsb2NhbCBvYmplY3QgZm9yIG1ldGhvZCByZWZlcmVuY2VzIGFuZCB0ZXN0aW5nIGV4cG9zdXJlXG4gIHZhciBwZiA9IHt9O1xuICB2YXIgaXNTdXBwb3J0VGVzdFJlYWR5ID0gZmFsc2U7XG4gIHZhciBub29wID0gZnVuY3Rpb24gKCkge307XG4gIHZhciBpbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gIHZhciBnZXRJbWdBdHRyID0gaW1hZ2UuZ2V0QXR0cmlidXRlO1xuICB2YXIgc2V0SW1nQXR0ciA9IGltYWdlLnNldEF0dHJpYnV0ZTtcbiAgdmFyIHJlbW92ZUltZ0F0dHIgPSBpbWFnZS5yZW1vdmVBdHRyaWJ1dGU7XG4gIHZhciBkb2NFbGVtID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICB2YXIgdHlwZXMgPSB7fTtcbiAgdmFyIGNmZyA9IHtcbiAgICAvL3Jlc291cmNlIHNlbGVjdGlvbjpcbiAgICBhbGdvcml0aG06IFwiXCJcbiAgfTtcbiAgdmFyIHNyY0F0dHIgPSBcImRhdGEtcGZzcmNcIjtcbiAgdmFyIHNyY3NldEF0dHIgPSBzcmNBdHRyICsgXCJzZXRcIjtcbiAgLy8gdWEgc25pZmZpbmcgaXMgZG9uZSBmb3IgdW5kZXRlY3RhYmxlIGltZyBsb2FkaW5nIGZlYXR1cmVzLFxuICAvLyB0byBkbyBzb21lIG5vbiBjcnVjaWFsIHBlcmYgb3B0aW1pemF0aW9uc1xuICB2YXIgdWEgPSBuYXZpZ2F0b3IudXNlckFnZW50O1xuICB2YXIgc3VwcG9ydEFib3J0ID0gKC9yaWRlbnQvKS50ZXN0KHVhKSB8fCAoKC9lY2tvLykudGVzdCh1YSkgJiYgdWEubWF0Y2goL3J2XFw6KFxcZCspLykgJiYgUmVnRXhwLiQxID4gMzUpO1xuICB2YXIgY3VyU3JjUHJvcCA9IFwiY3VycmVudFNyY1wiO1xuICB2YXIgcmVnV0Rlc2MgPSAvXFxzK1xcKz9cXGQrKGVcXGQrKT93LztcbiAgdmFyIHJlZ1NpemUgPSAvKFxcKFteKV0rXFwpKT9cXHMqKC4rKS87XG4gIHZhciBzZXRPcHRpb25zID0gd2luZG93LnBpY3R1cmVmaWxsQ0ZHO1xuICAvKipcbiAgICogU2hvcnRjdXQgcHJvcGVydHkgZm9yIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby93ZWJhcHBzZWMvc3BlY3MvbWl4ZWRjb250ZW50LyNyZXN0cmljdHMtbWl4ZWQtY29udGVudCAoIGZvciBlYXN5IG92ZXJyaWRpbmcgaW4gdGVzdHMgKVxuICAgKi9cbiAgLy8gYmFzZVN0eWxlIGFsc28gdXNlZCBieSBnZXRFbVZhbHVlIChpLmUuOiB3aWR0aDogMWVtIGlzIGltcG9ydGFudClcbiAgdmFyIGJhc2VTdHlsZSA9IFwicG9zaXRpb246YWJzb2x1dGU7bGVmdDowO3Zpc2liaWxpdHk6aGlkZGVuO2Rpc3BsYXk6YmxvY2s7cGFkZGluZzowO2JvcmRlcjpub25lO2ZvbnQtc2l6ZToxZW07d2lkdGg6MWVtO292ZXJmbG93OmhpZGRlbjtjbGlwOnJlY3QoMHB4LCAwcHgsIDBweCwgMHB4KVwiO1xuICB2YXIgZnNDc3MgPSBcImZvbnQtc2l6ZToxMDAlIWltcG9ydGFudDtcIjtcbiAgdmFyIGlzVndEaXJ0eSA9IHRydWU7XG5cbiAgdmFyIGNzc0NhY2hlID0ge307XG4gIHZhciBzaXplTGVuZ3RoQ2FjaGUgPSB7fTtcbiAgdmFyIERQUiA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICB2YXIgdW5pdHMgPSB7XG4gICAgcHg6IDEsXG4gICAgXCJpblwiOiA5NlxuICB9O1xuICB2YXIgYW5jaG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gIC8qKlxuICAgKiBhbHJlYWR5UnVuIGZsYWcgdXNlZCBmb3Igc2V0T3B0aW9ucy4gaXMgaXQgdHJ1ZSBzZXRPcHRpb25zIHdpbGwgcmVldmFsdWF0ZVxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHZhciBhbHJlYWR5UnVuID0gZmFsc2U7XG5cbiAgLy8gUmV1c2FibGUsIG5vbi1cImdcIiBSZWdleGVzXG5cbiAgLy8gKERvbid0IHVzZSBcXHMsIHRvIGF2b2lkIG1hdGNoaW5nIG5vbi1icmVha2luZyBzcGFjZS4pXG4gIHZhciByZWdleExlYWRpbmdTcGFjZXMgPSAvXlsgXFx0XFxuXFxyXFx1MDAwY10rLyxcbiAgICByZWdleExlYWRpbmdDb21tYXNPclNwYWNlcyA9IC9eWywgXFx0XFxuXFxyXFx1MDAwY10rLyxcbiAgICByZWdleExlYWRpbmdOb3RTcGFjZXMgPSAvXlteIFxcdFxcblxcclxcdTAwMGNdKy8sXG4gICAgcmVnZXhUcmFpbGluZ0NvbW1hcyA9IC9bLF0rJC8sXG4gICAgcmVnZXhOb25OZWdhdGl2ZUludGVnZXIgPSAvXlxcZCskLyxcblxuICAgIC8vICggUG9zaXRpdmUgb3IgbmVnYXRpdmUgb3IgdW5zaWduZWQgaW50ZWdlcnMgb3IgZGVjaW1hbHMsIHdpdGhvdXQgb3Igd2l0aG91dCBleHBvbmVudHMuXG4gICAgLy8gTXVzdCBpbmNsdWRlIGF0IGxlYXN0IG9uZSBkaWdpdC5cbiAgICAvLyBBY2NvcmRpbmcgdG8gc3BlYyB0ZXN0cyBhbnkgZGVjaW1hbCBwb2ludCBtdXN0IGJlIGZvbGxvd2VkIGJ5IGEgZGlnaXQuXG4gICAgLy8gTm8gbGVhZGluZyBwbHVzIHNpZ24gaXMgYWxsb3dlZC4pXG4gICAgLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvaW5mcmFzdHJ1Y3R1cmUuaHRtbCN2YWxpZC1mbG9hdGluZy1wb2ludC1udW1iZXJcbiAgICByZWdleEZsb2F0aW5nUG9pbnQgPSAvXi0/KD86WzAtOV0rfFswLTldKlxcLlswLTldKykoPzpbZUVdWystXT9bMC05XSspPyQvO1xuXG4gIHZhciBvbiA9IGZ1bmN0aW9uIChvYmosIGV2dCwgZm4sIGNhcHR1cmUpIHtcbiAgICBpZiAob2JqLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIG9iai5hZGRFdmVudExpc3RlbmVyKGV2dCwgZm4sIGNhcHR1cmUgfHwgZmFsc2UpO1xuICAgIH0gZWxzZSBpZiAob2JqLmF0dGFjaEV2ZW50KSB7XG4gICAgICBvYmouYXR0YWNoRXZlbnQoXCJvblwiICsgZXZ0LCBmbik7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBzaW1wbGUgbWVtb2l6ZSBmdW5jdGlvbjpcbiAgICovXG5cbiAgdmFyIG1lbW9pemUgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICB2YXIgY2FjaGUgPSB7fTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICBpZiAoIShpbnB1dCBpbiBjYWNoZSkpIHtcbiAgICAgICAgY2FjaGVbaW5wdXRdID0gZm4oaW5wdXQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNhY2hlW2lucHV0XTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFVUSUxJVFkgRlVOQ1RJT05TXG5cbiAgLy8gTWFudWFsIGlzIGZhc3RlciB0aGFuIFJlZ0V4XG4gIC8vIGh0dHA6Ly9qc3BlcmYuY29tL3doaXRlc3BhY2UtY2hhcmFjdGVyLzVcbiAgZnVuY3Rpb24gaXNTcGFjZShjKSB7XG4gICAgcmV0dXJuIChjID09PSBcIlxcdTAwMjBcIiB8fCAvLyBzcGFjZVxuICAgICAgYyA9PT0gXCJcXHUwMDA5XCIgfHwgLy8gaG9yaXpvbnRhbCB0YWJcbiAgICAgIGMgPT09IFwiXFx1MDAwQVwiIHx8IC8vIG5ldyBsaW5lXG4gICAgICBjID09PSBcIlxcdTAwMENcIiB8fCAvLyBmb3JtIGZlZWRcbiAgICAgIGMgPT09IFwiXFx1MDAwRFwiKTsgLy8gY2FycmlhZ2UgcmV0dXJuXG4gIH1cblxuICAvKipcbiAgICogZ2V0cyBhIG1lZGlhcXVlcnkgYW5kIHJldHVybnMgYSBib29sZWFuIG9yIGdldHMgYSBjc3MgbGVuZ3RoIGFuZCByZXR1cm5zIGEgbnVtYmVyXG4gICAqIEBwYXJhbSBjc3MgbWVkaWFxdWVyaWVzIG9yIGNzcyBsZW5ndGhcbiAgICogQHJldHVybnMge2Jvb2xlYW58bnVtYmVyfVxuICAgKlxuICAgKiBiYXNlZCBvbjogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vam9uYXRoYW50bmVhbC9kYjRmNzcwMDliMTU1ZjA4MzczOFxuICAgKi9cbiAgdmFyIGV2YWxDU1MgPSAoZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIHJlZ0xlbmd0aCA9IC9eKFtcXGRcXC5dKykoZW18dnd8cHgpJC87XG4gICAgdmFyIHJlcGxhY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgaW5kZXggPSAwLFxuICAgICAgICBzdHJpbmcgPSBhcmdzWzBdO1xuICAgICAgd2hpbGUgKCsraW5kZXggaW4gYXJncykge1xuICAgICAgICBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZShhcmdzW2luZGV4XSwgYXJnc1srK2luZGV4XSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RyaW5nO1xuICAgIH07XG5cbiAgICB2YXIgYnVpbGRTdHIgPSBtZW1vaXplKGZ1bmN0aW9uIChjc3MpIHtcblxuICAgICAgcmV0dXJuIFwicmV0dXJuIFwiICsgcmVwbGFjZSgoY3NzIHx8IFwiXCIpLnRvTG93ZXJDYXNlKCksXG4gICAgICAgIC8vIGludGVycHJldCBgYW5kYFxuICAgICAgICAvXFxiYW5kXFxiL2csIFwiJiZcIixcblxuICAgICAgICAvLyBpbnRlcnByZXQgYCxgXG4gICAgICAgIC8sL2csIFwifHxcIixcblxuICAgICAgICAvLyBpbnRlcnByZXQgYG1pbi1gIGFzID49XG4gICAgICAgIC9taW4tKFthLXotXFxzXSspOi9nLCBcImUuJDE+PVwiLFxuXG4gICAgICAgIC8vIGludGVycHJldCBgbWF4LWAgYXMgPD1cbiAgICAgICAgL21heC0oW2Etei1cXHNdKyk6L2csIFwiZS4kMTw9XCIsXG5cbiAgICAgICAgLy9jYWxjIHZhbHVlXG4gICAgICAgIC9jYWxjKFteKV0rKS9nLCBcIigkMSlcIixcblxuICAgICAgICAvLyBpbnRlcnByZXQgY3NzIHZhbHVlc1xuICAgICAgICAvKFxcZCtbXFwuXSpbXFxkXSopKFthLXpdKykvZywgXCIoJDEgKiBlLiQyKVwiLFxuICAgICAgICAvL21ha2UgZXZhbCBsZXNzIGV2aWxcbiAgICAgICAgL14oPyEoZS5bYS16XXxbMC05XFwuJj18PjxcXCtcXC1cXCpcXChcXClcXC9dKSkuKi9pZywgXCJcIlxuICAgICAgKSArIFwiO1wiO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChjc3MsIGxlbmd0aCkge1xuICAgICAgdmFyIHBhcnNlZExlbmd0aDtcbiAgICAgIGlmICghKGNzcyBpbiBjc3NDYWNoZSkpIHtcbiAgICAgICAgY3NzQ2FjaGVbY3NzXSA9IGZhbHNlO1xuICAgICAgICBpZiAobGVuZ3RoICYmIChwYXJzZWRMZW5ndGggPSBjc3MubWF0Y2gocmVnTGVuZ3RoKSkpIHtcbiAgICAgICAgICBjc3NDYWNoZVtjc3NdID0gcGFyc2VkTGVuZ3RoWzFdICogdW5pdHNbcGFyc2VkTGVuZ3RoWzJdXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvKmpzaGludCBldmlsOnRydWUgKi9cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY3NzQ2FjaGVbY3NzXSA9IG5ldyBGdW5jdGlvbihcImVcIiwgYnVpbGRTdHIoY3NzKSkodW5pdHMpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgICAgLypqc2hpbnQgZXZpbDpmYWxzZSAqL1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gY3NzQ2FjaGVbY3NzXTtcbiAgICB9O1xuICB9KSgpO1xuXG4gIHZhciBzZXRSZXNvbHV0aW9uID0gZnVuY3Rpb24gKGNhbmRpZGF0ZSwgc2l6ZXNhdHRyKSB7XG4gICAgaWYgKGNhbmRpZGF0ZS53KSB7IC8vIGggPSBtZWFucyBoZWlnaHQ6IHx8IGRlc2NyaXB0b3IudHlwZSA9PT0gJ2gnIGRvIG5vdCBoYW5kbGUgeWV0Li4uXG4gICAgICBjYW5kaWRhdGUuY1dpZHRoID0gcGYuY2FsY0xpc3RMZW5ndGgoc2l6ZXNhdHRyIHx8IFwiMTAwdndcIik7XG4gICAgICBjYW5kaWRhdGUucmVzID0gY2FuZGlkYXRlLncgLyBjYW5kaWRhdGUuY1dpZHRoO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYW5kaWRhdGUucmVzID0gY2FuZGlkYXRlLmQ7XG4gICAgfVxuICAgIHJldHVybiBjYW5kaWRhdGU7XG4gIH07XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBvcHRcbiAgICovXG4gIHZhciBwaWN0dXJlZmlsbCA9IGZ1bmN0aW9uIChvcHQpIHtcblxuICAgIGlmICghaXNTdXBwb3J0VGVzdFJlYWR5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGVsZW1lbnRzLCBpLCBwbGVuO1xuXG4gICAgdmFyIG9wdGlvbnMgPSBvcHQgfHwge307XG5cbiAgICBpZiAob3B0aW9ucy5lbGVtZW50cyAmJiBvcHRpb25zLmVsZW1lbnRzLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICBpZiAob3B0aW9ucy5lbGVtZW50cy5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpID09PSBcIklNR1wiKSB7XG4gICAgICAgIG9wdGlvbnMuZWxlbWVudHMgPSBbb3B0aW9ucy5lbGVtZW50c107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHRpb25zLmNvbnRleHQgPSBvcHRpb25zLmVsZW1lbnRzO1xuICAgICAgICBvcHRpb25zLmVsZW1lbnRzID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbGVtZW50cyA9IG9wdGlvbnMuZWxlbWVudHMgfHwgcGYucXNhKChvcHRpb25zLmNvbnRleHQgfHwgZG9jdW1lbnQpLCAob3B0aW9ucy5yZWV2YWx1YXRlIHx8IG9wdGlvbnMucmVzZWxlY3QpID8gcGYuc2VsIDogcGYuc2VsU2hvcnQpO1xuXG4gICAgaWYgKChwbGVuID0gZWxlbWVudHMubGVuZ3RoKSkge1xuXG4gICAgICBwZi5zZXR1cFJ1bihvcHRpb25zKTtcbiAgICAgIGFscmVhZHlSdW4gPSB0cnVlO1xuXG4gICAgICAvLyBMb29wIHRocm91Z2ggYWxsIGVsZW1lbnRzXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgcGxlbjsgaSsrKSB7XG4gICAgICAgIHBmLmZpbGxJbWcoZWxlbWVudHNbaV0sIG9wdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICBwZi50ZWFyZG93blJ1bihvcHRpb25zKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIG91dHB1dHMgYSB3YXJuaW5nIGZvciB0aGUgZGV2ZWxvcGVyXG4gICAqIEBwYXJhbSB7bWVzc2FnZX1cbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgd2FybiA9ICh3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLndhcm4pID9cbiAgICBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgY29uc29sZS53YXJuKG1lc3NhZ2UpO1xuICAgIH0gOlxuICAgIG5vb3A7XG5cbiAgaWYgKCEoY3VyU3JjUHJvcCBpbiBpbWFnZSkpIHtcbiAgICBjdXJTcmNQcm9wID0gXCJzcmNcIjtcbiAgfVxuXG4gIC8vIEFkZCBzdXBwb3J0IGZvciBzdGFuZGFyZCBtaW1lIHR5cGVzLlxuICB0eXBlc1tcImltYWdlL2pwZWdcIl0gPSB0cnVlO1xuICB0eXBlc1tcImltYWdlL2dpZlwiXSA9IHRydWU7XG4gIHR5cGVzW1wiaW1hZ2UvcG5nXCJdID0gdHJ1ZTtcblxuICBmdW5jdGlvbiBkZXRlY3RUeXBlU3VwcG9ydCh0eXBlLCB0eXBlVXJpKSB7XG4gICAgLy8gYmFzZWQgb24gTW9kZXJuaXpyJ3MgbG9zc2xlc3MgaW1nLXdlYnAgdGVzdFxuICAgIC8vIG5vdGU6IGFzeW5jaHJvbm91c1xuICAgIHZhciBpbWFnZSA9IG5ldyB3aW5kb3cuSW1hZ2UoKTtcbiAgICBpbWFnZS5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgdHlwZXNbdHlwZV0gPSBmYWxzZTtcbiAgICAgIHBpY3R1cmVmaWxsKCk7XG4gICAgfTtcbiAgICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0eXBlc1t0eXBlXSA9IGltYWdlLndpZHRoID09PSAxO1xuICAgICAgcGljdHVyZWZpbGwoKTtcbiAgICB9O1xuICAgIGltYWdlLnNyYyA9IHR5cGVVcmk7XG4gICAgcmV0dXJuIFwicGVuZGluZ1wiO1xuICB9XG5cbiAgLy8gdGVzdCBzdmcgc3VwcG9ydFxuICB0eXBlc1tcImltYWdlL3N2Zyt4bWxcIl0gPSBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5oYXNGZWF0dXJlKFwiaHR0cDovL3d3dy53My5vcmcvVFIvU1ZHMTEvZmVhdHVyZSNJbWFnZVwiLCBcIjEuMVwiKTtcblxuICAvKipcbiAgICogdXBkYXRlcyB0aGUgaW50ZXJuYWwgdlcgcHJvcGVydHkgd2l0aCB0aGUgY3VycmVudCB2aWV3cG9ydCB3aWR0aCBpbiBweFxuICAgKi9cbiAgZnVuY3Rpb24gdXBkYXRlTWV0cmljcygpIHtcblxuICAgIGlzVndEaXJ0eSA9IGZhbHNlO1xuICAgIERQUiA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgIGNzc0NhY2hlID0ge307XG4gICAgc2l6ZUxlbmd0aENhY2hlID0ge307XG5cbiAgICBwZi5EUFIgPSBEUFIgfHwgMTtcblxuICAgIHVuaXRzLndpZHRoID0gTWF0aC5tYXgod2luZG93LmlubmVyV2lkdGggfHwgMCwgZG9jRWxlbS5jbGllbnRXaWR0aCk7XG4gICAgdW5pdHMuaGVpZ2h0ID0gTWF0aC5tYXgod2luZG93LmlubmVySGVpZ2h0IHx8IDAsIGRvY0VsZW0uY2xpZW50SGVpZ2h0KTtcblxuICAgIHVuaXRzLnZ3ID0gdW5pdHMud2lkdGggLyAxMDA7XG4gICAgdW5pdHMudmggPSB1bml0cy5oZWlnaHQgLyAxMDA7XG5cbiAgICBldmFsSWQgPSBbdW5pdHMuaGVpZ2h0LCB1bml0cy53aWR0aCwgRFBSXS5qb2luKFwiLVwiKTtcblxuICAgIHVuaXRzLmVtID0gcGYuZ2V0RW1WYWx1ZSgpO1xuICAgIHVuaXRzLnJlbSA9IHVuaXRzLmVtO1xuICB9XG5cbiAgZnVuY3Rpb24gY2hvb3NlTG93UmVzKGxvd2VyVmFsdWUsIGhpZ2hlclZhbHVlLCBkcHJWYWx1ZSwgaXNDYWNoZWQpIHtcbiAgICB2YXIgYm9udXNGYWN0b3IsIHRvb011Y2gsIGJvbnVzLCBtZWFuRGVuc2l0eTtcblxuICAgIC8vZXhwZXJpbWVudGFsXG4gICAgaWYgKGNmZy5hbGdvcml0aG0gPT09IFwic2F2ZURhdGFcIikge1xuICAgICAgaWYgKGxvd2VyVmFsdWUgPiAyLjcpIHtcbiAgICAgICAgbWVhbkRlbnNpdHkgPSBkcHJWYWx1ZSArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b29NdWNoID0gaGlnaGVyVmFsdWUgLSBkcHJWYWx1ZTtcbiAgICAgICAgYm9udXNGYWN0b3IgPSBNYXRoLnBvdyhsb3dlclZhbHVlIC0gMC42LCAxLjUpO1xuXG4gICAgICAgIGJvbnVzID0gdG9vTXVjaCAqIGJvbnVzRmFjdG9yO1xuXG4gICAgICAgIGlmIChpc0NhY2hlZCkge1xuICAgICAgICAgIGJvbnVzICs9IDAuMSAqIGJvbnVzRmFjdG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgbWVhbkRlbnNpdHkgPSBsb3dlclZhbHVlICsgYm9udXM7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG1lYW5EZW5zaXR5ID0gKGRwclZhbHVlID4gMSkgP1xuICAgICAgICBNYXRoLnNxcnQobG93ZXJWYWx1ZSAqIGhpZ2hlclZhbHVlKSA6XG4gICAgICAgIGxvd2VyVmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lYW5EZW5zaXR5ID4gZHByVmFsdWU7XG4gIH1cblxuICBmdW5jdGlvbiBhcHBseUJlc3RDYW5kaWRhdGUoaW1nKSB7XG4gICAgdmFyIHNyY1NldENhbmRpZGF0ZXM7XG4gICAgdmFyIG1hdGNoaW5nU2V0ID0gcGYuZ2V0U2V0KGltZyk7XG4gICAgdmFyIGV2YWx1YXRlZCA9IGZhbHNlO1xuICAgIGlmIChtYXRjaGluZ1NldCAhPT0gXCJwZW5kaW5nXCIpIHtcbiAgICAgIGV2YWx1YXRlZCA9IGV2YWxJZDtcbiAgICAgIGlmIChtYXRjaGluZ1NldCkge1xuICAgICAgICBzcmNTZXRDYW5kaWRhdGVzID0gcGYuc2V0UmVzKG1hdGNoaW5nU2V0KTtcbiAgICAgICAgcGYuYXBwbHlTZXRDYW5kaWRhdGUoc3JjU2V0Q2FuZGlkYXRlcywgaW1nKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaW1nW3BmLm5zXS5ldmFsZWQgPSBldmFsdWF0ZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBhc2NlbmRpbmdTb3J0KGEsIGIpIHtcbiAgICByZXR1cm4gYS5yZXMgLSBiLnJlcztcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFNyY1RvQ3VyKGltZywgc3JjLCBzZXQpIHtcbiAgICB2YXIgY2FuZGlkYXRlO1xuICAgIGlmICghc2V0ICYmIHNyYykge1xuICAgICAgc2V0ID0gaW1nW3BmLm5zXS5zZXRzO1xuICAgICAgc2V0ID0gc2V0ICYmIHNldFtzZXQubGVuZ3RoIC0gMV07XG4gICAgfVxuXG4gICAgY2FuZGlkYXRlID0gZ2V0Q2FuZGlkYXRlRm9yU3JjKHNyYywgc2V0KTtcblxuICAgIGlmIChjYW5kaWRhdGUpIHtcbiAgICAgIHNyYyA9IHBmLm1ha2VVcmwoc3JjKTtcbiAgICAgIGltZ1twZi5uc10uY3VyU3JjID0gc3JjO1xuICAgICAgaW1nW3BmLm5zXS5jdXJDYW4gPSBjYW5kaWRhdGU7XG5cbiAgICAgIGlmICghY2FuZGlkYXRlLnJlcykge1xuICAgICAgICBzZXRSZXNvbHV0aW9uKGNhbmRpZGF0ZSwgY2FuZGlkYXRlLnNldC5zaXplcyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjYW5kaWRhdGU7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDYW5kaWRhdGVGb3JTcmMoc3JjLCBzZXQpIHtcbiAgICB2YXIgaSwgY2FuZGlkYXRlLCBjYW5kaWRhdGVzO1xuICAgIGlmIChzcmMgJiYgc2V0KSB7XG4gICAgICBjYW5kaWRhdGVzID0gcGYucGFyc2VTZXQoc2V0KTtcbiAgICAgIHNyYyA9IHBmLm1ha2VVcmwoc3JjKTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBjYW5kaWRhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChzcmMgPT09IHBmLm1ha2VVcmwoY2FuZGlkYXRlc1tpXS51cmwpKSB7XG4gICAgICAgICAgY2FuZGlkYXRlID0gY2FuZGlkYXRlc1tpXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY2FuZGlkYXRlO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QWxsU291cmNlRWxlbWVudHMocGljdHVyZSwgY2FuZGlkYXRlcykge1xuICAgIHZhciBpLCBsZW4sIHNvdXJjZSwgc3Jjc2V0O1xuXG4gICAgLy8gU1BFQyBtaXNtYXRjaCBpbnRlbmRlZCBmb3Igc2l6ZSBhbmQgcGVyZjpcbiAgICAvLyBhY3R1YWxseSBvbmx5IHNvdXJjZSBlbGVtZW50cyBwcmVjZWRpbmcgdGhlIGltZyBzaG91bGQgYmUgdXNlZFxuICAgIC8vIGFsc28gbm90ZTogZG9uJ3QgdXNlIHFzYSBoZXJlLCBiZWNhdXNlIElFOCBzb21ldGltZXMgZG9lc24ndCBsaWtlIHNvdXJjZSBhcyB0aGUga2V5IHBhcnQgaW4gYSBzZWxlY3RvclxuICAgIHZhciBzb3VyY2VzID0gcGljdHVyZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNvdXJjZVwiKTtcblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IHNvdXJjZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHNvdXJjZSA9IHNvdXJjZXNbaV07XG4gICAgICBzb3VyY2VbcGYubnNdID0gdHJ1ZTtcbiAgICAgIHNyY3NldCA9IHNvdXJjZS5nZXRBdHRyaWJ1dGUoXCJzcmNzZXRcIik7XG5cbiAgICAgIC8vIGlmIHNvdXJjZSBkb2VzIG5vdCBoYXZlIGEgc3Jjc2V0IGF0dHJpYnV0ZSwgc2tpcFxuICAgICAgaWYgKHNyY3NldCkge1xuICAgICAgICBjYW5kaWRhdGVzLnB1c2goe1xuICAgICAgICAgIHNyY3NldDogc3Jjc2V0LFxuICAgICAgICAgIG1lZGlhOiBzb3VyY2UuZ2V0QXR0cmlidXRlKFwibWVkaWFcIiksXG4gICAgICAgICAgdHlwZTogc291cmNlLmdldEF0dHJpYnV0ZShcInR5cGVcIiksXG4gICAgICAgICAgc2l6ZXM6IHNvdXJjZS5nZXRBdHRyaWJ1dGUoXCJzaXplc1wiKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3Jjc2V0IFBhcnNlclxuICAgKiBCeSBBbGV4IEJlbGwgfCAgTUlUIExpY2Vuc2VcbiAgICpcbiAgICogQHJldHVybnMgQXJyYXkgW3t1cmw6IF8sIGQ6IF8sIHc6IF8sIGg6Xywgc2V0Ol8oPz8/Pyl9LCAuLi5dXG4gICAqXG4gICAqIEJhc2VkIHN1cGVyIGR1cGVyIGNsb3NlbHkgb24gdGhlIHJlZmVyZW5jZSBhbGdvcml0aG0gYXQ6XG4gICAqIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2VtYmVkZGVkLWNvbnRlbnQuaHRtbCNwYXJzZS1hLXNyY3NldC1hdHRyaWJ1dGVcbiAgICovXG5cbiAgLy8gMS4gTGV0IGlucHV0IGJlIHRoZSB2YWx1ZSBwYXNzZWQgdG8gdGhpcyBhbGdvcml0aG0uXG4gIC8vIChUTy1ETyA6IEV4cGxhaW4gd2hhdCBcInNldFwiIGFyZ3VtZW50IGlzIGhlcmUuIE1heWJlIGNob29zZSBhIG1vcmVcbiAgLy8gZGVzY3JpcHRpdmUgJiBtb3JlIHNlYXJjaGFibGUgbmFtZS4gIFNpbmNlIHBhc3NpbmcgdGhlIFwic2V0XCIgaW4gcmVhbGx5IGhhc1xuICAvLyBub3RoaW5nIHRvIGRvIHdpdGggcGFyc2luZyBwcm9wZXIsIEkgd291bGQgcHJlZmVyIHRoaXMgYXNzaWdubWVudCBldmVudHVhbGx5XG4gIC8vIGdvIGluIGFuIGV4dGVybmFsIGZuLilcbiAgZnVuY3Rpb24gcGFyc2VTcmNzZXQoaW5wdXQsIHNldCkge1xuXG4gICAgZnVuY3Rpb24gY29sbGVjdENoYXJhY3RlcnMocmVnRXgpIHtcbiAgICAgIHZhciBjaGFycyxcbiAgICAgICAgbWF0Y2ggPSByZWdFeC5leGVjKGlucHV0LnN1YnN0cmluZyhwb3MpKTtcbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICBjaGFycyA9IG1hdGNoWzBdO1xuICAgICAgICBwb3MgKz0gY2hhcnMubGVuZ3RoO1xuICAgICAgICByZXR1cm4gY2hhcnM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGlucHV0TGVuZ3RoID0gaW5wdXQubGVuZ3RoLFxuICAgICAgdXJsLFxuICAgICAgZGVzY3JpcHRvcnMsXG4gICAgICBjdXJyZW50RGVzY3JpcHRvcixcbiAgICAgIHN0YXRlLFxuICAgICAgYyxcblxuICAgICAgLy8gMi4gTGV0IHBvc2l0aW9uIGJlIGEgcG9pbnRlciBpbnRvIGlucHV0LCBpbml0aWFsbHkgcG9pbnRpbmcgYXQgdGhlIHN0YXJ0XG4gICAgICAvLyAgICBvZiB0aGUgc3RyaW5nLlxuICAgICAgcG9zID0gMCxcblxuICAgICAgLy8gMy4gTGV0IGNhbmRpZGF0ZXMgYmUgYW4gaW5pdGlhbGx5IGVtcHR5IHNvdXJjZSBzZXQuXG4gICAgICBjYW5kaWRhdGVzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGRlc2NyaXB0b3IgcHJvcGVydGllcyB0byBhIGNhbmRpZGF0ZSwgcHVzaGVzIHRvIHRoZSBjYW5kaWRhdGVzIGFycmF5XG4gICAgICogQHJldHVybiB1bmRlZmluZWRcbiAgICAgKi9cbiAgICAvLyAoRGVjbGFyZWQgb3V0c2lkZSBvZiB0aGUgd2hpbGUgbG9vcCBzbyB0aGF0IGl0J3Mgb25seSBjcmVhdGVkIG9uY2UuXG4gICAgLy8gKFRoaXMgZm4gaXMgZGVmaW5lZCBiZWZvcmUgaXQgaXMgdXNlZCwgaW4gb3JkZXIgdG8gcGFzcyBKU0hJTlQuXG4gICAgLy8gVW5mb3J0dW5hdGVseSB0aGlzIGJyZWFrcyB0aGUgc2VxdWVuY2luZyBvZiB0aGUgc3BlYyBjb21tZW50cy4gOi8gKVxuICAgIGZ1bmN0aW9uIHBhcnNlRGVzY3JpcHRvcnMoKSB7XG5cbiAgICAgIC8vIDkuIERlc2NyaXB0b3IgcGFyc2VyOiBMZXQgZXJyb3IgYmUgbm8uXG4gICAgICB2YXIgcEVycm9yID0gZmFsc2UsXG5cbiAgICAgICAgLy8gMTAuIExldCB3aWR0aCBiZSBhYnNlbnQuXG4gICAgICAgIC8vIDExLiBMZXQgZGVuc2l0eSBiZSBhYnNlbnQuXG4gICAgICAgIC8vIDEyLiBMZXQgZnV0dXJlLWNvbXBhdC1oIGJlIGFic2VudC4gKFdlJ3JlIGltcGxlbWVudGluZyBpdCBub3cgYXMgaClcbiAgICAgICAgdywgZCwgaCwgaSxcbiAgICAgICAgY2FuZGlkYXRlID0ge30sXG4gICAgICAgIGRlc2MsIGxhc3RDaGFyLCB2YWx1ZSwgaW50VmFsLCBmbG9hdFZhbDtcblxuICAgICAgLy8gMTMuIEZvciBlYWNoIGRlc2NyaXB0b3IgaW4gZGVzY3JpcHRvcnMsIHJ1biB0aGUgYXBwcm9wcmlhdGUgc2V0IG9mIHN0ZXBzXG4gICAgICAvLyBmcm9tIHRoZSBmb2xsb3dpbmcgbGlzdDpcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBkZXNjcmlwdG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICBkZXNjID0gZGVzY3JpcHRvcnNbaV07XG5cbiAgICAgICAgbGFzdENoYXIgPSBkZXNjW2Rlc2MubGVuZ3RoIC0gMV07XG4gICAgICAgIHZhbHVlID0gZGVzYy5zdWJzdHJpbmcoMCwgZGVzYy5sZW5ndGggLSAxKTtcbiAgICAgICAgaW50VmFsID0gcGFyc2VJbnQodmFsdWUsIDEwKTtcbiAgICAgICAgZmxvYXRWYWwgPSBwYXJzZUZsb2F0KHZhbHVlKTtcblxuICAgICAgICAvLyBJZiB0aGUgZGVzY3JpcHRvciBjb25zaXN0cyBvZiBhIHZhbGlkIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyIGZvbGxvd2VkIGJ5XG4gICAgICAgIC8vIGEgVSswMDc3IExBVElOIFNNQUxMIExFVFRFUiBXIGNoYXJhY3RlclxuICAgICAgICBpZiAocmVnZXhOb25OZWdhdGl2ZUludGVnZXIudGVzdCh2YWx1ZSkgJiYgKGxhc3RDaGFyID09PSBcIndcIikpIHtcblxuICAgICAgICAgIC8vIElmIHdpZHRoIGFuZCBkZW5zaXR5IGFyZSBub3QgYm90aCBhYnNlbnQsIHRoZW4gbGV0IGVycm9yIGJlIHllcy5cbiAgICAgICAgICBpZiAodyB8fCBkKSB7XG4gICAgICAgICAgICBwRXJyb3IgPSB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEFwcGx5IHRoZSBydWxlcyBmb3IgcGFyc2luZyBub24tbmVnYXRpdmUgaW50ZWdlcnMgdG8gdGhlIGRlc2NyaXB0b3IuXG4gICAgICAgICAgLy8gSWYgdGhlIHJlc3VsdCBpcyB6ZXJvLCBsZXQgZXJyb3IgYmUgeWVzLlxuICAgICAgICAgIC8vIE90aGVyd2lzZSwgbGV0IHdpZHRoIGJlIHRoZSByZXN1bHQuXG4gICAgICAgICAgaWYgKGludFZhbCA9PT0gMCkge1xuICAgICAgICAgICAgcEVycm9yID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdyA9IGludFZhbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBJZiB0aGUgZGVzY3JpcHRvciBjb25zaXN0cyBvZiBhIHZhbGlkIGZsb2F0aW5nLXBvaW50IG51bWJlciBmb2xsb3dlZCBieVxuICAgICAgICAgIC8vIGEgVSswMDc4IExBVElOIFNNQUxMIExFVFRFUiBYIGNoYXJhY3RlclxuICAgICAgICB9IGVsc2UgaWYgKHJlZ2V4RmxvYXRpbmdQb2ludC50ZXN0KHZhbHVlKSAmJiAobGFzdENoYXIgPT09IFwieFwiKSkge1xuXG4gICAgICAgICAgLy8gSWYgd2lkdGgsIGRlbnNpdHkgYW5kIGZ1dHVyZS1jb21wYXQtaCBhcmUgbm90IGFsbCBhYnNlbnQsIHRoZW4gbGV0IGVycm9yXG4gICAgICAgICAgLy8gYmUgeWVzLlxuICAgICAgICAgIGlmICh3IHx8IGQgfHwgaCkge1xuICAgICAgICAgICAgcEVycm9yID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBcHBseSB0aGUgcnVsZXMgZm9yIHBhcnNpbmcgZmxvYXRpbmctcG9pbnQgbnVtYmVyIHZhbHVlcyB0byB0aGUgZGVzY3JpcHRvci5cbiAgICAgICAgICAvLyBJZiB0aGUgcmVzdWx0IGlzIGxlc3MgdGhhbiB6ZXJvLCBsZXQgZXJyb3IgYmUgeWVzLiBPdGhlcndpc2UsIGxldCBkZW5zaXR5XG4gICAgICAgICAgLy8gYmUgdGhlIHJlc3VsdC5cbiAgICAgICAgICBpZiAoZmxvYXRWYWwgPCAwKSB7XG4gICAgICAgICAgICBwRXJyb3IgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkID0gZmxvYXRWYWw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSWYgdGhlIGRlc2NyaXB0b3IgY29uc2lzdHMgb2YgYSB2YWxpZCBub24tbmVnYXRpdmUgaW50ZWdlciBmb2xsb3dlZCBieVxuICAgICAgICAgIC8vIGEgVSswMDY4IExBVElOIFNNQUxMIExFVFRFUiBIIGNoYXJhY3RlclxuICAgICAgICB9IGVsc2UgaWYgKHJlZ2V4Tm9uTmVnYXRpdmVJbnRlZ2VyLnRlc3QodmFsdWUpICYmIChsYXN0Q2hhciA9PT0gXCJoXCIpKSB7XG5cbiAgICAgICAgICAvLyBJZiBoZWlnaHQgYW5kIGRlbnNpdHkgYXJlIG5vdCBib3RoIGFic2VudCwgdGhlbiBsZXQgZXJyb3IgYmUgeWVzLlxuICAgICAgICAgIGlmIChoIHx8IGQpIHtcbiAgICAgICAgICAgIHBFcnJvciA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQXBwbHkgdGhlIHJ1bGVzIGZvciBwYXJzaW5nIG5vbi1uZWdhdGl2ZSBpbnRlZ2VycyB0byB0aGUgZGVzY3JpcHRvci5cbiAgICAgICAgICAvLyBJZiB0aGUgcmVzdWx0IGlzIHplcm8sIGxldCBlcnJvciBiZSB5ZXMuIE90aGVyd2lzZSwgbGV0IGZ1dHVyZS1jb21wYXQtaFxuICAgICAgICAgIC8vIGJlIHRoZSByZXN1bHQuXG4gICAgICAgICAgaWYgKGludFZhbCA9PT0gMCkge1xuICAgICAgICAgICAgcEVycm9yID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaCA9IGludFZhbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBbnl0aGluZyBlbHNlLCBMZXQgZXJyb3IgYmUgeWVzLlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBFcnJvciA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gLy8gKGNsb3NlIHN0ZXAgMTMgZm9yIGxvb3ApXG5cbiAgICAgIC8vIDE1LiBJZiBlcnJvciBpcyBzdGlsbCBubywgdGhlbiBhcHBlbmQgYSBuZXcgaW1hZ2Ugc291cmNlIHRvIGNhbmRpZGF0ZXMgd2hvc2VcbiAgICAgIC8vIFVSTCBpcyB1cmwsIGFzc29jaWF0ZWQgd2l0aCBhIHdpZHRoIHdpZHRoIGlmIG5vdCBhYnNlbnQgYW5kIGEgcGl4ZWxcbiAgICAgIC8vIGRlbnNpdHkgZGVuc2l0eSBpZiBub3QgYWJzZW50LiBPdGhlcndpc2UsIHRoZXJlIGlzIGEgcGFyc2UgZXJyb3IuXG4gICAgICBpZiAoIXBFcnJvcikge1xuICAgICAgICBjYW5kaWRhdGUudXJsID0gdXJsO1xuXG4gICAgICAgIGlmICh3KSB7XG4gICAgICAgICAgY2FuZGlkYXRlLncgPSB3O1xuICAgICAgICB9XG4gICAgICAgIGlmIChkKSB7XG4gICAgICAgICAgY2FuZGlkYXRlLmQgPSBkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChoKSB7XG4gICAgICAgICAgY2FuZGlkYXRlLmggPSBoO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaCAmJiAhZCAmJiAhdykge1xuICAgICAgICAgIGNhbmRpZGF0ZS5kID0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2FuZGlkYXRlLmQgPT09IDEpIHtcbiAgICAgICAgICBzZXQuaGFzMXggPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNhbmRpZGF0ZS5zZXQgPSBzZXQ7XG5cbiAgICAgICAgY2FuZGlkYXRlcy5wdXNoKGNhbmRpZGF0ZSk7XG4gICAgICB9XG4gICAgfSAvLyAoY2xvc2UgcGFyc2VEZXNjcmlwdG9ycyBmbilcblxuICAgIC8qKlxuICAgICAqIFRva2VuaXplcyBkZXNjcmlwdG9yIHByb3BlcnRpZXMgcHJpb3IgdG8gcGFyc2luZ1xuICAgICAqIFJldHVybnMgdW5kZWZpbmVkLlxuICAgICAqIChBZ2FpbiwgdGhpcyBmbiBpcyBkZWZpbmVkIGJlZm9yZSBpdCBpcyB1c2VkLCBpbiBvcmRlciB0byBwYXNzIEpTSElOVC5cbiAgICAgKiBVbmZvcnR1bmF0ZWx5IHRoaXMgYnJlYWtzIHRoZSBsb2dpY2FsIHNlcXVlbmNpbmcgb2YgdGhlIHNwZWMgY29tbWVudHMuIDovIClcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0b2tlbml6ZSgpIHtcblxuICAgICAgLy8gOC4xLiBEZXNjcmlwdG9yIHRva2VuaXNlcjogU2tpcCB3aGl0ZXNwYWNlXG4gICAgICBjb2xsZWN0Q2hhcmFjdGVycyhyZWdleExlYWRpbmdTcGFjZXMpO1xuXG4gICAgICAvLyA4LjIuIExldCBjdXJyZW50IGRlc2NyaXB0b3IgYmUgdGhlIGVtcHR5IHN0cmluZy5cbiAgICAgIGN1cnJlbnREZXNjcmlwdG9yID0gXCJcIjtcblxuICAgICAgLy8gOC4zLiBMZXQgc3RhdGUgYmUgaW4gZGVzY3JpcHRvci5cbiAgICAgIHN0YXRlID0gXCJpbiBkZXNjcmlwdG9yXCI7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG5cbiAgICAgICAgLy8gOC40LiBMZXQgYyBiZSB0aGUgY2hhcmFjdGVyIGF0IHBvc2l0aW9uLlxuICAgICAgICBjID0gaW5wdXQuY2hhckF0KHBvcyk7XG5cbiAgICAgICAgLy8gIERvIHRoZSBmb2xsb3dpbmcgZGVwZW5kaW5nIG9uIHRoZSB2YWx1ZSBvZiBzdGF0ZS5cbiAgICAgICAgLy8gIEZvciB0aGUgcHVycG9zZSBvZiB0aGlzIHN0ZXAsIFwiRU9GXCIgaXMgYSBzcGVjaWFsIGNoYXJhY3RlciByZXByZXNlbnRpbmdcbiAgICAgICAgLy8gIHRoYXQgcG9zaXRpb24gaXMgcGFzdCB0aGUgZW5kIG9mIGlucHV0LlxuXG4gICAgICAgIC8vIEluIGRlc2NyaXB0b3JcbiAgICAgICAgaWYgKHN0YXRlID09PSBcImluIGRlc2NyaXB0b3JcIikge1xuICAgICAgICAgIC8vIERvIHRoZSBmb2xsb3dpbmcsIGRlcGVuZGluZyBvbiB0aGUgdmFsdWUgb2YgYzpcblxuICAgICAgICAgIC8vIFNwYWNlIGNoYXJhY3RlclxuICAgICAgICAgIC8vIElmIGN1cnJlbnQgZGVzY3JpcHRvciBpcyBub3QgZW1wdHksIGFwcGVuZCBjdXJyZW50IGRlc2NyaXB0b3IgdG9cbiAgICAgICAgICAvLyBkZXNjcmlwdG9ycyBhbmQgbGV0IGN1cnJlbnQgZGVzY3JpcHRvciBiZSB0aGUgZW1wdHkgc3RyaW5nLlxuICAgICAgICAgIC8vIFNldCBzdGF0ZSB0byBhZnRlciBkZXNjcmlwdG9yLlxuICAgICAgICAgIGlmIChpc1NwYWNlKGMpKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudERlc2NyaXB0b3IpIHtcbiAgICAgICAgICAgICAgZGVzY3JpcHRvcnMucHVzaChjdXJyZW50RGVzY3JpcHRvcik7XG4gICAgICAgICAgICAgIGN1cnJlbnREZXNjcmlwdG9yID0gXCJcIjtcbiAgICAgICAgICAgICAgc3RhdGUgPSBcImFmdGVyIGRlc2NyaXB0b3JcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVSswMDJDIENPTU1BICgsKVxuICAgICAgICAgICAgLy8gQWR2YW5jZSBwb3NpdGlvbiB0byB0aGUgbmV4dCBjaGFyYWN0ZXIgaW4gaW5wdXQuIElmIGN1cnJlbnQgZGVzY3JpcHRvclxuICAgICAgICAgICAgLy8gaXMgbm90IGVtcHR5LCBhcHBlbmQgY3VycmVudCBkZXNjcmlwdG9yIHRvIGRlc2NyaXB0b3JzLiBKdW1wIHRvIHRoZSBzdGVwXG4gICAgICAgICAgICAvLyBsYWJlbGVkIGRlc2NyaXB0b3IgcGFyc2VyLlxuICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gXCIsXCIpIHtcbiAgICAgICAgICAgIHBvcyArPSAxO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnREZXNjcmlwdG9yKSB7XG4gICAgICAgICAgICAgIGRlc2NyaXB0b3JzLnB1c2goY3VycmVudERlc2NyaXB0b3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFyc2VEZXNjcmlwdG9ycygpO1xuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAvLyBVKzAwMjggTEVGVCBQQVJFTlRIRVNJUyAoKClcbiAgICAgICAgICAgIC8vIEFwcGVuZCBjIHRvIGN1cnJlbnQgZGVzY3JpcHRvci4gU2V0IHN0YXRlIHRvIGluIHBhcmVucy5cbiAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09IFwiXFx1MDAyOFwiKSB7XG4gICAgICAgICAgICBjdXJyZW50RGVzY3JpcHRvciA9IGN1cnJlbnREZXNjcmlwdG9yICsgYztcbiAgICAgICAgICAgIHN0YXRlID0gXCJpbiBwYXJlbnNcIjtcblxuICAgICAgICAgICAgLy8gRU9GXG4gICAgICAgICAgICAvLyBJZiBjdXJyZW50IGRlc2NyaXB0b3IgaXMgbm90IGVtcHR5LCBhcHBlbmQgY3VycmVudCBkZXNjcmlwdG9yIHRvXG4gICAgICAgICAgICAvLyBkZXNjcmlwdG9ycy4gSnVtcCB0byB0aGUgc3RlcCBsYWJlbGVkIGRlc2NyaXB0b3IgcGFyc2VyLlxuICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gXCJcIikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnREZXNjcmlwdG9yKSB7XG4gICAgICAgICAgICAgIGRlc2NyaXB0b3JzLnB1c2goY3VycmVudERlc2NyaXB0b3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFyc2VEZXNjcmlwdG9ycygpO1xuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAvLyBBbnl0aGluZyBlbHNlXG4gICAgICAgICAgICAvLyBBcHBlbmQgYyB0byBjdXJyZW50IGRlc2NyaXB0b3IuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1cnJlbnREZXNjcmlwdG9yID0gY3VycmVudERlc2NyaXB0b3IgKyBjO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyAoZW5kIFwiaW4gZGVzY3JpcHRvclwiXG5cbiAgICAgICAgICAvLyBJbiBwYXJlbnNcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gXCJpbiBwYXJlbnNcIikge1xuXG4gICAgICAgICAgLy8gVSswMDI5IFJJR0hUIFBBUkVOVEhFU0lTICgpKVxuICAgICAgICAgIC8vIEFwcGVuZCBjIHRvIGN1cnJlbnQgZGVzY3JpcHRvci4gU2V0IHN0YXRlIHRvIGluIGRlc2NyaXB0b3IuXG4gICAgICAgICAgaWYgKGMgPT09IFwiKVwiKSB7XG4gICAgICAgICAgICBjdXJyZW50RGVzY3JpcHRvciA9IGN1cnJlbnREZXNjcmlwdG9yICsgYztcbiAgICAgICAgICAgIHN0YXRlID0gXCJpbiBkZXNjcmlwdG9yXCI7XG5cbiAgICAgICAgICAgIC8vIEVPRlxuICAgICAgICAgICAgLy8gQXBwZW5kIGN1cnJlbnQgZGVzY3JpcHRvciB0byBkZXNjcmlwdG9ycy4gSnVtcCB0byB0aGUgc3RlcCBsYWJlbGVkXG4gICAgICAgICAgICAvLyBkZXNjcmlwdG9yIHBhcnNlci5cbiAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09IFwiXCIpIHtcbiAgICAgICAgICAgIGRlc2NyaXB0b3JzLnB1c2goY3VycmVudERlc2NyaXB0b3IpO1xuICAgICAgICAgICAgcGFyc2VEZXNjcmlwdG9ycygpO1xuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAvLyBBbnl0aGluZyBlbHNlXG4gICAgICAgICAgICAvLyBBcHBlbmQgYyB0byBjdXJyZW50IGRlc2NyaXB0b3IuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1cnJlbnREZXNjcmlwdG9yID0gY3VycmVudERlc2NyaXB0b3IgKyBjO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEFmdGVyIGRlc2NyaXB0b3JcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gXCJhZnRlciBkZXNjcmlwdG9yXCIpIHtcblxuICAgICAgICAgIC8vIERvIHRoZSBmb2xsb3dpbmcsIGRlcGVuZGluZyBvbiB0aGUgdmFsdWUgb2YgYzpcbiAgICAgICAgICAvLyBTcGFjZSBjaGFyYWN0ZXI6IFN0YXkgaW4gdGhpcyBzdGF0ZS5cbiAgICAgICAgICBpZiAoaXNTcGFjZShjKSkge1xuXG4gICAgICAgICAgICAvLyBFT0Y6IEp1bXAgdG8gdGhlIHN0ZXAgbGFiZWxlZCBkZXNjcmlwdG9yIHBhcnNlci5cbiAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09IFwiXCIpIHtcbiAgICAgICAgICAgIHBhcnNlRGVzY3JpcHRvcnMoKTtcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgLy8gQW55dGhpbmcgZWxzZVxuICAgICAgICAgICAgLy8gU2V0IHN0YXRlIHRvIGluIGRlc2NyaXB0b3IuIFNldCBwb3NpdGlvbiB0byB0aGUgcHJldmlvdXMgY2hhcmFjdGVyIGluIGlucHV0LlxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZSA9IFwiaW4gZGVzY3JpcHRvclwiO1xuICAgICAgICAgICAgcG9zIC09IDE7XG5cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZHZhbmNlIHBvc2l0aW9uIHRvIHRoZSBuZXh0IGNoYXJhY3RlciBpbiBpbnB1dC5cbiAgICAgICAgcG9zICs9IDE7XG5cbiAgICAgICAgLy8gUmVwZWF0IHRoaXMgc3RlcC5cbiAgICAgIH0gLy8gKGNsb3NlIHdoaWxlIHRydWUgbG9vcClcbiAgICB9XG5cbiAgICAvLyA0LiBTcGxpdHRpbmcgbG9vcDogQ29sbGVjdCBhIHNlcXVlbmNlIG9mIGNoYXJhY3RlcnMgdGhhdCBhcmUgc3BhY2VcbiAgICAvLyAgICBjaGFyYWN0ZXJzIG9yIFUrMDAyQyBDT01NQSBjaGFyYWN0ZXJzLiBJZiBhbnkgVSswMDJDIENPTU1BIGNoYXJhY3RlcnNcbiAgICAvLyAgICB3ZXJlIGNvbGxlY3RlZCwgdGhhdCBpcyBhIHBhcnNlIGVycm9yLlxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBjb2xsZWN0Q2hhcmFjdGVycyhyZWdleExlYWRpbmdDb21tYXNPclNwYWNlcyk7XG5cbiAgICAgIC8vIDUuIElmIHBvc2l0aW9uIGlzIHBhc3QgdGhlIGVuZCBvZiBpbnB1dCwgcmV0dXJuIGNhbmRpZGF0ZXMgYW5kIGFib3J0IHRoZXNlIHN0ZXBzLlxuICAgICAgaWYgKHBvcyA+PSBpbnB1dExlbmd0aCkge1xuICAgICAgICByZXR1cm4gY2FuZGlkYXRlczsgLy8gKHdlJ3JlIGRvbmUsIHRoaXMgaXMgdGhlIHNvbGUgcmV0dXJuIHBhdGgpXG4gICAgICB9XG5cbiAgICAgIC8vIDYuIENvbGxlY3QgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIHRoYXQgYXJlIG5vdCBzcGFjZSBjaGFyYWN0ZXJzLFxuICAgICAgLy8gICAgYW5kIGxldCB0aGF0IGJlIHVybC5cbiAgICAgIHVybCA9IGNvbGxlY3RDaGFyYWN0ZXJzKHJlZ2V4TGVhZGluZ05vdFNwYWNlcyk7XG5cbiAgICAgIC8vIDcuIExldCBkZXNjcmlwdG9ycyBiZSBhIG5ldyBlbXB0eSBsaXN0LlxuICAgICAgZGVzY3JpcHRvcnMgPSBbXTtcblxuICAgICAgLy8gOC4gSWYgdXJsIGVuZHMgd2l0aCBhIFUrMDAyQyBDT01NQSBjaGFyYWN0ZXIgKCwpLCBmb2xsb3cgdGhlc2Ugc3Vic3RlcHM6XG4gICAgICAvL1x0XHQoMSkuIFJlbW92ZSBhbGwgdHJhaWxpbmcgVSswMDJDIENPTU1BIGNoYXJhY3RlcnMgZnJvbSB1cmwuIElmIHRoaXMgcmVtb3ZlZFxuICAgICAgLy8gICAgICAgICBtb3JlIHRoYW4gb25lIGNoYXJhY3RlciwgdGhhdCBpcyBhIHBhcnNlIGVycm9yLlxuICAgICAgaWYgKHVybC5zbGljZSgtMSkgPT09IFwiLFwiKSB7XG4gICAgICAgIHVybCA9IHVybC5yZXBsYWNlKHJlZ2V4VHJhaWxpbmdDb21tYXMsIFwiXCIpO1xuICAgICAgICAvLyAoSnVtcCBhaGVhZCB0byBzdGVwIDkgdG8gc2tpcCB0b2tlbml6YXRpb24gYW5kIGp1c3QgcHVzaCB0aGUgY2FuZGlkYXRlKS5cbiAgICAgICAgcGFyc2VEZXNjcmlwdG9ycygpO1xuXG4gICAgICAgIC8vXHRPdGhlcndpc2UsIGZvbGxvdyB0aGVzZSBzdWJzdGVwczpcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRva2VuaXplKCk7XG4gICAgICB9IC8vIChjbG9zZSBlbHNlIG9mIHN0ZXAgOClcblxuICAgICAgLy8gMTYuIFJldHVybiB0byB0aGUgc3RlcCBsYWJlbGVkIHNwbGl0dGluZyBsb29wLlxuICAgIH0gLy8gKENsb3NlIG9mIGJpZyB3aGlsZSBsb29wLilcbiAgfVxuXG4gIC8qXG4gICAqIFNpemVzIFBhcnNlclxuICAgKlxuICAgKiBCeSBBbGV4IEJlbGwgfCAgTUlUIExpY2Vuc2VcbiAgICpcbiAgICogTm9uLXN0cmljdCBidXQgYWNjdXJhdGUgYW5kIGxpZ2h0d2VpZ2h0IEpTIFBhcnNlciBmb3IgdGhlIHN0cmluZyB2YWx1ZSA8aW1nIHNpemVzPVwiaGVyZVwiPlxuICAgKlxuICAgKiBSZWZlcmVuY2UgYWxnb3JpdGhtIGF0OlxuICAgKiBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9lbWJlZGRlZC1jb250ZW50Lmh0bWwjcGFyc2UtYS1zaXplcy1hdHRyaWJ1dGVcbiAgICpcbiAgICogTW9zdCBjb21tZW50cyBhcmUgY29waWVkIGluIGRpcmVjdGx5IGZyb20gdGhlIHNwZWNcbiAgICogKGV4Y2VwdCBmb3IgY29tbWVudHMgaW4gcGFyZW5zKS5cbiAgICpcbiAgICogR3JhbW1hciBpczpcbiAgICogPHNvdXJjZS1zaXplLWxpc3Q+ID0gPHNvdXJjZS1zaXplPiMgWyAsIDxzb3VyY2Utc2l6ZS12YWx1ZT4gXT8gfCA8c291cmNlLXNpemUtdmFsdWU+XG4gICAqIDxzb3VyY2Utc2l6ZT4gPSA8bWVkaWEtY29uZGl0aW9uPiA8c291cmNlLXNpemUtdmFsdWU+XG4gICAqIDxzb3VyY2Utc2l6ZS12YWx1ZT4gPSA8bGVuZ3RoPlxuICAgKiBodHRwOi8vd3d3LnczLm9yZy9odG1sL3dnL2RyYWZ0cy9odG1sL21hc3Rlci9lbWJlZGRlZC1jb250ZW50Lmh0bWwjYXR0ci1pbWctc2l6ZXNcbiAgICpcbiAgICogRS5nLiBcIihtYXgtd2lkdGg6IDMwZW0pIDEwMHZ3LCAobWF4LXdpZHRoOiA1MGVtKSA3MHZ3LCAxMDB2d1wiXG4gICAqIG9yIFwiKG1pbi13aWR0aDogMzBlbSksIGNhbGMoMzB2dyAtIDE1cHgpXCIgb3IganVzdCBcIjMwdndcIlxuICAgKlxuICAgKiBSZXR1cm5zIHRoZSBmaXJzdCB2YWxpZCA8Y3NzLWxlbmd0aD4gd2l0aCBhIG1lZGlhIGNvbmRpdGlvbiB0aGF0IGV2YWx1YXRlcyB0byB0cnVlLFxuICAgKiBvciBcIjEwMHZ3XCIgaWYgYWxsIHZhbGlkIG1lZGlhIGNvbmRpdGlvbnMgZXZhbHVhdGUgdG8gZmFsc2UuXG4gICAqXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHBhcnNlU2l6ZXMoc3RyVmFsdWUpIHtcblxuICAgIC8vIChQZXJjZW50YWdlIENTUyBsZW5ndGhzIGFyZSBub3QgYWxsb3dlZCBpbiB0aGlzIGNhc2UsIHRvIGF2b2lkIGNvbmZ1c2lvbjpcbiAgICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9lbWJlZGRlZC1jb250ZW50Lmh0bWwjdmFsaWQtc291cmNlLXNpemUtbGlzdFxuICAgIC8vIENTUyBhbGxvd3MgYSBzaW5nbGUgb3B0aW9uYWwgcGx1cyBvciBtaW51cyBzaWduOlxuICAgIC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL0NTUzIvc3luZGF0YS5odG1sI251bWJlcnNcbiAgICAvLyBDU1MgaXMgQVNDSUkgY2FzZS1pbnNlbnNpdGl2ZTpcbiAgICAvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9DU1MyL3N5bmRhdGEuaHRtbCNjaGFyYWN0ZXJzIClcbiAgICAvLyBTcGVjIGFsbG93cyBleHBvbmVudGlhbCBub3RhdGlvbiBmb3IgPG51bWJlcj4gdHlwZTpcbiAgICAvLyBodHRwOi8vZGV2LnczLm9yZy9jc3N3Zy9jc3MtdmFsdWVzLyNudW1iZXJzXG4gICAgdmFyIHJlZ2V4Q3NzTGVuZ3RoV2l0aFVuaXRzID0gL14oPzpbKy1dP1swLTldK3xbMC05XSpcXC5bMC05XSspKD86W2VFXVsrLV0/WzAtOV0rKT8oPzpjaHxjbXxlbXxleHxpbnxtbXxwY3xwdHxweHxyZW18dmh8dm1pbnx2bWF4fHZ3KSQvaTtcblxuICAgIC8vIChUaGlzIGlzIGEgcXVpY2sgYW5kIGxlbmllbnQgdGVzdC4gQmVjYXVzZSBvZiBvcHRpb25hbCB1bmxpbWl0ZWQtZGVwdGggaW50ZXJuYWxcbiAgICAvLyBncm91cGluZyBwYXJlbnMgYW5kIHN0cmljdCBzcGFjaW5nIHJ1bGVzLCB0aGlzIGNvdWxkIGdldCB2ZXJ5IGNvbXBsaWNhdGVkLilcbiAgICB2YXIgcmVnZXhDc3NDYWxjID0gL15jYWxjXFwoKD86WzAtOWEteiBcXC5cXCtcXC1cXCpcXC9cXChcXCldKylcXCkkL2k7XG5cbiAgICB2YXIgaTtcbiAgICB2YXIgdW5wYXJzZWRTaXplc0xpc3Q7XG4gICAgdmFyIHVucGFyc2VkU2l6ZXNMaXN0TGVuZ3RoO1xuICAgIHZhciB1bnBhcnNlZFNpemU7XG4gICAgdmFyIGxhc3RDb21wb25lbnRWYWx1ZTtcbiAgICB2YXIgc2l6ZTtcblxuICAgIC8vIFVUSUxJVFkgRlVOQ1RJT05TXG5cbiAgICAvLyAgKFRveSBDU1MgcGFyc2VyLiBUaGUgZ29hbHMgaGVyZSBhcmU6XG4gICAgLy8gIDEpIGV4cGFuc2l2ZSB0ZXN0IGNvdmVyYWdlIHdpdGhvdXQgdGhlIHdlaWdodCBvZiBhIGZ1bGwgQ1NTIHBhcnNlci5cbiAgICAvLyAgMikgQXZvaWRpbmcgcmVnZXggd2hlcmV2ZXIgY29udmVuaWVudC5cbiAgICAvLyAgUXVpY2sgdGVzdHM6IGh0dHA6Ly9qc2ZpZGRsZS5uZXQvZ3RudEw0Z3IvMy9cbiAgICAvLyAgUmV0dXJucyBhbiBhcnJheSBvZiBhcnJheXMuKVxuICAgIGZ1bmN0aW9uIHBhcnNlQ29tcG9uZW50VmFsdWVzKHN0cikge1xuICAgICAgdmFyIGNocmN0cjtcbiAgICAgIHZhciBjb21wb25lbnQgPSBcIlwiO1xuICAgICAgdmFyIGNvbXBvbmVudEFycmF5ID0gW107XG4gICAgICB2YXIgbGlzdEFycmF5ID0gW107XG4gICAgICB2YXIgcGFyZW5EZXB0aCA9IDA7XG4gICAgICB2YXIgcG9zID0gMDtcbiAgICAgIHZhciBpbkNvbW1lbnQgPSBmYWxzZTtcblxuICAgICAgZnVuY3Rpb24gcHVzaENvbXBvbmVudCgpIHtcbiAgICAgICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgICAgIGNvbXBvbmVudEFycmF5LnB1c2goY29tcG9uZW50KTtcbiAgICAgICAgICBjb21wb25lbnQgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHB1c2hDb21wb25lbnRBcnJheSgpIHtcbiAgICAgICAgaWYgKGNvbXBvbmVudEFycmF5WzBdKSB7XG4gICAgICAgICAgbGlzdEFycmF5LnB1c2goY29tcG9uZW50QXJyYXkpO1xuICAgICAgICAgIGNvbXBvbmVudEFycmF5ID0gW107XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gKExvb3AgZm9yd2FyZHMgZnJvbSB0aGUgYmVnaW5uaW5nIG9mIHRoZSBzdHJpbmcuKVxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgY2hyY3RyID0gc3RyLmNoYXJBdChwb3MpO1xuXG4gICAgICAgIGlmIChjaHJjdHIgPT09IFwiXCIpIHsgLy8gKCBFbmQgb2Ygc3RyaW5nIHJlYWNoZWQuKVxuICAgICAgICAgIHB1c2hDb21wb25lbnQoKTtcbiAgICAgICAgICBwdXNoQ29tcG9uZW50QXJyYXkoKTtcbiAgICAgICAgICByZXR1cm4gbGlzdEFycmF5O1xuICAgICAgICB9IGVsc2UgaWYgKGluQ29tbWVudCkge1xuICAgICAgICAgIGlmICgoY2hyY3RyID09PSBcIipcIikgJiYgKHN0cltwb3MgKyAxXSA9PT0gXCIvXCIpKSB7IC8vIChBdCBlbmQgb2YgYSBjb21tZW50LilcbiAgICAgICAgICAgIGluQ29tbWVudCA9IGZhbHNlO1xuICAgICAgICAgICAgcG9zICs9IDI7XG4gICAgICAgICAgICBwdXNoQ29tcG9uZW50KCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcG9zICs9IDE7IC8vIChTa2lwIGFsbCBjaGFyYWN0ZXJzIGluc2lkZSBjb21tZW50cy4pXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaXNTcGFjZShjaHJjdHIpKSB7XG4gICAgICAgICAgLy8gKElmIHByZXZpb3VzIGNoYXJhY3RlciBpbiBsb29wIHdhcyBhbHNvIGEgc3BhY2UsIG9yIGlmXG4gICAgICAgICAgLy8gYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgc3RyaW5nLCBkbyBub3QgYWRkIHNwYWNlIGNoYXIgdG9cbiAgICAgICAgICAvLyBjb21wb25lbnQuKVxuICAgICAgICAgIGlmICgoc3RyLmNoYXJBdChwb3MgLSAxKSAmJiBpc1NwYWNlKHN0ci5jaGFyQXQocG9zIC0gMSkpKSB8fCAhY29tcG9uZW50KSB7XG4gICAgICAgICAgICBwb3MgKz0gMTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH0gZWxzZSBpZiAocGFyZW5EZXB0aCA9PT0gMCkge1xuICAgICAgICAgICAgcHVzaENvbXBvbmVudCgpO1xuICAgICAgICAgICAgcG9zICs9IDE7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gKFJlcGxhY2UgYW55IHNwYWNlIGNoYXJhY3RlciB3aXRoIGEgcGxhaW4gc3BhY2UgZm9yIGxlZ2liaWxpdHkuKVxuICAgICAgICAgICAgY2hyY3RyID0gXCIgXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGNocmN0ciA9PT0gXCIoXCIpIHtcbiAgICAgICAgICBwYXJlbkRlcHRoICs9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hyY3RyID09PSBcIilcIikge1xuICAgICAgICAgIHBhcmVuRGVwdGggLT0gMTtcbiAgICAgICAgfSBlbHNlIGlmIChjaHJjdHIgPT09IFwiLFwiKSB7XG4gICAgICAgICAgcHVzaENvbXBvbmVudCgpO1xuICAgICAgICAgIHB1c2hDb21wb25lbnRBcnJheSgpO1xuICAgICAgICAgIHBvcyArPSAxO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IGVsc2UgaWYgKChjaHJjdHIgPT09IFwiL1wiKSAmJiAoc3RyLmNoYXJBdChwb3MgKyAxKSA9PT0gXCIqXCIpKSB7XG4gICAgICAgICAgaW5Db21tZW50ID0gdHJ1ZTtcbiAgICAgICAgICBwb3MgKz0gMjtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbXBvbmVudCA9IGNvbXBvbmVudCArIGNocmN0cjtcbiAgICAgICAgcG9zICs9IDE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNWYWxpZE5vbk5lZ2F0aXZlU291cmNlU2l6ZVZhbHVlKHMpIHtcbiAgICAgIGlmIChyZWdleENzc0xlbmd0aFdpdGhVbml0cy50ZXN0KHMpICYmIChwYXJzZUZsb2F0KHMpID49IDApKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKHJlZ2V4Q3NzQ2FsYy50ZXN0KHMpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgLy8gKCBodHRwOi8vd3d3LnczLm9yZy9UUi9DU1MyL3N5bmRhdGEuaHRtbCNudW1iZXJzIHNheXM6XG4gICAgICAvLyBcIi0wIGlzIGVxdWl2YWxlbnQgdG8gMCBhbmQgaXMgbm90IGEgbmVnYXRpdmUgbnVtYmVyLlwiIHdoaWNoIG1lYW5zIHRoYXRcbiAgICAgIC8vIHVuaXRsZXNzIHplcm8gYW5kIHVuaXRsZXNzIG5lZ2F0aXZlIHplcm8gbXVzdCBiZSBhY2NlcHRlZCBhcyBzcGVjaWFsIGNhc2VzLilcbiAgICAgIGlmICgocyA9PT0gXCIwXCIpIHx8IChzID09PSBcIi0wXCIpIHx8IChzID09PSBcIiswXCIpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFdoZW4gYXNrZWQgdG8gcGFyc2UgYSBzaXplcyBhdHRyaWJ1dGUgZnJvbSBhbiBlbGVtZW50LCBwYXJzZSBhXG4gICAgLy8gY29tbWEtc2VwYXJhdGVkIGxpc3Qgb2YgY29tcG9uZW50IHZhbHVlcyBmcm9tIHRoZSB2YWx1ZSBvZiB0aGUgZWxlbWVudCdzXG4gICAgLy8gc2l6ZXMgYXR0cmlidXRlIChvciB0aGUgZW1wdHkgc3RyaW5nLCBpZiB0aGUgYXR0cmlidXRlIGlzIGFic2VudCksIGFuZCBsZXRcbiAgICAvLyB1bnBhcnNlZCBzaXplcyBsaXN0IGJlIHRoZSByZXN1bHQuXG4gICAgLy8gaHR0cDovL2Rldi53My5vcmcvY3Nzd2cvY3NzLXN5bnRheC8jcGFyc2UtY29tbWEtc2VwYXJhdGVkLWxpc3Qtb2YtY29tcG9uZW50LXZhbHVlc1xuXG4gICAgdW5wYXJzZWRTaXplc0xpc3QgPSBwYXJzZUNvbXBvbmVudFZhbHVlcyhzdHJWYWx1ZSk7XG4gICAgdW5wYXJzZWRTaXplc0xpc3RMZW5ndGggPSB1bnBhcnNlZFNpemVzTGlzdC5sZW5ndGg7XG5cbiAgICAvLyBGb3IgZWFjaCB1bnBhcnNlZCBzaXplIGluIHVucGFyc2VkIHNpemVzIGxpc3Q6XG4gICAgZm9yIChpID0gMDsgaSA8IHVucGFyc2VkU2l6ZXNMaXN0TGVuZ3RoOyBpKyspIHtcbiAgICAgIHVucGFyc2VkU2l6ZSA9IHVucGFyc2VkU2l6ZXNMaXN0W2ldO1xuXG4gICAgICAvLyAxLiBSZW1vdmUgYWxsIGNvbnNlY3V0aXZlIDx3aGl0ZXNwYWNlLXRva2VuPnMgZnJvbSB0aGUgZW5kIG9mIHVucGFyc2VkIHNpemUuXG4gICAgICAvLyAoIHBhcnNlQ29tcG9uZW50VmFsdWVzKCkgYWxyZWFkeSBvbWl0cyBzcGFjZXMgb3V0c2lkZSBvZiBwYXJlbnMuIClcblxuICAgICAgLy8gSWYgdW5wYXJzZWQgc2l6ZSBpcyBub3cgZW1wdHksIHRoYXQgaXMgYSBwYXJzZSBlcnJvcjsgY29udGludWUgdG8gdGhlIG5leHRcbiAgICAgIC8vIGl0ZXJhdGlvbiBvZiB0aGlzIGFsZ29yaXRobS5cbiAgICAgIC8vICggcGFyc2VDb21wb25lbnRWYWx1ZXMoKSB3b24ndCBwdXNoIGFuIGVtcHR5IGFycmF5LiApXG5cbiAgICAgIC8vIDIuIElmIHRoZSBsYXN0IGNvbXBvbmVudCB2YWx1ZSBpbiB1bnBhcnNlZCBzaXplIGlzIGEgdmFsaWQgbm9uLW5lZ2F0aXZlXG4gICAgICAvLyA8c291cmNlLXNpemUtdmFsdWU+LCBsZXQgc2l6ZSBiZSBpdHMgdmFsdWUgYW5kIHJlbW92ZSB0aGUgY29tcG9uZW50IHZhbHVlXG4gICAgICAvLyBmcm9tIHVucGFyc2VkIHNpemUuIEFueSBDU1MgZnVuY3Rpb24gb3RoZXIgdGhhbiB0aGUgY2FsYygpIGZ1bmN0aW9uIGlzXG4gICAgICAvLyBpbnZhbGlkLiBPdGhlcndpc2UsIHRoZXJlIGlzIGEgcGFyc2UgZXJyb3I7IGNvbnRpbnVlIHRvIHRoZSBuZXh0IGl0ZXJhdGlvblxuICAgICAgLy8gb2YgdGhpcyBhbGdvcml0aG0uXG4gICAgICAvLyBodHRwOi8vZGV2LnczLm9yZy9jc3N3Zy9jc3Mtc3ludGF4LyNwYXJzZS1jb21wb25lbnQtdmFsdWVcbiAgICAgIGxhc3RDb21wb25lbnRWYWx1ZSA9IHVucGFyc2VkU2l6ZVt1bnBhcnNlZFNpemUubGVuZ3RoIC0gMV07XG5cbiAgICAgIGlmIChpc1ZhbGlkTm9uTmVnYXRpdmVTb3VyY2VTaXplVmFsdWUobGFzdENvbXBvbmVudFZhbHVlKSkge1xuICAgICAgICBzaXplID0gbGFzdENvbXBvbmVudFZhbHVlO1xuICAgICAgICB1bnBhcnNlZFNpemUucG9wKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gMy4gUmVtb3ZlIGFsbCBjb25zZWN1dGl2ZSA8d2hpdGVzcGFjZS10b2tlbj5zIGZyb20gdGhlIGVuZCBvZiB1bnBhcnNlZFxuICAgICAgLy8gc2l6ZS4gSWYgdW5wYXJzZWQgc2l6ZSBpcyBub3cgZW1wdHksIHJldHVybiBzaXplIGFuZCBleGl0IHRoaXMgYWxnb3JpdGhtLlxuICAgICAgLy8gSWYgdGhpcyB3YXMgbm90IHRoZSBsYXN0IGl0ZW0gaW4gdW5wYXJzZWQgc2l6ZXMgbGlzdCwgdGhhdCBpcyBhIHBhcnNlIGVycm9yLlxuICAgICAgaWYgKHVucGFyc2VkU2l6ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHNpemU7XG4gICAgICB9XG5cbiAgICAgIC8vIDQuIFBhcnNlIHRoZSByZW1haW5pbmcgY29tcG9uZW50IHZhbHVlcyBpbiB1bnBhcnNlZCBzaXplIGFzIGFcbiAgICAgIC8vIDxtZWRpYS1jb25kaXRpb24+LiBJZiBpdCBkb2VzIG5vdCBwYXJzZSBjb3JyZWN0bHksIG9yIGl0IGRvZXMgcGFyc2VcbiAgICAgIC8vIGNvcnJlY3RseSBidXQgdGhlIDxtZWRpYS1jb25kaXRpb24+IGV2YWx1YXRlcyB0byBmYWxzZSwgY29udGludWUgdG8gdGhlXG4gICAgICAvLyBuZXh0IGl0ZXJhdGlvbiBvZiB0aGlzIGFsZ29yaXRobS5cbiAgICAgIC8vIChQYXJzaW5nIGFsbCBwb3NzaWJsZSBjb21wb3VuZCBtZWRpYSBjb25kaXRpb25zIGluIEpTIGlzIGhlYXZ5LCBjb21wbGljYXRlZCxcbiAgICAgIC8vIGFuZCB0aGUgcGF5b2ZmIGlzIHVuY2xlYXIuIElzIHRoZXJlIGV2ZXIgYW4gc2l0dWF0aW9uIHdoZXJlIHRoZVxuICAgICAgLy8gbWVkaWEgY29uZGl0aW9uIHBhcnNlcyBpbmNvcnJlY3RseSBidXQgc3RpbGwgc29tZWhvdyBldmFsdWF0ZXMgdG8gdHJ1ZT9cbiAgICAgIC8vIENhbiB3ZSBqdXN0IHJlbHkgb24gdGhlIGJyb3dzZXIvcG9seWZpbGwgdG8gZG8gaXQ/KVxuICAgICAgdW5wYXJzZWRTaXplID0gdW5wYXJzZWRTaXplLmpvaW4oXCIgXCIpO1xuICAgICAgaWYgKCEocGYubWF0Y2hlc01lZGlhKHVucGFyc2VkU2l6ZSkpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyA1LiBSZXR1cm4gc2l6ZSBhbmQgZXhpdCB0aGlzIGFsZ29yaXRobS5cbiAgICAgIHJldHVybiBzaXplO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBhYm92ZSBhbGdvcml0aG0gZXhoYXVzdHMgdW5wYXJzZWQgc2l6ZXMgbGlzdCB3aXRob3V0IHJldHVybmluZyBhXG4gICAgLy8gc2l6ZSB2YWx1ZSwgcmV0dXJuIDEwMHZ3LlxuICAgIHJldHVybiBcIjEwMHZ3XCI7XG4gIH1cblxuICAvLyBuYW1lc3BhY2VcbiAgcGYubnMgPSAoXCJwZlwiICsgbmV3IERhdGUoKS5nZXRUaW1lKCkpLnN1YnN0cigwLCA5KTtcblxuICAvLyBzcmNzZXQgc3VwcG9ydCB0ZXN0XG4gIHBmLnN1cFNyY3NldCA9IFwic3Jjc2V0XCIgaW4gaW1hZ2U7XG4gIHBmLnN1cFNpemVzID0gXCJzaXplc1wiIGluIGltYWdlO1xuICBwZi5zdXBQaWN0dXJlID0gISF3aW5kb3cuSFRNTFBpY3R1cmVFbGVtZW50O1xuXG4gIC8vIFVDIGJyb3dzZXIgZG9lcyBjbGFpbSB0byBzdXBwb3J0IHNyY3NldCBhbmQgcGljdHVyZSwgYnV0IG5vdCBzaXplcyxcbiAgLy8gdGhpcyBleHRlbmRlZCB0ZXN0IHJldmVhbHMgdGhlIGJyb3dzZXIgZG9lcyBzdXBwb3J0IG5vdGhpbmdcbiAgaWYgKHBmLnN1cFNyY3NldCAmJiBwZi5zdXBQaWN0dXJlICYmICFwZi5zdXBTaXplcykge1xuICAgIChmdW5jdGlvbiAoaW1hZ2UyKSB7XG4gICAgICBpbWFnZS5zcmNzZXQgPSBcImRhdGE6LGFcIjtcbiAgICAgIGltYWdlMi5zcmMgPSBcImRhdGE6LGFcIjtcbiAgICAgIHBmLnN1cFNyY3NldCA9IGltYWdlLmNvbXBsZXRlID09PSBpbWFnZTIuY29tcGxldGU7XG4gICAgICBwZi5zdXBQaWN0dXJlID0gcGYuc3VwU3Jjc2V0ICYmIHBmLnN1cFBpY3R1cmU7XG4gICAgfSkoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKSk7XG4gIH1cblxuICAvLyBTYWZhcmk5IGhhcyBiYXNpYyBzdXBwb3J0IGZvciBzaXplcywgYnV0IGRvZXMndCBleHBvc2UgdGhlIGBzaXplc2AgaWRsIGF0dHJpYnV0ZVxuICBpZiAocGYuc3VwU3Jjc2V0ICYmICFwZi5zdXBTaXplcykge1xuXG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB3aWR0aDIgPSBcImRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFnQUJBUEFBQVAvLy93QUFBQ0g1QkFBQUFBQUFMQUFBQUFBQ0FBRUFBQUlDQkFvQU93PT1cIjtcbiAgICAgIHZhciB3aWR0aDEgPSBcImRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFRQUJBQUFBQUNINUJBRUtBQUVBTEFBQUFBQUJBQUVBQUFJQ1RBRUFPdz09XCI7XG4gICAgICB2YXIgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgIHZhciB0ZXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgd2lkdGggPSBpbWcud2lkdGg7XG5cbiAgICAgICAgaWYgKHdpZHRoID09PSAyKSB7XG4gICAgICAgICAgcGYuc3VwU2l6ZXMgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgYWx3YXlzQ2hlY2tXRGVzY3JpcHRvciA9IHBmLnN1cFNyY3NldCAmJiAhcGYuc3VwU2l6ZXM7XG5cbiAgICAgICAgaXNTdXBwb3J0VGVzdFJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgLy8gZm9yY2UgYXN5bmNcbiAgICAgICAgc2V0VGltZW91dChwaWN0dXJlZmlsbCk7XG4gICAgICB9O1xuXG4gICAgICBpbWcub25sb2FkID0gdGVzdDtcbiAgICAgIGltZy5vbmVycm9yID0gdGVzdDtcbiAgICAgIGltZy5zZXRBdHRyaWJ1dGUoXCJzaXplc1wiLCBcIjlweFwiKTtcblxuICAgICAgaW1nLnNyY3NldCA9IHdpZHRoMSArIFwiIDF3LFwiICsgd2lkdGgyICsgXCIgOXdcIjtcbiAgICAgIGltZy5zcmMgPSB3aWR0aDE7XG4gICAgfSkoKTtcblxuICB9IGVsc2Uge1xuICAgIGlzU3VwcG9ydFRlc3RSZWFkeSA9IHRydWU7XG4gIH1cblxuICAvLyB1c2luZyBwZi5xc2EgaW5zdGVhZCBvZiBkb20gdHJhdmVyc2luZyBkb2VzIHNjYWxlIG11Y2ggYmV0dGVyLFxuICAvLyBlc3BlY2lhbGx5IG9uIHNpdGVzIG1peGluZyByZXNwb25zaXZlIGFuZCBub24tcmVzcG9uc2l2ZSBpbWFnZXNcbiAgcGYuc2VsU2hvcnQgPSBcInBpY3R1cmU+aW1nLGltZ1tzcmNzZXRdXCI7XG4gIHBmLnNlbCA9IHBmLnNlbFNob3J0O1xuICBwZi5jZmcgPSBjZmc7XG5cbiAgLyoqXG4gICAqIFNob3J0Y3V0IHByb3BlcnR5IGZvciBgZGV2aWNlUGl4ZWxSYXRpb2AgKCBmb3IgZWFzeSBvdmVycmlkaW5nIGluIHRlc3RzIClcbiAgICovXG4gIHBmLkRQUiA9IChEUFIgfHwgMSk7XG4gIHBmLnUgPSB1bml0cztcblxuICAvLyBjb250YWluZXIgb2Ygc3VwcG9ydGVkIG1pbWUgdHlwZXMgdGhhdCBvbmUgbWlnaHQgbmVlZCB0byBxdWFsaWZ5IGJlZm9yZSB1c2luZ1xuICBwZi50eXBlcyA9IHR5cGVzO1xuXG4gIHBmLnNldFNpemUgPSBub29wO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgc3RyaW5nIGFuZCByZXR1cm5zIHRoZSBhYnNvbHV0ZSBVUkxcbiAgICogQHBhcmFtIHNyY1xuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBhYnNvbHV0ZSBVUkxcbiAgICovXG5cbiAgcGYubWFrZVVybCA9IG1lbW9pemUoZnVuY3Rpb24gKHNyYykge1xuICAgIGFuY2hvci5ocmVmID0gc3JjO1xuICAgIHJldHVybiBhbmNob3IuaHJlZjtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBET00gZWxlbWVudCBvciBkb2N1bWVudCBhbmQgYSBzZWxjdG9yIGFuZCByZXR1cm5zIHRoZSBmb3VuZCBtYXRjaGVzXG4gICAqIENhbiBiZSBleHRlbmRlZCB3aXRoIGpRdWVyeS9TaXp6bGUgZm9yIElFNyBzdXBwb3J0XG4gICAqIEBwYXJhbSBjb250ZXh0XG4gICAqIEBwYXJhbSBzZWxcbiAgICogQHJldHVybnMge05vZGVMaXN0fEFycmF5fVxuICAgKi9cbiAgcGYucXNhID0gZnVuY3Rpb24gKGNvbnRleHQsIHNlbCkge1xuICAgIHJldHVybiAoXCJxdWVyeVNlbGVjdG9yXCIgaW4gY29udGV4dCkgPyBjb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKSA6IFtdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTaG9ydGN1dCBtZXRob2QgZm9yIG1hdGNoTWVkaWEgKCBmb3IgZWFzeSBvdmVycmlkaW5nIGluIHRlc3RzIClcbiAgICogd2V0aGVyIG5hdGl2ZSBvciBwZi5tTVEgaXMgdXNlZCB3aWxsIGJlIGRlY2lkZWQgbGF6eSBvbiBmaXJzdCBjYWxsXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgcGYubWF0Y2hlc01lZGlhID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh3aW5kb3cubWF0Y2hNZWRpYSAmJiAobWF0Y2hNZWRpYShcIihtaW4td2lkdGg6IDAuMWVtKVwiKSB8fCB7fSkubWF0Y2hlcykge1xuICAgICAgcGYubWF0Y2hlc01lZGlhID0gZnVuY3Rpb24gKG1lZGlhKSB7XG4gICAgICAgIHJldHVybiAhbWVkaWEgfHwgKG1hdGNoTWVkaWEobWVkaWEpLm1hdGNoZXMpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGYubWF0Y2hlc01lZGlhID0gcGYubU1RO1xuICAgIH1cblxuICAgIHJldHVybiBwZi5tYXRjaGVzTWVkaWEuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcblxuICAvKipcbiAgICogQSBzaW1wbGlmaWVkIG1hdGNoTWVkaWEgaW1wbGVtZW50YXRpb24gZm9yIElFOCBhbmQgSUU5XG4gICAqIGhhbmRsZXMgb25seSBtaW4td2lkdGgvbWF4LXdpZHRoIHdpdGggcHggb3IgZW0gdmFsdWVzXG4gICAqIEBwYXJhbSBtZWRpYVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIHBmLm1NUSA9IGZ1bmN0aW9uIChtZWRpYSkge1xuICAgIHJldHVybiBtZWRpYSA/IGV2YWxDU1MobWVkaWEpIDogdHJ1ZTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY2FsY3VsYXRlZCBsZW5ndGggaW4gY3NzIHBpeGVsIGZyb20gdGhlIGdpdmVuIHNvdXJjZVNpemVWYWx1ZVxuICAgKiBodHRwOi8vZGV2LnczLm9yZy9jc3N3Zy9jc3MtdmFsdWVzLTMvI2xlbmd0aC12YWx1ZVxuICAgKiBpbnRlbmRlZCBTcGVjIG1pc21hdGNoZXM6XG4gICAqICogRG9lcyBub3QgY2hlY2sgZm9yIGludmFsaWQgdXNlIG9mIENTUyBmdW5jdGlvbnNcbiAgICogKiBEb2VzIGhhbmRsZSBhIGNvbXB1dGVkIGxlbmd0aCBvZiAwIHRoZSBzYW1lIGFzIGEgbmVnYXRpdmUgYW5kIHRoZXJlZm9yZSBpbnZhbGlkIHZhbHVlXG4gICAqIEBwYXJhbSBzb3VyY2VTaXplVmFsdWVcbiAgICogQHJldHVybnMge051bWJlcn1cbiAgICovXG4gIHBmLmNhbGNMZW5ndGggPSBmdW5jdGlvbiAoc291cmNlU2l6ZVZhbHVlKSB7XG5cbiAgICB2YXIgdmFsdWUgPSBldmFsQ1NTKHNvdXJjZVNpemVWYWx1ZSwgdHJ1ZSkgfHwgZmFsc2U7XG4gICAgaWYgKHZhbHVlIDwgMCkge1xuICAgICAgdmFsdWUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIFRha2VzIGEgdHlwZSBzdHJpbmcgYW5kIGNoZWNrcyBpZiBpdHMgc3VwcG9ydGVkXG4gICAqL1xuXG4gIHBmLnN1cHBvcnRzVHlwZSA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgcmV0dXJuICh0eXBlKSA/IHR5cGVzW3R5cGVdIDogdHJ1ZTtcbiAgfTtcblxuICAvKipcbiAgICogUGFyc2VzIGEgc291cmNlU2l6ZSBpbnRvIG1lZGlhQ29uZGl0aW9uIChtZWRpYSkgYW5kIHNvdXJjZVNpemVWYWx1ZSAobGVuZ3RoKVxuICAgKiBAcGFyYW0gc291cmNlU2l6ZVN0clxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIHBmLnBhcnNlU2l6ZSA9IG1lbW9pemUoZnVuY3Rpb24gKHNvdXJjZVNpemVTdHIpIHtcbiAgICB2YXIgbWF0Y2ggPSAoc291cmNlU2l6ZVN0ciB8fCBcIlwiKS5tYXRjaChyZWdTaXplKTtcbiAgICByZXR1cm4ge1xuICAgICAgbWVkaWE6IG1hdGNoICYmIG1hdGNoWzFdLFxuICAgICAgbGVuZ3RoOiBtYXRjaCAmJiBtYXRjaFsyXVxuICAgIH07XG4gIH0pO1xuXG4gIHBmLnBhcnNlU2V0ID0gZnVuY3Rpb24gKHNldCkge1xuICAgIGlmICghc2V0LmNhbmRzKSB7XG4gICAgICBzZXQuY2FuZHMgPSBwYXJzZVNyY3NldChzZXQuc3Jjc2V0LCBzZXQpO1xuICAgIH1cbiAgICByZXR1cm4gc2V0LmNhbmRzO1xuICB9O1xuXG4gIC8qKlxuICAgKiByZXR1cm5zIDFlbSBpbiBjc3MgcHggZm9yIGh0bWwvYm9keSBkZWZhdWx0IHNpemVcbiAgICogZnVuY3Rpb24gdGFrZW4gZnJvbSByZXNwb25kanNcbiAgICogQHJldHVybnMgeyp8bnVtYmVyfVxuICAgKi9cbiAgcGYuZ2V0RW1WYWx1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYm9keTtcbiAgICBpZiAoIWVtaW5weCAmJiAoYm9keSA9IGRvY3VtZW50LmJvZHkpKSB7XG4gICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxcbiAgICAgICAgb3JpZ2luYWxIVE1MQ1NTID0gZG9jRWxlbS5zdHlsZS5jc3NUZXh0LFxuICAgICAgICBvcmlnaW5hbEJvZHlDU1MgPSBib2R5LnN0eWxlLmNzc1RleHQ7XG5cbiAgICAgIGRpdi5zdHlsZS5jc3NUZXh0ID0gYmFzZVN0eWxlO1xuXG4gICAgICAvLyAxZW0gaW4gYSBtZWRpYSBxdWVyeSBpcyB0aGUgdmFsdWUgb2YgdGhlIGRlZmF1bHQgZm9udCBzaXplIG9mIHRoZSBicm93c2VyXG4gICAgICAvLyByZXNldCBkb2NFbGVtIGFuZCBib2R5IHRvIGVuc3VyZSB0aGUgY29ycmVjdCB2YWx1ZSBpcyByZXR1cm5lZFxuICAgICAgZG9jRWxlbS5zdHlsZS5jc3NUZXh0ID0gZnNDc3M7XG4gICAgICBib2R5LnN0eWxlLmNzc1RleHQgPSBmc0NzcztcblxuICAgICAgYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgZW1pbnB4ID0gZGl2Lm9mZnNldFdpZHRoO1xuICAgICAgYm9keS5yZW1vdmVDaGlsZChkaXYpO1xuXG4gICAgICAvL2Fsc28gdXBkYXRlIGVtaW5weCBiZWZvcmUgcmV0dXJuaW5nXG4gICAgICBlbWlucHggPSBwYXJzZUZsb2F0KGVtaW5weCwgMTApO1xuXG4gICAgICAvLyByZXN0b3JlIHRoZSBvcmlnaW5hbCB2YWx1ZXNcbiAgICAgIGRvY0VsZW0uc3R5bGUuY3NzVGV4dCA9IG9yaWdpbmFsSFRNTENTUztcbiAgICAgIGJvZHkuc3R5bGUuY3NzVGV4dCA9IG9yaWdpbmFsQm9keUNTUztcblxuICAgIH1cbiAgICByZXR1cm4gZW1pbnB4IHx8IDE2O1xuICB9O1xuXG4gIC8qKlxuICAgKiBUYWtlcyBhIHN0cmluZyBvZiBzaXplcyBhbmQgcmV0dXJucyB0aGUgd2lkdGggaW4gcGl4ZWxzIGFzIGEgbnVtYmVyXG4gICAqL1xuICBwZi5jYWxjTGlzdExlbmd0aCA9IGZ1bmN0aW9uIChzb3VyY2VTaXplTGlzdFN0cikge1xuICAgIC8vIFNwbGl0IHVwIHNvdXJjZSBzaXplIGxpc3QsIGllICggbWF4LXdpZHRoOiAzMGVtICkgMTAwJSwgKCBtYXgtd2lkdGg6IDUwZW0gKSA1MCUsIDMzJVxuICAgIC8vXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICBvciAobWluLXdpZHRoOjMwZW0pIGNhbGMoMzAlIC0gMTVweClcbiAgICBpZiAoIShzb3VyY2VTaXplTGlzdFN0ciBpbiBzaXplTGVuZ3RoQ2FjaGUpIHx8IGNmZy51VCkge1xuICAgICAgdmFyIHdpbm5pbmdMZW5ndGggPSBwZi5jYWxjTGVuZ3RoKHBhcnNlU2l6ZXMoc291cmNlU2l6ZUxpc3RTdHIpKTtcblxuICAgICAgc2l6ZUxlbmd0aENhY2hlW3NvdXJjZVNpemVMaXN0U3RyXSA9ICF3aW5uaW5nTGVuZ3RoID8gdW5pdHMud2lkdGggOiB3aW5uaW5nTGVuZ3RoO1xuICAgIH1cblxuICAgIHJldHVybiBzaXplTGVuZ3RoQ2FjaGVbc291cmNlU2l6ZUxpc3RTdHJdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBUYWtlcyBhIGNhbmRpZGF0ZSBvYmplY3Qgd2l0aCBhIHNyY3NldCBwcm9wZXJ0eSBpbiB0aGUgZm9ybSBvZiB1cmwvXG4gICAqIGV4LiBcImltYWdlcy9waWMtbWVkaXVtLnBuZyAxeCwgaW1hZ2VzL3BpYy1tZWRpdW0tMngucG5nIDJ4XCIgb3JcbiAgICogICAgIFwiaW1hZ2VzL3BpYy1tZWRpdW0ucG5nIDQwMHcsIGltYWdlcy9waWMtbWVkaXVtLTJ4LnBuZyA4MDB3XCIgb3JcbiAgICogICAgIFwiaW1hZ2VzL3BpYy1zbWFsbC5wbmdcIlxuICAgKiBHZXQgYW4gYXJyYXkgb2YgaW1hZ2UgY2FuZGlkYXRlcyBpbiB0aGUgZm9ybSBvZlxuICAgKiAgICAgIHt1cmw6IFwiL2Zvby9iYXIucG5nXCIsIHJlc29sdXRpb246IDF9XG4gICAqIHdoZXJlIHJlc29sdXRpb24gaXMgaHR0cDovL2Rldi53My5vcmcvY3Nzd2cvY3NzLXZhbHVlcy0zLyNyZXNvbHV0aW9uLXZhbHVlXG4gICAqIElmIHNpemVzIGlzIHNwZWNpZmllZCwgcmVzIGlzIGNhbGN1bGF0ZWRcbiAgICovXG4gIHBmLnNldFJlcyA9IGZ1bmN0aW9uIChzZXQpIHtcbiAgICB2YXIgY2FuZGlkYXRlcztcbiAgICBpZiAoc2V0KSB7XG5cbiAgICAgIGNhbmRpZGF0ZXMgPSBwZi5wYXJzZVNldChzZXQpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FuZGlkYXRlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBzZXRSZXNvbHV0aW9uKGNhbmRpZGF0ZXNbaV0sIHNldC5zaXplcyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjYW5kaWRhdGVzO1xuICB9O1xuXG4gIHBmLnNldFJlcy5yZXMgPSBzZXRSZXNvbHV0aW9uO1xuXG4gIHBmLmFwcGx5U2V0Q2FuZGlkYXRlID0gZnVuY3Rpb24gKGNhbmRpZGF0ZXMsIGltZykge1xuICAgIGlmICghY2FuZGlkYXRlcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGNhbmRpZGF0ZSxcbiAgICAgIGksXG4gICAgICBqLFxuICAgICAgbGVuZ3RoLFxuICAgICAgYmVzdENhbmRpZGF0ZSxcbiAgICAgIGN1clNyYyxcbiAgICAgIGN1ckNhbixcbiAgICAgIGNhbmRpZGF0ZVNyYyxcbiAgICAgIGFib3J0Q3VyU3JjO1xuXG4gICAgdmFyIGltYWdlRGF0YSA9IGltZ1twZi5uc107XG4gICAgdmFyIGRwciA9IHBmLkRQUjtcblxuICAgIGN1clNyYyA9IGltYWdlRGF0YS5jdXJTcmMgfHwgaW1nW2N1clNyY1Byb3BdO1xuXG4gICAgY3VyQ2FuID0gaW1hZ2VEYXRhLmN1ckNhbiB8fCBzZXRTcmNUb0N1cihpbWcsIGN1clNyYywgY2FuZGlkYXRlc1swXS5zZXQpO1xuXG4gICAgLy8gaWYgd2UgaGF2ZSBhIGN1cnJlbnQgc291cmNlLCB3ZSBtaWdodCBlaXRoZXIgYmVjb21lIGxhenkgb3IgZ2l2ZSB0aGlzIHNvdXJjZSBzb21lIGFkdmFudGFnZVxuICAgIGlmIChjdXJDYW4gJiYgY3VyQ2FuLnNldCA9PT0gY2FuZGlkYXRlc1swXS5zZXQpIHtcblxuICAgICAgLy8gaWYgYnJvd3NlciBjYW4gYWJvcnQgaW1hZ2UgcmVxdWVzdCBhbmQgdGhlIGltYWdlIGhhcyBhIGhpZ2hlciBwaXhlbCBkZW5zaXR5IHRoYW4gbmVlZGVkXG4gICAgICAvLyBhbmQgdGhpcyBpbWFnZSBpc24ndCBkb3dubG9hZGVkIHlldCwgd2Ugc2tpcCBuZXh0IHBhcnQgYW5kIHRyeSB0byBzYXZlIGJhbmR3aWR0aFxuICAgICAgYWJvcnRDdXJTcmMgPSAoc3VwcG9ydEFib3J0ICYmICFpbWcuY29tcGxldGUgJiYgY3VyQ2FuLnJlcyAtIDAuMSA+IGRwcik7XG5cbiAgICAgIGlmICghYWJvcnRDdXJTcmMpIHtcbiAgICAgICAgY3VyQ2FuLmNhY2hlZCA9IHRydWU7XG5cbiAgICAgICAgLy8gaWYgY3VycmVudCBjYW5kaWRhdGUgaXMgXCJiZXN0XCIsIFwiYmV0dGVyXCIgb3IgXCJva2F5XCIsXG4gICAgICAgIC8vIHNldCBpdCB0byBiZXN0Q2FuZGlkYXRlXG4gICAgICAgIGlmIChjdXJDYW4ucmVzID49IGRwcikge1xuICAgICAgICAgIGJlc3RDYW5kaWRhdGUgPSBjdXJDYW47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWJlc3RDYW5kaWRhdGUpIHtcblxuICAgICAgY2FuZGlkYXRlcy5zb3J0KGFzY2VuZGluZ1NvcnQpO1xuXG4gICAgICBsZW5ndGggPSBjYW5kaWRhdGVzLmxlbmd0aDtcbiAgICAgIGJlc3RDYW5kaWRhdGUgPSBjYW5kaWRhdGVzW2xlbmd0aCAtIDFdO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY2FuZGlkYXRlID0gY2FuZGlkYXRlc1tpXTtcbiAgICAgICAgaWYgKGNhbmRpZGF0ZS5yZXMgPj0gZHByKSB7XG4gICAgICAgICAgaiA9IGkgLSAxO1xuXG4gICAgICAgICAgLy8gd2UgaGF2ZSBmb3VuZCB0aGUgcGVyZmVjdCBjYW5kaWRhdGUsXG4gICAgICAgICAgLy8gYnV0IGxldCdzIGltcHJvdmUgdGhpcyBhIGxpdHRsZSBiaXQgd2l0aCBzb21lIGFzc3VtcHRpb25zIDstKVxuICAgICAgICAgIGlmIChjYW5kaWRhdGVzW2pdICYmXG4gICAgICAgICAgICAoYWJvcnRDdXJTcmMgfHwgY3VyU3JjICE9PSBwZi5tYWtlVXJsKGNhbmRpZGF0ZS51cmwpKSAmJlxuICAgICAgICAgICAgY2hvb3NlTG93UmVzKGNhbmRpZGF0ZXNbal0ucmVzLCBjYW5kaWRhdGUucmVzLCBkcHIsIGNhbmRpZGF0ZXNbal0uY2FjaGVkKSkge1xuXG4gICAgICAgICAgICBiZXN0Q2FuZGlkYXRlID0gY2FuZGlkYXRlc1tqXTtcblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiZXN0Q2FuZGlkYXRlID0gY2FuZGlkYXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChiZXN0Q2FuZGlkYXRlKSB7XG5cbiAgICAgIGNhbmRpZGF0ZVNyYyA9IHBmLm1ha2VVcmwoYmVzdENhbmRpZGF0ZS51cmwpO1xuXG4gICAgICBpbWFnZURhdGEuY3VyU3JjID0gY2FuZGlkYXRlU3JjO1xuICAgICAgaW1hZ2VEYXRhLmN1ckNhbiA9IGJlc3RDYW5kaWRhdGU7XG5cbiAgICAgIGlmIChjYW5kaWRhdGVTcmMgIT09IGN1clNyYykge1xuICAgICAgICBwZi5zZXRTcmMoaW1nLCBiZXN0Q2FuZGlkYXRlKTtcbiAgICAgIH1cbiAgICAgIHBmLnNldFNpemUoaW1nKTtcbiAgICB9XG4gIH07XG5cbiAgcGYuc2V0U3JjID0gZnVuY3Rpb24gKGltZywgYmVzdENhbmRpZGF0ZSkge1xuICAgIHZhciBvcmlnV2lkdGg7XG4gICAgaW1nLnNyYyA9IGJlc3RDYW5kaWRhdGUudXJsO1xuXG4gICAgLy8gYWx0aG91Z2ggdGhpcyBpcyBhIHNwZWNpZmljIFNhZmFyaSBpc3N1ZSwgd2UgZG9uJ3Qgd2FudCB0byB0YWtlIHRvbyBtdWNoIGRpZmZlcmVudCBjb2RlIHBhdGhzXG4gICAgaWYgKGJlc3RDYW5kaWRhdGUuc2V0LnR5cGUgPT09IFwiaW1hZ2Uvc3ZnK3htbFwiKSB7XG4gICAgICBvcmlnV2lkdGggPSBpbWcuc3R5bGUud2lkdGg7XG4gICAgICBpbWcuc3R5bGUud2lkdGggPSAoaW1nLm9mZnNldFdpZHRoICsgMSkgKyBcInB4XCI7XG5cbiAgICAgIC8vIG5leHQgbGluZSBvbmx5IHNob3VsZCB0cmlnZ2VyIGEgcmVwYWludFxuICAgICAgLy8gaWYuLi4gaXMgb25seSBkb25lIHRvIHRyaWNrIGRlYWQgY29kZSByZW1vdmFsXG4gICAgICBpZiAoaW1nLm9mZnNldFdpZHRoICsgMSkge1xuICAgICAgICBpbWcuc3R5bGUud2lkdGggPSBvcmlnV2lkdGg7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHBmLmdldFNldCA9IGZ1bmN0aW9uIChpbWcpIHtcbiAgICB2YXIgaSwgc2V0LCBzdXBwb3J0c1R5cGU7XG4gICAgdmFyIG1hdGNoID0gZmFsc2U7XG4gICAgdmFyIHNldHMgPSBpbWdbcGYubnNdLnNldHM7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgc2V0cy5sZW5ndGggJiYgIW1hdGNoOyBpKyspIHtcbiAgICAgIHNldCA9IHNldHNbaV07XG5cbiAgICAgIGlmICghc2V0LnNyY3NldCB8fCAhcGYubWF0Y2hlc01lZGlhKHNldC5tZWRpYSkgfHwgIShzdXBwb3J0c1R5cGUgPSBwZi5zdXBwb3J0c1R5cGUoc2V0LnR5cGUpKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN1cHBvcnRzVHlwZSA9PT0gXCJwZW5kaW5nXCIpIHtcbiAgICAgICAgc2V0ID0gc3VwcG9ydHNUeXBlO1xuICAgICAgfVxuXG4gICAgICBtYXRjaCA9IHNldDtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBtYXRjaDtcbiAgfTtcblxuICBwZi5wYXJzZVNldHMgPSBmdW5jdGlvbiAoZWxlbWVudCwgcGFyZW50LCBvcHRpb25zKSB7XG4gICAgdmFyIHNyY3NldEF0dHJpYnV0ZSwgaW1hZ2VTZXQsIGlzV0Rlc2NyaXBvciwgc3Jjc2V0UGFyc2VkO1xuXG4gICAgdmFyIGhhc1BpY3R1cmUgPSBwYXJlbnQgJiYgcGFyZW50Lm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgPT09IFwiUElDVFVSRVwiO1xuICAgIHZhciBpbWFnZURhdGEgPSBlbGVtZW50W3BmLm5zXTtcblxuICAgIGlmIChpbWFnZURhdGEuc3JjID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5zcmMpIHtcbiAgICAgIGltYWdlRGF0YS5zcmMgPSBnZXRJbWdBdHRyLmNhbGwoZWxlbWVudCwgXCJzcmNcIik7XG4gICAgICBpZiAoaW1hZ2VEYXRhLnNyYykge1xuICAgICAgICBzZXRJbWdBdHRyLmNhbGwoZWxlbWVudCwgc3JjQXR0ciwgaW1hZ2VEYXRhLnNyYyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZW1vdmVJbWdBdHRyLmNhbGwoZWxlbWVudCwgc3JjQXR0cik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGltYWdlRGF0YS5zcmNzZXQgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnNyY3NldCB8fCAhcGYuc3VwU3Jjc2V0IHx8IGVsZW1lbnQuc3Jjc2V0KSB7XG4gICAgICBzcmNzZXRBdHRyaWJ1dGUgPSBnZXRJbWdBdHRyLmNhbGwoZWxlbWVudCwgXCJzcmNzZXRcIik7XG4gICAgICBpbWFnZURhdGEuc3Jjc2V0ID0gc3Jjc2V0QXR0cmlidXRlO1xuICAgICAgc3Jjc2V0UGFyc2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpbWFnZURhdGEuc2V0cyA9IFtdO1xuXG4gICAgaWYgKGhhc1BpY3R1cmUpIHtcbiAgICAgIGltYWdlRGF0YS5waWMgPSB0cnVlO1xuICAgICAgZ2V0QWxsU291cmNlRWxlbWVudHMocGFyZW50LCBpbWFnZURhdGEuc2V0cyk7XG4gICAgfVxuXG4gICAgaWYgKGltYWdlRGF0YS5zcmNzZXQpIHtcbiAgICAgIGltYWdlU2V0ID0ge1xuICAgICAgICBzcmNzZXQ6IGltYWdlRGF0YS5zcmNzZXQsXG4gICAgICAgIHNpemVzOiBnZXRJbWdBdHRyLmNhbGwoZWxlbWVudCwgXCJzaXplc1wiKVxuICAgICAgfTtcblxuICAgICAgaW1hZ2VEYXRhLnNldHMucHVzaChpbWFnZVNldCk7XG5cbiAgICAgIGlzV0Rlc2NyaXBvciA9IChhbHdheXNDaGVja1dEZXNjcmlwdG9yIHx8IGltYWdlRGF0YS5zcmMpICYmIHJlZ1dEZXNjLnRlc3QoaW1hZ2VEYXRhLnNyY3NldCB8fCBcIlwiKTtcblxuICAgICAgLy8gYWRkIG5vcm1hbCBzcmMgYXMgY2FuZGlkYXRlLCBpZiBzb3VyY2UgaGFzIG5vIHcgZGVzY3JpcHRvclxuICAgICAgaWYgKCFpc1dEZXNjcmlwb3IgJiYgaW1hZ2VEYXRhLnNyYyAmJiAhZ2V0Q2FuZGlkYXRlRm9yU3JjKGltYWdlRGF0YS5zcmMsIGltYWdlU2V0KSAmJiAhaW1hZ2VTZXQuaGFzMXgpIHtcbiAgICAgICAgaW1hZ2VTZXQuc3Jjc2V0ICs9IFwiLCBcIiArIGltYWdlRGF0YS5zcmM7XG4gICAgICAgIGltYWdlU2V0LmNhbmRzLnB1c2goe1xuICAgICAgICAgIHVybDogaW1hZ2VEYXRhLnNyYyxcbiAgICAgICAgICBkOiAxLFxuICAgICAgICAgIHNldDogaW1hZ2VTZXRcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICB9IGVsc2UgaWYgKGltYWdlRGF0YS5zcmMpIHtcbiAgICAgIGltYWdlRGF0YS5zZXRzLnB1c2goe1xuICAgICAgICBzcmNzZXQ6IGltYWdlRGF0YS5zcmMsXG4gICAgICAgIHNpemVzOiBudWxsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpbWFnZURhdGEuY3VyQ2FuID0gbnVsbDtcbiAgICBpbWFnZURhdGEuY3VyU3JjID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gaWYgaW1nIGhhcyBwaWN0dXJlIG9yIHRoZSBzcmNzZXQgd2FzIHJlbW92ZWQgb3IgaGFzIGEgc3Jjc2V0IGFuZCBkb2VzIG5vdCBzdXBwb3J0IHNyY3NldCBhdCBhbGxcbiAgICAvLyBvciBoYXMgYSB3IGRlc2NyaXB0b3IgKGFuZCBkb2VzIG5vdCBzdXBwb3J0IHNpemVzKSBzZXQgc3VwcG9ydCB0byBmYWxzZSB0byBldmFsdWF0ZVxuICAgIGltYWdlRGF0YS5zdXBwb3J0ZWQgPSAhKGhhc1BpY3R1cmUgfHwgKGltYWdlU2V0ICYmICFwZi5zdXBTcmNzZXQpIHx8IChpc1dEZXNjcmlwb3IgJiYgIXBmLnN1cFNpemVzKSk7XG5cbiAgICBpZiAoc3Jjc2V0UGFyc2VkICYmIHBmLnN1cFNyY3NldCAmJiAhaW1hZ2VEYXRhLnN1cHBvcnRlZCkge1xuICAgICAgaWYgKHNyY3NldEF0dHJpYnV0ZSkge1xuICAgICAgICBzZXRJbWdBdHRyLmNhbGwoZWxlbWVudCwgc3Jjc2V0QXR0ciwgc3Jjc2V0QXR0cmlidXRlKTtcbiAgICAgICAgZWxlbWVudC5zcmNzZXQgPSBcIlwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVtb3ZlSW1nQXR0ci5jYWxsKGVsZW1lbnQsIHNyY3NldEF0dHIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpbWFnZURhdGEuc3VwcG9ydGVkICYmICFpbWFnZURhdGEuc3Jjc2V0ICYmICgoIWltYWdlRGF0YS5zcmMgJiYgZWxlbWVudC5zcmMpIHx8IGVsZW1lbnQuc3JjICE9PSBwZi5tYWtlVXJsKGltYWdlRGF0YS5zcmMpKSkge1xuICAgICAgaWYgKGltYWdlRGF0YS5zcmMgPT09IG51bGwpIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJzcmNcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LnNyYyA9IGltYWdlRGF0YS5zcmM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaW1hZ2VEYXRhLnBhcnNlZCA9IHRydWU7XG4gIH07XG5cbiAgcGYuZmlsbEltZyA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdmFyIGltYWdlRGF0YTtcbiAgICB2YXIgZXh0cmVtZSA9IG9wdGlvbnMucmVzZWxlY3QgfHwgb3B0aW9ucy5yZWV2YWx1YXRlO1xuXG4gICAgLy8gZXhwYW5kbyBmb3IgY2FjaGluZyBkYXRhIG9uIHRoZSBpbWdcbiAgICBpZiAoIWVsZW1lbnRbcGYubnNdKSB7XG4gICAgICBlbGVtZW50W3BmLm5zXSA9IHt9O1xuICAgIH1cblxuICAgIGltYWdlRGF0YSA9IGVsZW1lbnRbcGYubnNdO1xuXG4gICAgLy8gaWYgdGhlIGVsZW1lbnQgaGFzIGFscmVhZHkgYmVlbiBldmFsdWF0ZWQsIHNraXAgaXRcbiAgICAvLyB1bmxlc3MgYG9wdGlvbnMucmVldmFsdWF0ZWAgaXMgc2V0IHRvIHRydWUgKCB0aGlzLCBmb3IgZXhhbXBsZSxcbiAgICAvLyBpcyBzZXQgdG8gdHJ1ZSB3aGVuIHJ1bm5pbmcgYHBpY3R1cmVmaWxsYCBvbiBgcmVzaXplYCApLlxuICAgIGlmICghZXh0cmVtZSAmJiBpbWFnZURhdGEuZXZhbGVkID09PSBldmFsSWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIWltYWdlRGF0YS5wYXJzZWQgfHwgb3B0aW9ucy5yZWV2YWx1YXRlKSB7XG4gICAgICBwZi5wYXJzZVNldHMoZWxlbWVudCwgZWxlbWVudC5wYXJlbnROb2RlLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBpZiAoIWltYWdlRGF0YS5zdXBwb3J0ZWQpIHtcbiAgICAgIGFwcGx5QmVzdENhbmRpZGF0ZShlbGVtZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW1hZ2VEYXRhLmV2YWxlZCA9IGV2YWxJZDtcbiAgICB9XG4gIH07XG5cbiAgcGYuc2V0dXBSdW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFhbHJlYWR5UnVuIHx8IGlzVndEaXJ0eSB8fCAoRFBSICE9PSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbykpIHtcbiAgICAgIHVwZGF0ZU1ldHJpY3MoKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gSWYgcGljdHVyZSBpcyBzdXBwb3J0ZWQsIHdlbGwsIHRoYXQncyBhd2Vzb21lLlxuICBpZiAocGYuc3VwUGljdHVyZSkge1xuICAgIHBpY3R1cmVmaWxsID0gbm9vcDtcbiAgICBwZi5maWxsSW1nID0gbm9vcDtcbiAgfSBlbHNlIHtcblxuICAgIC8vIFNldCB1cCBwaWN0dXJlIHBvbHlmaWxsIGJ5IHBvbGxpbmcgdGhlIGRvY3VtZW50XG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBpc0RvbVJlYWR5O1xuICAgICAgdmFyIHJlZ1JlYWR5ID0gd2luZG93LmF0dGFjaEV2ZW50ID8gL2QkfF5jLyA6IC9kJHxeY3xeaS87XG5cbiAgICAgIHZhciBydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByZWFkeVN0YXRlID0gZG9jdW1lbnQucmVhZHlTdGF0ZSB8fCBcIlwiO1xuXG4gICAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHJ1biwgcmVhZHlTdGF0ZSA9PT0gXCJsb2FkaW5nXCIgPyAyMDAgOiA5OTkpO1xuICAgICAgICBpZiAoZG9jdW1lbnQuYm9keSkge1xuICAgICAgICAgIHBmLmZpbGxJbWdzKCk7XG4gICAgICAgICAgaXNEb21SZWFkeSA9IGlzRG9tUmVhZHkgfHwgcmVnUmVhZHkudGVzdChyZWFkeVN0YXRlKTtcbiAgICAgICAgICBpZiAoaXNEb21SZWFkeSkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVySWQpO1xuICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB2YXIgdGltZXJJZCA9IHNldFRpbWVvdXQocnVuLCBkb2N1bWVudC5ib2R5ID8gOSA6IDk5KTtcblxuICAgICAgLy8gQWxzbyBhdHRhY2ggcGljdHVyZWZpbGwgb24gcmVzaXplIGFuZCByZWFkeXN0YXRlY2hhbmdlXG4gICAgICAvLyBodHRwOi8vbW9kZXJuamF2YXNjcmlwdC5ibG9nc3BvdC5jb20vMjAxMy8wOC9idWlsZGluZy1iZXR0ZXItZGVib3VuY2UuaHRtbFxuICAgICAgdmFyIGRlYm91bmNlID0gZnVuY3Rpb24gKGZ1bmMsIHdhaXQpIHtcbiAgICAgICAgdmFyIHRpbWVvdXQsIHRpbWVzdGFtcDtcbiAgICAgICAgdmFyIGxhdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBsYXN0ID0gKG5ldyBEYXRlKCkpIC0gdGltZXN0YW1wO1xuXG4gICAgICAgICAgaWYgKGxhc3QgPCB3YWl0KSB7XG4gICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgIGZ1bmMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpO1xuXG4gICAgICAgICAgaWYgKCF0aW1lb3V0KSB7XG4gICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfTtcbiAgICAgIHZhciBsYXN0Q2xpZW50V2lkdGggPSBkb2NFbGVtLmNsaWVudEhlaWdodDtcbiAgICAgIHZhciBvblJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaXNWd0RpcnR5ID0gTWF0aC5tYXgod2luZG93LmlubmVyV2lkdGggfHwgMCwgZG9jRWxlbS5jbGllbnRXaWR0aCkgIT09IHVuaXRzLndpZHRoIHx8IGRvY0VsZW0uY2xpZW50SGVpZ2h0ICE9PSBsYXN0Q2xpZW50V2lkdGg7XG4gICAgICAgIGxhc3RDbGllbnRXaWR0aCA9IGRvY0VsZW0uY2xpZW50SGVpZ2h0O1xuICAgICAgICBpZiAoaXNWd0RpcnR5KSB7XG4gICAgICAgICAgcGYuZmlsbEltZ3MoKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgb24od2luZG93LCBcInJlc2l6ZVwiLCBkZWJvdW5jZShvblJlc2l6ZSwgOTkpKTtcbiAgICAgIG9uKGRvY3VtZW50LCBcInJlYWR5c3RhdGVjaGFuZ2VcIiwgcnVuKTtcbiAgICB9KSgpO1xuICB9XG5cbiAgcGYucGljdHVyZWZpbGwgPSBwaWN0dXJlZmlsbDtcbiAgLy91c2UgdGhpcyBpbnRlcm5hbGx5IGZvciBlYXN5IG1vbmtleSBwYXRjaGluZy9wZXJmb3JtYW5jZSB0ZXN0aW5nXG4gIHBmLmZpbGxJbWdzID0gcGljdHVyZWZpbGw7XG4gIHBmLnRlYXJkb3duUnVuID0gbm9vcDtcblxuICAvKiBleHBvc2UgbWV0aG9kcyBmb3IgdGVzdGluZyAqL1xuICBwaWN0dXJlZmlsbC5fID0gcGY7XG5cbiAgd2luZG93LnBpY3R1cmVmaWxsQ0ZHID0ge1xuICAgIHBmOiBwZixcbiAgICBwdXNoOiBmdW5jdGlvbiAoYXJncykge1xuICAgICAgdmFyIG5hbWUgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICBpZiAodHlwZW9mIHBmW25hbWVdID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcGZbbmFtZV0uYXBwbHkocGYsIGFyZ3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2ZnW25hbWVdID0gYXJnc1swXTtcbiAgICAgICAgaWYgKGFscmVhZHlSdW4pIHtcbiAgICAgICAgICBwZi5maWxsSW1ncyh7XG4gICAgICAgICAgICByZXNlbGVjdDogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHdoaWxlIChzZXRPcHRpb25zICYmIHNldE9wdGlvbnMubGVuZ3RoKSB7XG4gICAgd2luZG93LnBpY3R1cmVmaWxsQ0ZHLnB1c2goc2V0T3B0aW9ucy5zaGlmdCgpKTtcbiAgfVxuXG4gIC8qIGV4cG9zZSBwaWN0dXJlZmlsbCAqL1xuICB3aW5kb3cucGljdHVyZWZpbGwgPSBwaWN0dXJlZmlsbDtcblxuICAvKiBleHBvc2UgcGljdHVyZWZpbGwgKi9cbiAgaWYgKHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSBcIm9iamVjdFwiKSB7XG4gICAgLy8gQ29tbW9uSlMsIGp1c3QgZXhwb3J0XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBwaWN0dXJlZmlsbDtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIEFNRCBzdXBwb3J0XG4gICAgZGVmaW5lKFwicGljdHVyZWZpbGxcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHBpY3R1cmVmaWxsO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gSUU4IGV2YWxzIHRoaXMgc3luYywgc28gaXQgbXVzdCBiZSB0aGUgbGFzdCB0aGluZyB3ZSBkb1xuICBpZiAoIXBmLnN1cFBpY3R1cmUpIHtcbiAgICB0eXBlc1tcImltYWdlL3dlYnBcIl0gPSBkZXRlY3RUeXBlU3VwcG9ydChcImltYWdlL3dlYnBcIiwgXCJkYXRhOmltYWdlL3dlYnA7YmFzZTY0LFVrbEdSa29BQUFCWFJVSlFWbEE0V0FvQUFBQVFBQUFBQUFBQUFBQUFRVXhRU0F3QUFBQUJCeEFSL1E5RVJQOERBQUJXVURnZ0dBQUFBREFCQUowQktnRUFBUUFEQURRbHBBQURjQUQrKy8xUUFBPT1cIik7XG4gIH1cblxufSkod2luZG93LCBkb2N1bWVudCk7XG4iXSwiZmlsZSI6InBvbHlmaWxsLmpzIn0=

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBvbHlmaWxsLmVzNiJdLCJuYW1lcyI6WyJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJvYmplY3RGaXRJdGVtIiwib2JqZWN0Rml0SW1hZ2VzIiwiT0ZJIiwicHJvcFJlZ2V4IiwidGVzdEltZyIsIkltYWdlIiwic3R5bGUiLCJzdXBwb3J0c09iamVjdEZpdCIsInN1cHBvcnRzT2JqZWN0UG9zaXRpb24iLCJzdXBwb3J0c09GSSIsInN1cHBvcnRzQ3VycmVudFNyYyIsImN1cnJlbnRTcmMiLCJuYXRpdmVHZXRBdHRyaWJ1dGUiLCJnZXRBdHRyaWJ1dGUiLCJuYXRpdmVTZXRBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJhdXRvTW9kZUVuYWJsZWQiLCJjcmVhdGVQbGFjZWhvbGRlciIsInciLCJoIiwicG9seWZpbGxDdXJyZW50U3JjIiwiZWwiLCJzcmNzZXQiLCJ3aW5kb3ciLCJwaWN0dXJlZmlsbCIsInBmIiwiXyIsIm5zIiwiZXZhbGVkIiwiZmlsbEltZyIsInJlc2VsZWN0IiwiY3VyU3JjIiwic3VwcG9ydGVkIiwic3JjIiwiZ2V0U3R5bGUiLCJnZXRDb21wdXRlZFN0eWxlIiwiZm9udEZhbWlseSIsInBhcnNlZCIsInByb3BzIiwiZXhlYyIsInNldFBsYWNlaG9sZGVyIiwiaW1nIiwid2lkdGgiLCJoZWlnaHQiLCJwbGFjZWhvbGRlciIsImNhbGwiLCJvbkltYWdlUmVhZHkiLCJjYWxsYmFjayIsIm5hdHVyYWxXaWR0aCIsInNldFRpbWVvdXQiLCJmaXhPbmUiLCJvZmkiLCJza2lwVGVzdCIsIm5hdHVyYWxIZWlnaHQiLCJrZWVwU3JjVXNhYmxlIiwiZXJyIiwiY29uc29sZSIsIndhcm4iLCJiYWNrZ3JvdW5kSW1hZ2UiLCJyZXBsYWNlIiwiYmFja2dyb3VuZFBvc2l0aW9uIiwiYmFja2dyb3VuZFJlcGVhdCIsImJhY2tncm91bmRPcmlnaW4iLCJ0ZXN0IiwiYmFja2dyb3VuZFNpemUiLCJkZXNjcmlwdG9ycyIsImdldCIsInByb3AiLCJzZXQiLCJ2YWx1ZSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5Iiwic3MiLCJoaWphY2tBdHRyaWJ1dGVzIiwiZ2V0T2ZpSW1hZ2VNYXliZSIsIm5hbWUiLCJIVE1MSW1hZ2VFbGVtZW50IiwicHJvdG90eXBlIiwiU3RyaW5nIiwiZml4IiwiaW1ncyIsIm9wdHMiLCJzdGFydEF1dG9Nb2RlIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaSIsImxlbmd0aCIsImJvZHkiLCJlIiwidGFyZ2V0IiwidGFnTmFtZSIsIndhdGNoTVEiLCJiaW5kIiwic2VwcHVrdSIsImlzV2luZG93RGVmaW5lZCIsInRlc3ROb2RlIiwiY3JlYXRlRWxlbWVudCIsInNvbWUiLCJwcmVmaXgiLCJwb3NpdGlvbiIsImlzSW5pdGlhbGl6ZWQiLCJzaGFkb3dSb290RXhpc3RzIiwiU2hhZG93Um9vdCIsInNjcm9sbCIsInRvcCIsImxlZnQiLCJzdGlja2llcyIsImV4dGVuZCIsInRhcmdldE9iaiIsInNvdXJjZU9iamVjdCIsImtleSIsImhhc093blByb3BlcnR5IiwicGFyc2VOdW1lcmljIiwidmFsIiwicGFyc2VGbG9hdCIsImdldERvY09mZnNldFRvcCIsIm5vZGUiLCJkb2NPZmZzZXRUb3AiLCJvZmZzZXRUb3AiLCJvZmZzZXRQYXJlbnQiLCJTdGlja3kiLCJIVE1MRWxlbWVudCIsIkVycm9yIiwic3RpY2t5IiwiX25vZGUiLCJfc3RpY2t5TW9kZSIsIl9hY3RpdmUiLCJwdXNoIiwicmVmcmVzaCIsIl9yZW1vdmVkIiwiX2RlYWN0aXZhdGUiLCJub2RlQ29tcHV0ZWRTdHlsZSIsIm5vZGVDb21wdXRlZFByb3BzIiwiZGlzcGxheSIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsIm1hcmdpbkxlZnQiLCJtYXJnaW5SaWdodCIsImNzc0Zsb2F0IiwiaXNOYU4iLCJvcmlnaW5hbFBvc2l0aW9uIiwicmVmZXJlbmNlTm9kZSIsInBhcmVudE5vZGUiLCJob3N0Iiwibm9kZVdpbk9mZnNldCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInBhcmVudFdpbk9mZnNldCIsInBhcmVudENvbXB1dGVkU3R5bGUiLCJfcGFyZW50Iiwic3R5bGVzIiwib2Zmc2V0SGVpZ2h0IiwiX29mZnNldFRvV2luZG93IiwicmlnaHQiLCJkb2N1bWVudEVsZW1lbnQiLCJjbGllbnRXaWR0aCIsIl9vZmZzZXRUb1BhcmVudCIsImJvcmRlclRvcFdpZHRoIiwiYm9yZGVyTGVmdFdpZHRoIiwiYm9yZGVyUmlnaHRXaWR0aCIsIl9zdHlsZXMiLCJib3R0b20iLCJub2RlVG9wVmFsdWUiLCJfbGltaXRzIiwic3RhcnQiLCJwYWdlWU9mZnNldCIsImVuZCIsImJvcmRlckJvdHRvbVdpZHRoIiwicGFyZW50UG9zaXRpb24iLCJfcmVjYWxjUG9zaXRpb24iLCJjbG9uZSIsIl9jbG9uZSIsInBhZGRpbmciLCJib3JkZXIiLCJib3JkZXJTcGFjaW5nIiwiZm9udFNpemUiLCJpbnNlcnRCZWZvcmUiLCJzdGlja3lNb2RlIiwiTWF0aCIsImFicyIsInJlbW92ZUNoaWxkIiwiaW5kZXgiLCJzcGxpY2UiLCJTdGlja3lmaWxsIiwiZm9yY2VTdGlja3kiLCJpbml0IiwicmVmcmVzaEFsbCIsImFkZE9uZSIsImFkZCIsIm5vZGVMaXN0IiwiYWRkZWRTdGlja2llcyIsImZvckVhY2giLCJyZW1vdmVPbmUiLCJyZW1vdmUiLCJyZW1vdmVBbGwiLCJjaGVja1Njcm9sbCIsInBhZ2VYT2Zmc2V0IiwiZmFzdENoZWNrVGltZXIiLCJzdGFydEZhc3RDaGVja1RpbWVyIiwic2V0SW50ZXJ2YWwiLCJfZmFzdENoZWNrIiwic3RvcEZhc3RDaGVja1RpbWVyIiwiY2xlYXJJbnRlcnZhbCIsImRvY0hpZGRlbktleSIsInZpc2liaWxpdHlDaGFuZ2VFdmVudE5hbWUiLCJtb2R1bGUiLCJleHBvcnRzIiwidWEiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJIVE1MUGljdHVyZUVsZW1lbnQiLCJtYXRjaCIsIlJlZ0V4cCIsIiQxIiwidGltZXIiLCJkdW1teVNyYyIsImZpeFJlc3BpbWciLCJzb3VyY2UiLCJzaXplcyIsInBpY3R1cmUiLCJub2RlTmFtZSIsInRvVXBwZXJDYXNlIiwiY2xvbmVOb2RlIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJfcGZMYXN0U2l6ZSIsIm9mZnNldFdpZHRoIiwiZmluZFBpY3R1cmVJbWdzIiwib25SZXNpemUiLCJjbGVhclRpbWVvdXQiLCJtcSIsIm1hdGNoTWVkaWEiLCJhZGRMaXN0ZW5lciIsInJlYWR5U3RhdGUiLCJ1bmRlZmluZWQiLCJlbWlucHgiLCJhbHdheXNDaGVja1dEZXNjcmlwdG9yIiwiZXZhbElkIiwiaXNTdXBwb3J0VGVzdFJlYWR5Iiwibm9vcCIsImltYWdlIiwiZ2V0SW1nQXR0ciIsInNldEltZ0F0dHIiLCJyZW1vdmVJbWdBdHRyIiwicmVtb3ZlQXR0cmlidXRlIiwiZG9jRWxlbSIsInR5cGVzIiwiY2ZnIiwiYWxnb3JpdGhtIiwic3JjQXR0ciIsInNyY3NldEF0dHIiLCJzdXBwb3J0QWJvcnQiLCJjdXJTcmNQcm9wIiwicmVnV0Rlc2MiLCJyZWdTaXplIiwic2V0T3B0aW9ucyIsInBpY3R1cmVmaWxsQ0ZHIiwiYmFzZVN0eWxlIiwiZnNDc3MiLCJpc1Z3RGlydHkiLCJjc3NDYWNoZSIsInNpemVMZW5ndGhDYWNoZSIsIkRQUiIsImRldmljZVBpeGVsUmF0aW8iLCJ1bml0cyIsInB4IiwiYW5jaG9yIiwiYWxyZWFkeVJ1biIsInJlZ2V4TGVhZGluZ1NwYWNlcyIsInJlZ2V4TGVhZGluZ0NvbW1hc09yU3BhY2VzIiwicmVnZXhMZWFkaW5nTm90U3BhY2VzIiwicmVnZXhUcmFpbGluZ0NvbW1hcyIsInJlZ2V4Tm9uTmVnYXRpdmVJbnRlZ2VyIiwicmVnZXhGbG9hdGluZ1BvaW50Iiwib24iLCJvYmoiLCJldnQiLCJmbiIsImNhcHR1cmUiLCJhdHRhY2hFdmVudCIsIm1lbW9pemUiLCJjYWNoZSIsImlucHV0IiwiaXNTcGFjZSIsImMiLCJldmFsQ1NTIiwicmVnTGVuZ3RoIiwiYXJncyIsImFyZ3VtZW50cyIsInN0cmluZyIsImJ1aWxkU3RyIiwiY3NzIiwidG9Mb3dlckNhc2UiLCJwYXJzZWRMZW5ndGgiLCJGdW5jdGlvbiIsInNldFJlc29sdXRpb24iLCJjYW5kaWRhdGUiLCJzaXplc2F0dHIiLCJjV2lkdGgiLCJjYWxjTGlzdExlbmd0aCIsInJlcyIsImQiLCJvcHQiLCJlbGVtZW50cyIsInBsZW4iLCJvcHRpb25zIiwibm9kZVR5cGUiLCJjb250ZXh0IiwicXNhIiwicmVldmFsdWF0ZSIsInNlbCIsInNlbFNob3J0Iiwic2V0dXBSdW4iLCJ0ZWFyZG93blJ1biIsIm1lc3NhZ2UiLCJkZXRlY3RUeXBlU3VwcG9ydCIsInR5cGUiLCJ0eXBlVXJpIiwib25lcnJvciIsIm9ubG9hZCIsImltcGxlbWVudGF0aW9uIiwiaGFzRmVhdHVyZSIsInVwZGF0ZU1ldHJpY3MiLCJtYXgiLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJ2dyIsInZoIiwiam9pbiIsImVtIiwiZ2V0RW1WYWx1ZSIsInJlbSIsImNob29zZUxvd1JlcyIsImxvd2VyVmFsdWUiLCJoaWdoZXJWYWx1ZSIsImRwclZhbHVlIiwiaXNDYWNoZWQiLCJib251c0ZhY3RvciIsInRvb011Y2giLCJib251cyIsIm1lYW5EZW5zaXR5IiwicG93Iiwic3FydCIsImFwcGx5QmVzdENhbmRpZGF0ZSIsInNyY1NldENhbmRpZGF0ZXMiLCJtYXRjaGluZ1NldCIsImdldFNldCIsImV2YWx1YXRlZCIsInNldFJlcyIsImFwcGx5U2V0Q2FuZGlkYXRlIiwiYXNjZW5kaW5nU29ydCIsImEiLCJiIiwic2V0U3JjVG9DdXIiLCJzZXRzIiwiZ2V0Q2FuZGlkYXRlRm9yU3JjIiwibWFrZVVybCIsImN1ckNhbiIsImNhbmRpZGF0ZXMiLCJwYXJzZVNldCIsInVybCIsImdldEFsbFNvdXJjZUVsZW1lbnRzIiwibGVuIiwic291cmNlcyIsIm1lZGlhIiwicGFyc2VTcmNzZXQiLCJjb2xsZWN0Q2hhcmFjdGVycyIsInJlZ0V4IiwiY2hhcnMiLCJzdWJzdHJpbmciLCJwb3MiLCJpbnB1dExlbmd0aCIsImN1cnJlbnREZXNjcmlwdG9yIiwic3RhdGUiLCJwYXJzZURlc2NyaXB0b3JzIiwicEVycm9yIiwiZGVzYyIsImxhc3RDaGFyIiwiaW50VmFsIiwiZmxvYXRWYWwiLCJwYXJzZUludCIsImhhczF4IiwidG9rZW5pemUiLCJjaGFyQXQiLCJzbGljZSIsInBhcnNlU2l6ZXMiLCJzdHJWYWx1ZSIsInJlZ2V4Q3NzTGVuZ3RoV2l0aFVuaXRzIiwicmVnZXhDc3NDYWxjIiwidW5wYXJzZWRTaXplc0xpc3QiLCJ1bnBhcnNlZFNpemVzTGlzdExlbmd0aCIsInVucGFyc2VkU2l6ZSIsImxhc3RDb21wb25lbnRWYWx1ZSIsInNpemUiLCJwYXJzZUNvbXBvbmVudFZhbHVlcyIsInN0ciIsImNocmN0ciIsImNvbXBvbmVudCIsImNvbXBvbmVudEFycmF5IiwibGlzdEFycmF5IiwicGFyZW5EZXB0aCIsImluQ29tbWVudCIsInB1c2hDb21wb25lbnQiLCJwdXNoQ29tcG9uZW50QXJyYXkiLCJpc1ZhbGlkTm9uTmVnYXRpdmVTb3VyY2VTaXplVmFsdWUiLCJzIiwicG9wIiwibWF0Y2hlc01lZGlhIiwiRGF0ZSIsImdldFRpbWUiLCJzdWJzdHIiLCJzdXBTcmNzZXQiLCJzdXBTaXplcyIsInN1cFBpY3R1cmUiLCJpbWFnZTIiLCJjb21wbGV0ZSIsIndpZHRoMiIsIndpZHRoMSIsInUiLCJzZXRTaXplIiwiaHJlZiIsIm1hdGNoZXMiLCJtTVEiLCJhcHBseSIsImNhbGNMZW5ndGgiLCJzb3VyY2VTaXplVmFsdWUiLCJzdXBwb3J0c1R5cGUiLCJwYXJzZVNpemUiLCJzb3VyY2VTaXplU3RyIiwiY2FuZHMiLCJkaXYiLCJvcmlnaW5hbEhUTUxDU1MiLCJjc3NUZXh0Iiwib3JpZ2luYWxCb2R5Q1NTIiwiYXBwZW5kQ2hpbGQiLCJzb3VyY2VTaXplTGlzdFN0ciIsInVUIiwid2lubmluZ0xlbmd0aCIsImoiLCJiZXN0Q2FuZGlkYXRlIiwiY2FuZGlkYXRlU3JjIiwiYWJvcnRDdXJTcmMiLCJpbWFnZURhdGEiLCJkcHIiLCJjYWNoZWQiLCJzb3J0Iiwic2V0U3JjIiwib3JpZ1dpZHRoIiwicGFyc2VTZXRzIiwiZWxlbWVudCIsInBhcmVudCIsInNyY3NldEF0dHJpYnV0ZSIsImltYWdlU2V0IiwiaXNXRGVzY3JpcG9yIiwic3Jjc2V0UGFyc2VkIiwiaGFzUGljdHVyZSIsInBpYyIsImV4dHJlbWUiLCJpc0RvbVJlYWR5IiwicmVnUmVhZHkiLCJydW4iLCJ0aW1lcklkIiwiZmlsbEltZ3MiLCJkZWJvdW5jZSIsImZ1bmMiLCJ3YWl0IiwidGltZW91dCIsInRpbWVzdGFtcCIsImxhdGVyIiwibGFzdCIsImxhc3RDbGllbnRXaWR0aCIsInNoaWZ0IiwiZGVmaW5lIiwiYW1kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLFFBQVEsQ0FBQ0MsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFlBQVk7QUFDeEQ7QUFDQSxNQUFNQyxhQUFhLEdBQUcsb0JBQXRCO0FBQ0FDLEVBQUFBLGVBQWUsQ0FBQ0QsYUFBRCxDQUFmLENBSHdELENBS3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRCxDQTFCRCxFQTBCRyxLQTFCSDtBQTRCQTs7QUFDQSxJQUFJQyxlQUFlLEdBQUksWUFBWTtBQUVqQyxNQUFJQyxHQUFHLEdBQUcsNEJBQVY7QUFDQSxNQUFJQyxTQUFTLEdBQUcsa0RBQWhCO0FBQ0EsTUFBSUMsT0FBTyxHQUFHLE9BQU9DLEtBQVAsS0FBaUIsV0FBakIsR0FBK0I7QUFDM0NDLElBQUFBLEtBQUssRUFBRTtBQUNMLHlCQUFtQjtBQURkO0FBRG9DLEdBQS9CLEdBSVYsSUFBSUQsS0FBSixFQUpKO0FBS0EsTUFBSUUsaUJBQWlCLEdBQUcsZ0JBQWdCSCxPQUFPLENBQUNFLEtBQWhEO0FBQ0EsTUFBSUUsc0JBQXNCLEdBQUcscUJBQXFCSixPQUFPLENB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WjtBQUdEO0FBQ0Y7QUFDRjtBQWRxQixHQUF4Qjs7QUFpQkEsU0FBTytOLFVBQVUsSUFBSUEsVUFBVSxDQUFDdkssTUFBaEMsRUFBd0M7QUFDdEMvRCxJQUFBQSxNQUFNLENBQUN1TyxjQUFQLENBQXNCL0gsSUFBdEIsQ0FBMkI4SCxVQUFVLENBQUN5TixLQUFYLEVBQTNCO0FBQ0Q7QUFFRDs7O0FBQ0EvYixFQUFBQSxNQUFNLENBQUNDLFdBQVAsR0FBcUJBLFdBQXJCO0FBRUE7O0FBQ0EsTUFBSSxRQUFPb0wsTUFBUCx5Q0FBT0EsTUFBUCxPQUFrQixRQUFsQixJQUE4QixRQUFPQSxNQUFNLENBQUNDLE9BQWQsTUFBMEIsUUFBNUQsRUFBc0U7QUFDcEU7QUFDQUQsSUFBQUEsTUFBTSxDQUFDQyxPQUFQLEdBQWlCckwsV0FBakI7QUFDRCxHQUhELE1BR08sSUFBSSxPQUFPK2IsTUFBUCxLQUFrQixVQUFsQixJQUFnQ0EsTUFBTSxDQUFDQyxHQUEzQyxFQUFnRDtBQUNyRDtBQUNBRCxJQUFBQSxNQUFNLENBQUMsYUFBRCxFQUFnQixZQUFZO0FBQ2hDLGFBQU8vYixXQUFQO0FBQ0QsS0FGSyxDQUFOO0FBR0QsR0E5OUNxQyxDQWcrQ3RDOzs7QUFDQSxNQUFJLENBQUNDLEVBQUUsQ0FBQ21ZLFVBQVIsRUFBb0I7QUFDbEJ4SyxJQUFBQSxLQUFLLENBQUMsWUFBRCxDQUFMLEdBQXNCcUUsaUJBQWlCLENBQUMsWUFBRCxFQUFlLHlJQUFmLENBQXZDO0FBQ0Q7QUFFRixDQXIrQ0QsRUFxK0NHbFMsTUFyK0NILEVBcStDV3pCLFFBcitDWCIsInNvdXJjZXNDb250ZW50IjpbImRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gIC8vKiBbaWUgMTFdIGltZyBvYmplY3QgZml0ICogUG9seWZpbGxcbiAgY29uc3Qgb2JqZWN0Rml0SXRlbSA9ICdpbWcub2JqZWN0LWZpdC1pbWcnO1xuICBvYmplY3RGaXRJbWFnZXMob2JqZWN0Rml0SXRlbSk7XG5cbiAgLy8qIFtpZSAxMV0gcG9zaXRpb246c3RpY2t5ICogUG9seWZpbGxcbiAgLy8gY29uc3QgbXFsVyA9IHdpbmRvdy5tYXRjaE1lZGlhKCdzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDk5MXB4KScpO1xuICAvLyBjb25zdCBtcWxIID0gd2luZG93Lm1hdGNoTWVkaWEoJ3NjcmVlbiBhbmQgKG1heC1oZWlnaHQ6IDcxMHB4KScpO1xuICAvLyBjb25zdCBzdWJwYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1YnBhZ2VTaWRlJyk7XG4gIC8vIGlmIChzdWJwYWdlICE9PSBudWxsICYmIHdpbmRvdy5pbm5lcldpZHRoID4gNzY3KSB7XG4gIC8vICAgc2lkZWJhclRvZ2dsZSgpO1xuICAvLyAgIG1xbFcuYWRkTGlzdGVuZXIoc2lkZWJhclRvZ2dsZSk7XG4gIC8vICAgbXFsSC5hZGRMaXN0ZW5lcihzaWRlYmFyVG9nZ2xlKTtcbiAgLy8gfVxuXG4gIC8vIGZ1bmN0aW9uIHNpZGViYXJUb2dnbGUoKSB7XG4gIC8vICAgaWYgKG1xbFcubWF0Y2hlcyB8fCBtcWxILm1hdGNoZXMpIHtcbiAgLy8gICAgIFN0aWNreWZpbGwucmVtb3ZlKHN1YnBhZ2UpO1xuICAvLyAgICAgc3VicGFnZS5zdHlsZS5wb3NpdGlvbiA9ICdzdGF0aWMnO1xuICAvLyAgICAgc3VicGFnZS5zdHlsZS50b3AgPSAwO1xuICAvLyAgIH0gZWxzZSB7XG4gIC8vICAgICBTdGlja3lmaWxsLmFkZChzdWJwYWdlKTtcbiAgLy8gICAgIHN1YnBhZ2Uuc3R5bGUucG9zaXRpb24gPSAnJztcbiAgLy8gICAgIHN1YnBhZ2Uuc3R5bGUudG9wID0gJyc7XG4gIC8vICAgfVxuICAvLyB9XG59LCBmYWxzZSk7XG5cbi8qISBucG0uaW0vb2JqZWN0LWZpdC1pbWFnZXMgMy4yLjQgKi9cbnZhciBvYmplY3RGaXRJbWFnZXMgPSAoZnVuY3Rpb24gKCkge1xuXG4gIHZhciBPRkkgPSAnYmZyZWQtaXQ6b2JqZWN0LWZpdC1pbWFnZXMnO1xuICB2YXIgcHJvcFJlZ2V4ID0gLyhvYmplY3QtZml0fG9iamVjdC1wb3NpdGlvbilcXHMqOlxccyooWy0uXFx3XFxzJV0rKS9nO1xuICB2YXIgdGVzdEltZyA9IHR5cGVvZiBJbWFnZSA9PT0gJ3VuZGVmaW5lZCcgPyB7XG4gICAgc3R5bGU6IHtcbiAgICAgICdvYmplY3QtcG9zaXRpb24nOiAxXG4gICAgfVxuICB9IDogbmV3IEltYWdlKCk7XG4gIHZhciBzdXBwb3J0c09iamVjdEZpdCA9ICdvYmplY3QtZml0JyBpbiB0ZXN0SW1nLnN0eWxlO1xuICB2YXIgc3VwcG9ydHNPYmplY3RQb3NpdGlvbiA9ICdvYmplY3QtcG9zaXRpb24nIGluIHRlc3RJbWcuc3R5bGU7XG4gIHZhciBzdXBwb3J0c09GSSA9ICdiYWNrZ3JvdW5kLXNpemUnIGluIHRlc3RJbWcuc3R5bGU7XG4gIHZhciBzdXBwb3J0c0N1cnJlbnRTcmMgPSB0eXBlb2YgdGVzdEltZy5jdXJyZW50U3JjID09PSAnc3RyaW5nJztcbiAgdmFyIG5hdGl2ZUdldEF0dHJpYnV0ZSA9IHRlc3RJbWcuZ2V0QXR0cmlidXRlO1xuICB2YXIgbmF0aXZlU2V0QXR0cmlidXRlID0gdGVzdEltZy5zZXRBdHRyaWJ1dGU7XG4gIHZhciBhdXRvTW9kZUVuYWJsZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBjcmVhdGVQbGFjZWhvbGRlcih3LCBoKSB7XG4gICAgcmV0dXJuIChcImRhdGE6aW1hZ2Uvc3ZnK3htbCwlM0NzdmcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB3aWR0aD0nXCIgKyB3ICsgXCInIGhlaWdodD0nXCIgKyBoICsgXCInJTNFJTNDL3N2ZyUzRVwiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBvbHlmaWxsQ3VycmVudFNyYyhlbCkge1xuICAgIGlmIChlbC5zcmNzZXQgJiYgIXN1cHBvcnRzQ3VycmVudFNyYyAmJiB3aW5kb3cucGljdHVyZWZpbGwpIHtcbiAgICAgIHZhciBwZiA9IHdpbmRvdy5waWN0dXJlZmlsbC5fO1xuICAgICAgLy8gcGFyc2Ugc3Jjc2V0IHdpdGggcGljdHVyZWZpbGwgd2hlcmUgY3VycmVudFNyYyBpc24ndCBhdmFpbGFibGVcbiAgICAgIGlmICghZWxbcGYubnNdIHx8ICFlbFtwZi5uc10uZXZhbGVkKSB7XG4gICAgICAgIC8vIGZvcmNlIHN5bmNocm9ub3VzIHNyY3NldCBwYXJzaW5nXG4gICAgICAgIHBmLmZpbGxJbWcoZWwsIHtcbiAgICAgICAgICByZXNlbGVjdDogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFlbFtwZi5uc10uY3VyU3JjKSB7XG4gICAgICAgIC8vIGZvcmNlIHBpY3R1cmVmaWxsIHRvIHBhcnNlIHNyY3NldFxuICAgICAgICBlbFtwZi5uc10uc3VwcG9ydGVkID0gZmFsc2U7XG4gICAgICAgIHBmLmZpbGxJbWcoZWwsIHtcbiAgICAgICAgICByZXNlbGVjdDogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gcmV0cmlldmUgcGFyc2VkIGN1cnJlbnRTcmMsIGlmIGFueVxuICAgICAgZWwuY3VycmVudFNyYyA9IGVsW3BmLm5zXS5jdXJTcmMgfHwgZWwuc3JjO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFN0eWxlKGVsKSB7XG4gICAgdmFyIHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZm9udEZhbWlseTtcbiAgICB2YXIgcGFyc2VkO1xuICAgIHZhciBwcm9wcyA9IHt9O1xuICAgIHdoaWxlICgocGFyc2VkID0gcHJvcFJlZ2V4LmV4ZWMoc3R5bGUpKSAhPT0gbnVsbCkge1xuICAgICAgcHJvcHNbcGFyc2VkWzFdXSA9IHBhcnNlZFsyXTtcbiAgICB9XG4gICAgcmV0dXJuIHByb3BzO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0UGxhY2Vob2xkZXIoaW1nLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgLy8gRGVmYXVsdDogZmlsbCB3aWR0aCwgbm8gaGVpZ2h0XG4gICAgdmFyIHBsYWNlaG9sZGVyID0gY3JlYXRlUGxhY2Vob2xkZXIod2lkdGggfHwgMSwgaGVpZ2h0IHx8IDApO1xuXG4gICAgLy8gT25seSBzZXQgcGxhY2Vob2xkZXIgaWYgaXQncyBkaWZmZXJlbnRcbiAgICBpZiAobmF0aXZlR2V0QXR0cmlidXRlLmNhbGwoaW1nLCAnc3JjJykgIT09IHBsYWNlaG9sZGVyKSB7XG4gICAgICBuYXRpdmVTZXRBdHRyaWJ1dGUuY2FsbChpbWcsICdzcmMnLCBwbGFjZWhvbGRlcik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25JbWFnZVJlYWR5KGltZywgY2FsbGJhY2spIHtcbiAgICAvLyBuYXR1cmFsV2lkdGggaXMgb25seSBhdmFpbGFibGUgd2hlbiB0aGUgaW1hZ2UgaGVhZGVycyBhcmUgbG9hZGVkLFxuICAgIC8vIHRoaXMgbG9vcCB3aWxsIHBvbGwgaXQgZXZlcnkgMTAwbXMuXG4gICAgaWYgKGltZy5uYXR1cmFsV2lkdGgpIHtcbiAgICAgIGNhbGxiYWNrKGltZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldFRpbWVvdXQob25JbWFnZVJlYWR5LCAxMDAsIGltZywgY2FsbGJhY2spO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGZpeE9uZShlbCkge1xuICAgIHZhciBzdHlsZSA9IGdldFN0eWxlKGVsKTtcbiAgICB2YXIgb2ZpID0gZWxbT0ZJXTtcbiAgICBzdHlsZVsnb2JqZWN0LWZpdCddID0gc3R5bGVbJ29iamVjdC1maXQnXSB8fCAnZmlsbCc7IC8vIGRlZmF1bHQgdmFsdWVcblxuICAgIC8vIEF2b2lkIHJ1bm5pbmcgd2hlcmUgdW5uZWNlc3NhcnksIHVubGVzcyBPRkkgaGFkIGFscmVhZHkgZG9uZSBpdHMgZGVlZFxuICAgIGlmICghb2ZpLmltZykge1xuICAgICAgLy8gZmlsbCBpcyB0aGUgZGVmYXVsdCBiZWhhdmlvciBzbyBubyBhY3Rpb24gaXMgbmVjZXNzYXJ5XG4gICAgICBpZiAoc3R5bGVbJ29iamVjdC1maXQnXSA9PT0gJ2ZpbGwnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gV2hlcmUgb2JqZWN0LWZpdCBpcyBzdXBwb3J0ZWQgYW5kIG9iamVjdC1wb3NpdGlvbiBpc24ndCAoU2FmYXJpIDwgMTApXG4gICAgICBpZiAoXG4gICAgICAgICFvZmkuc2tpcFRlc3QgJiYgLy8gdW5sZXNzIHVzZXIgd2FudHMgdG8gYXBwbHkgcmVnYXJkbGVzcyBvZiBicm93c2VyIHN1cHBvcnRcbiAgICAgICAgc3VwcG9ydHNPYmplY3RGaXQgJiYgLy8gaWYgYnJvd3NlciBhbHJlYWR5IHN1cHBvcnRzIG9iamVjdC1maXRcbiAgICAgICAgIXN0eWxlWydvYmplY3QtcG9zaXRpb24nXSAvLyB1bmxlc3Mgb2JqZWN0LXBvc2l0aW9uIGlzIHVzZWRcbiAgICAgICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8ga2VlcCBhIGNsb25lIGluIG1lbW9yeSB3aGlsZSByZXNldHRpbmcgdGhlIG9yaWdpbmFsIHRvIGEgYmxhbmtcbiAgICBpZiAoIW9maS5pbWcpIHtcbiAgICAgIG9maS5pbWcgPSBuZXcgSW1hZ2UoZWwud2lkdGgsIGVsLmhlaWdodCk7XG4gICAgICBvZmkuaW1nLnNyY3NldCA9IG5hdGl2ZUdldEF0dHJpYnV0ZS5jYWxsKGVsLCBcImRhdGEtb2ZpLXNyY3NldFwiKSB8fCBlbC5zcmNzZXQ7XG4gICAgICBvZmkuaW1nLnNyYyA9IG5hdGl2ZUdldEF0dHJpYnV0ZS5jYWxsKGVsLCBcImRhdGEtb2ZpLXNyY1wiKSB8fCBlbC5zcmM7XG5cbiAgICAgIC8vIHByZXNlcnZlIGZvciBhbnkgZnV0dXJlIGNsb25lTm9kZSBjYWxsc1xuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2JmcmVkLWl0L29iamVjdC1maXQtaW1hZ2VzL2lzc3Vlcy81M1xuICAgICAgbmF0aXZlU2V0QXR0cmlidXRlLmNhbGwoZWwsIFwiZGF0YS1vZmktc3JjXCIsIGVsLnNyYyk7XG4gICAgICBpZiAoZWwuc3Jjc2V0KSB7XG4gICAgICAgIG5hdGl2ZVNldEF0dHJpYnV0ZS5jYWxsKGVsLCBcImRhdGEtb2ZpLXNyY3NldFwiLCBlbC5zcmNzZXQpO1xuICAgICAgfVxuXG4gICAgICBzZXRQbGFjZWhvbGRlcihlbCwgZWwubmF0dXJhbFdpZHRoIHx8IGVsLndpZHRoLCBlbC5uYXR1cmFsSGVpZ2h0IHx8IGVsLmhlaWdodCk7XG5cbiAgICAgIC8vIHJlbW92ZSBzcmNzZXQgYmVjYXVzZSBpdCBvdmVycmlkZXMgc3JjXG4gICAgICBpZiAoZWwuc3Jjc2V0KSB7XG4gICAgICAgIGVsLnNyY3NldCA9ICcnO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAga2VlcFNyY1VzYWJsZShlbCk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5jb25zb2xlKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdodHRwczovL2JpdC5seS9vZmktb2xkLWJyb3dzZXInKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHBvbHlmaWxsQ3VycmVudFNyYyhvZmkuaW1nKTtcblxuICAgIGVsLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKFxcXCJcIiArICgob2ZpLmltZy5jdXJyZW50U3JjIHx8IG9maS5pbWcuc3JjKS5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykpICsgXCJcXFwiKVwiO1xuICAgIGVsLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IHN0eWxlWydvYmplY3QtcG9zaXRpb24nXSB8fCAnY2VudGVyJztcbiAgICBlbC5zdHlsZS5iYWNrZ3JvdW5kUmVwZWF0ID0gJ25vLXJlcGVhdCc7XG4gICAgZWwuc3R5bGUuYmFja2dyb3VuZE9yaWdpbiA9ICdjb250ZW50LWJveCc7XG5cbiAgICBpZiAoL3NjYWxlLWRvd24vLnRlc3Qoc3R5bGVbJ29iamVjdC1maXQnXSkpIHtcbiAgICAgIG9uSW1hZ2VSZWFkeShvZmkuaW1nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChvZmkuaW1nLm5hdHVyYWxXaWR0aCA+IGVsLndpZHRoIHx8IG9maS5pbWcubmF0dXJhbEhlaWdodCA+IGVsLmhlaWdodCkge1xuICAgICAgICAgIGVsLnN0eWxlLmJhY2tncm91bmRTaXplID0gJ2NvbnRhaW4nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsLnN0eWxlLmJhY2tncm91bmRTaXplID0gJ2F1dG8nO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwuc3R5bGUuYmFja2dyb3VuZFNpemUgPSBzdHlsZVsnb2JqZWN0LWZpdCddLnJlcGxhY2UoJ25vbmUnLCAnYXV0bycpLnJlcGxhY2UoJ2ZpbGwnLCAnMTAwJSAxMDAlJyk7XG4gICAgfVxuXG4gICAgb25JbWFnZVJlYWR5KG9maS5pbWcsIGZ1bmN0aW9uIChpbWcpIHtcbiAgICAgIHNldFBsYWNlaG9sZGVyKGVsLCBpbWcubmF0dXJhbFdpZHRoLCBpbWcubmF0dXJhbEhlaWdodCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBrZWVwU3JjVXNhYmxlKGVsKSB7XG4gICAgdmFyIGRlc2NyaXB0b3JzID0ge1xuICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQocHJvcCkge1xuICAgICAgICByZXR1cm4gZWxbT0ZJXS5pbWdbcHJvcCA/IHByb3AgOiAnc3JjJ107XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUsIHByb3ApIHtcbiAgICAgICAgZWxbT0ZJXS5pbWdbcHJvcCA/IHByb3AgOiAnc3JjJ10gPSB2YWx1ZTtcbiAgICAgICAgbmF0aXZlU2V0QXR0cmlidXRlLmNhbGwoZWwsIChcImRhdGEtb2ZpLVwiICsgcHJvcCksIHZhbHVlKTsgLy8gcHJlc2VydmUgZm9yIGFueSBmdXR1cmUgY2xvbmVOb2RlXG4gICAgICAgIGZpeE9uZShlbCk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbCwgJ3NyYycsIGRlc2NyaXB0b3JzKTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWwsICdjdXJyZW50U3JjJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9ycy5nZXQoJ2N1cnJlbnRTcmMnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWwsICdzcmNzZXQnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3JzLmdldCgnc3Jjc2V0Jyk7XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbiAoc3MpIHtcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3JzLnNldChzcywgJ3NyY3NldCcpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaGlqYWNrQXR0cmlidXRlcygpIHtcbiAgICBmdW5jdGlvbiBnZXRPZmlJbWFnZU1heWJlKGVsLCBuYW1lKSB7XG4gICAgICByZXR1cm4gZWxbT0ZJXSAmJiBlbFtPRkldLmltZyAmJiAobmFtZSA9PT0gJ3NyYycgfHwgbmFtZSA9PT0gJ3NyY3NldCcpID8gZWxbT0ZJXS5pbWcgOiBlbDtcbiAgICB9XG4gICAgaWYgKCFzdXBwb3J0c09iamVjdFBvc2l0aW9uKSB7XG4gICAgICBIVE1MSW1hZ2VFbGVtZW50LnByb3RvdHlwZS5nZXRBdHRyaWJ1dGUgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICByZXR1cm4gbmF0aXZlR2V0QXR0cmlidXRlLmNhbGwoZ2V0T2ZpSW1hZ2VNYXliZSh0aGlzLCBuYW1lKSwgbmFtZSk7XG4gICAgICB9O1xuXG4gICAgICBIVE1MSW1hZ2VFbGVtZW50LnByb3RvdHlwZS5zZXRBdHRyaWJ1dGUgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG5hdGl2ZVNldEF0dHJpYnV0ZS5jYWxsKGdldE9maUltYWdlTWF5YmUodGhpcywgbmFtZSksIG5hbWUsIFN0cmluZyh2YWx1ZSkpO1xuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBmaXgoaW1ncywgb3B0cykge1xuICAgIHZhciBzdGFydEF1dG9Nb2RlID0gIWF1dG9Nb2RlRW5hYmxlZCAmJiAhaW1ncztcbiAgICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgICBpbWdzID0gaW1ncyB8fCAnaW1nJztcblxuICAgIGlmICgoc3VwcG9ydHNPYmplY3RQb3NpdGlvbiAmJiAhb3B0cy5za2lwVGVzdCkgfHwgIXN1cHBvcnRzT0ZJKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gdXNlIGltZ3MgYXMgYSBzZWxlY3RvciBvciBqdXN0IHNlbGVjdCBhbGwgaW1hZ2VzXG4gICAgaWYgKGltZ3MgPT09ICdpbWcnKSB7XG4gICAgICBpbWdzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2ltZycpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGltZ3MgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpbWdzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChpbWdzKTtcbiAgICB9IGVsc2UgaWYgKCEoJ2xlbmd0aCcgaW4gaW1ncykpIHtcbiAgICAgIGltZ3MgPSBbaW1nc107XG4gICAgfVxuXG4gICAgLy8gYXBwbHkgZml4IHRvIGFsbFxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW1ncy5sZW5ndGg7IGkrKykge1xuICAgICAgaW1nc1tpXVtPRkldID0gaW1nc1tpXVtPRkldIHx8IHtcbiAgICAgICAgc2tpcFRlc3Q6IG9wdHMuc2tpcFRlc3RcbiAgICAgIH07XG4gICAgICBmaXhPbmUoaW1nc1tpXSk7XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0QXV0b01vZGUpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlLnRhcmdldC50YWdOYW1lID09PSAnSU1HJykge1xuICAgICAgICAgIGZpeChlLnRhcmdldCwge1xuICAgICAgICAgICAgc2tpcFRlc3Q6IG9wdHMuc2tpcFRlc3RcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSwgdHJ1ZSk7XG4gICAgICBhdXRvTW9kZUVuYWJsZWQgPSB0cnVlO1xuICAgICAgaW1ncyA9ICdpbWcnOyAvLyByZXNldCB0byBhIGdlbmVyaWMgc2VsZWN0b3IgZm9yIHdhdGNoTVFcbiAgICB9XG5cbiAgICAvLyBpZiByZXF1ZXN0ZWQsIHdhdGNoIG1lZGlhIHF1ZXJpZXMgZm9yIG9iamVjdC1maXQgY2hhbmdlXG4gICAgaWYgKG9wdHMud2F0Y2hNUSkge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZpeC5iaW5kKG51bGwsIGltZ3MsIHtcbiAgICAgICAgc2tpcFRlc3Q6IG9wdHMuc2tpcFRlc3RcbiAgICAgIH0pKTtcbiAgICB9XG4gIH1cblxuICBmaXguc3VwcG9ydHNPYmplY3RGaXQgPSBzdXBwb3J0c09iamVjdEZpdDtcbiAgZml4LnN1cHBvcnRzT2JqZWN0UG9zaXRpb24gPSBzdXBwb3J0c09iamVjdFBvc2l0aW9uO1xuXG4gIGhpamFja0F0dHJpYnV0ZXMoKTtcblxuICByZXR1cm4gZml4O1xuXG59KCkpO1xuXG4vKiFcbiAqIFN0aWNreWZpbGwg4oCTIGBwb3NpdGlvbjogc3RpY2t5YCBwb2x5ZmlsbFxuICogdi4gMi4xLjAgfCBodHRwczovL2dpdGh1Yi5jb20vd2lsZGRlZXIvc3RpY2t5ZmlsbFxuICogTUlUIExpY2Vuc2VcbiAqL1xuXG4vKlxuICogMS4gQ2hlY2sgaWYgdGhlIGJyb3dzZXIgc3VwcG9ydHMgYHBvc2l0aW9uOiBzdGlja3lgIG5hdGl2ZWx5IG9yIGlzIHRvbyBvbGQgdG8gcnVuIHRoZSBwb2x5ZmlsbC5cbiAqICAgIElmIGVpdGhlciBvZiB0aGVzZSBpcyB0aGUgY2FzZSBzZXQgYHNlcHB1a3VgIGZsYWcuIEl0IHdpbGwgYmUgY2hlY2tlZCBsYXRlciB0byBkaXNhYmxlIGtleSBmZWF0dXJlc1xuICogICAgb2YgdGhlIHBvbHlmaWxsLCBidXQgdGhlIEFQSSB3aWxsIHJlbWFpbiBmdW5jdGlvbmFsIHRvIGF2b2lkIGJyZWFraW5nIHRoaW5ncy5cbiAqL1xubGV0IHNlcHB1a3UgPSBmYWxzZTtcblxuY29uc3QgaXNXaW5kb3dEZWZpbmVkID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XG5cbi8vIFRoZSBwb2x5ZmlsbCBjYW7igJl0IGZ1bmN0aW9uIHByb3Blcmx5IHdpdGhvdXQgYHdpbmRvd2Agb3IgYHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlYC5cbmlmICghaXNXaW5kb3dEZWZpbmVkIHx8ICF3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkgc2VwcHVrdSA9IHRydWU7XG4vLyBEb2504oCZdCBnZXQgaW4gYSB3YXkgaWYgdGhlIGJyb3dzZXIgc3VwcG9ydHMgYHBvc2l0aW9uOiBzdGlja3lgIG5hdGl2ZWx5LlxuZWxzZSB7XG4gIGNvbnN0IHRlc3ROb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgaWYgKFxuICAgIFsnJywgJy13ZWJraXQtJywgJy1tb3otJywgJy1tcy0nXS5zb21lKHByZWZpeCA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICB0ZXN0Tm9kZS5zdHlsZS5wb3NpdGlvbiA9IHByZWZpeCArICdzdGlja3knO1xuICAgICAgfSBjYXRjaCAoZSkge31cblxuICAgICAgcmV0dXJuIHRlc3ROb2RlLnN0eWxlLnBvc2l0aW9uICE9ICcnO1xuICAgIH0pXG4gICkgc2VwcHVrdSA9IHRydWU7XG59XG5cblxuLypcbiAqIDIuIOKAnEdsb2JhbOKAnSB2YXJzIHVzZWQgYWNyb3NzIHRoZSBwb2x5ZmlsbFxuICovXG5sZXQgaXNJbml0aWFsaXplZCA9IGZhbHNlO1xuXG4vLyBDaGVjayBpZiBTaGFkb3cgUm9vdCBjb25zdHJ1Y3RvciBleGlzdHMgdG8gbWFrZSBmdXJ0aGVyIGNoZWNrcyBzaW1wbGVyXG5jb25zdCBzaGFkb3dSb290RXhpc3RzID0gdHlwZW9mIFNoYWRvd1Jvb3QgIT09ICd1bmRlZmluZWQnO1xuXG4vLyBMYXN0IHNhdmVkIHNjcm9sbCBwb3NpdGlvblxuY29uc3Qgc2Nyb2xsID0ge1xuICB0b3A6IG51bGwsXG4gIGxlZnQ6IG51bGxcbn07XG5cbi8vIEFycmF5IG9mIGNyZWF0ZWQgU3RpY2t5IGluc3RhbmNlc1xuY29uc3Qgc3RpY2tpZXMgPSBbXTtcblxuXG4vKlxuICogMy4gVXRpbGl0eSBmdW5jdGlvbnNcbiAqL1xuZnVuY3Rpb24gZXh0ZW5kKHRhcmdldE9iaiwgc291cmNlT2JqZWN0KSB7XG4gIGZvciAodmFyIGtleSBpbiBzb3VyY2VPYmplY3QpIHtcbiAgICBpZiAoc291cmNlT2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHRhcmdldE9ialtrZXldID0gc291cmNlT2JqZWN0W2tleV07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlTnVtZXJpYyh2YWwpIHtcbiAgcmV0dXJuIHBhcnNlRmxvYXQodmFsKSB8fCAwO1xufVxuXG5mdW5jdGlvbiBnZXREb2NPZmZzZXRUb3Aobm9kZSkge1xuICBsZXQgZG9jT2Zmc2V0VG9wID0gMDtcblxuICB3aGlsZSAobm9kZSkge1xuICAgIGRvY09mZnNldFRvcCArPSBub2RlLm9mZnNldFRvcDtcbiAgICBub2RlID0gbm9kZS5vZmZzZXRQYXJlbnQ7XG4gIH1cblxuICByZXR1cm4gZG9jT2Zmc2V0VG9wO1xufVxuXG5cbi8qXG4gKiA0LiBTdGlja3kgY2xhc3NcbiAqL1xuY2xhc3MgU3RpY2t5IHtcbiAgY29uc3RydWN0b3Iobm9kZSkge1xuICAgIGlmICghKG5vZGUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG11c3QgYmUgSFRNTEVsZW1lbnQnKTtcbiAgICBpZiAoc3RpY2tpZXMuc29tZShzdGlja3kgPT4gc3RpY2t5Ll9ub2RlID09PSBub2RlKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignU3RpY2t5ZmlsbCBpcyBhbHJlYWR5IGFwcGxpZWQgdG8gdGhpcyBub2RlJyk7XG5cbiAgICB0aGlzLl9ub2RlID0gbm9kZTtcbiAgICB0aGlzLl9zdGlja3lNb2RlID0gbnVsbDtcbiAgICB0aGlzLl9hY3RpdmUgPSBmYWxzZTtcblxuICAgIHN0aWNraWVzLnB1c2godGhpcyk7XG5cbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgfVxuXG4gIHJlZnJlc2goKSB7XG4gICAgaWYgKHNlcHB1a3UgfHwgdGhpcy5fcmVtb3ZlZCkgcmV0dXJuO1xuICAgIGlmICh0aGlzLl9hY3RpdmUpIHRoaXMuX2RlYWN0aXZhdGUoKTtcblxuICAgIGNvbnN0IG5vZGUgPSB0aGlzLl9ub2RlO1xuXG4gICAgLypcbiAgICAgKiAxLiBTYXZlIG5vZGUgY29tcHV0ZWQgcHJvcHNcbiAgICAgKi9cbiAgICBjb25zdCBub2RlQ29tcHV0ZWRTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgY29uc3Qgbm9kZUNvbXB1dGVkUHJvcHMgPSB7XG4gICAgICBwb3NpdGlvbjogbm9kZUNvbXB1dGVkU3R5bGUucG9zaXRpb24sXG4gICAgICB0b3A6IG5vZGVDb21wdXRlZFN0eWxlLnRvcCxcbiAgICAgIGRpc3BsYXk6IG5vZGVDb21wdXRlZFN0eWxlLmRpc3BsYXksXG4gICAgICBtYXJnaW5Ub3A6IG5vZGVDb21wdXRlZFN0eWxlLm1hcmdpblRvcCxcbiAgICAgIG1hcmdpbkJvdHRvbTogbm9kZUNvbXB1dGVkU3R5bGUubWFyZ2luQm90dG9tLFxuICAgICAgbWFyZ2luTGVmdDogbm9kZUNvbXB1dGVkU3R5bGUubWFyZ2luTGVmdCxcbiAgICAgIG1hcmdpblJpZ2h0OiBub2RlQ29tcHV0ZWRTdHlsZS5tYXJnaW5SaWdodCxcbiAgICAgIGNzc0Zsb2F0OiBub2RlQ29tcHV0ZWRTdHlsZS5jc3NGbG9hdFxuICAgIH07XG5cbiAgICAvKlxuICAgICAqIDIuIENoZWNrIGlmIHRoZSBub2RlIGNhbiBiZSBhY3RpdmF0ZWRcbiAgICAgKi9cbiAgICBpZiAoXG4gICAgICBpc05hTihwYXJzZUZsb2F0KG5vZGVDb21wdXRlZFByb3BzLnRvcCkpIHx8XG4gICAgICBub2RlQ29tcHV0ZWRQcm9wcy5kaXNwbGF5ID09ICd0YWJsZS1jZWxsJyB8fFxuICAgICAgbm9kZUNvbXB1dGVkUHJvcHMuZGlzcGxheSA9PSAnbm9uZSdcbiAgICApIHJldHVybjtcblxuICAgIHRoaXMuX2FjdGl2ZSA9IHRydWU7XG5cbiAgICAvKlxuICAgICAqIDMuIENoZWNrIGlmIHRoZSBjdXJyZW50IG5vZGUgcG9zaXRpb24gaXMgYHN0aWNreWAuIElmIGl0IGlzLCBpdCBtZWFucyB0aGF0IHRoZSBicm93c2VyIHN1cHBvcnRzIHN0aWNreSBwb3NpdGlvbmluZyxcbiAgICAgKiAgICBidXQgdGhlIHBvbHlmaWxsIHdhcyBmb3JjZS1lbmFibGVkLiBXZSBzZXQgdGhlIG5vZGXigJlzIHBvc2l0aW9uIHRvIGBzdGF0aWNgIGJlZm9yZSBjb250aW51aW5nLCBzbyB0aGF0IHRoZSBub2RlXG4gICAgICogICAgaXMgaW4gaXTigJlzIGluaXRpYWwgcG9zaXRpb24gd2hlbiB3ZSBnYXRoZXIgaXRzIHBhcmFtcy5cbiAgICAgKi9cbiAgICBjb25zdCBvcmlnaW5hbFBvc2l0aW9uID0gbm9kZS5zdHlsZS5wb3NpdGlvbjtcbiAgICBpZiAobm9kZUNvbXB1dGVkU3R5bGUucG9zaXRpb24gPT0gJ3N0aWNreScgfHwgbm9kZUNvbXB1dGVkU3R5bGUucG9zaXRpb24gPT0gJy13ZWJraXQtc3RpY2t5JylcbiAgICAgIG5vZGUuc3R5bGUucG9zaXRpb24gPSAnc3RhdGljJztcblxuICAgIC8qXG4gICAgICogNC4gR2V0IG5lY2Vzc2FyeSBub2RlIHBhcmFtZXRlcnNcbiAgICAgKi9cbiAgICBjb25zdCByZWZlcmVuY2VOb2RlID0gbm9kZS5wYXJlbnROb2RlO1xuICAgIGNvbnN0IHBhcmVudE5vZGUgPSBzaGFkb3dSb290RXhpc3RzICYmIHJlZmVyZW5jZU5vZGUgaW5zdGFuY2VvZiBTaGFkb3dSb290ID8gcmVmZXJlbmNlTm9kZS5ob3N0IDogcmVmZXJlbmNlTm9kZTtcbiAgICBjb25zdCBub2RlV2luT2Zmc2V0ID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBwYXJlbnRXaW5PZmZzZXQgPSBwYXJlbnROb2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHBhcmVudENvbXB1dGVkU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKHBhcmVudE5vZGUpO1xuXG4gICAgdGhpcy5fcGFyZW50ID0ge1xuICAgICAgbm9kZTogcGFyZW50Tm9kZSxcbiAgICAgIHN0eWxlczoge1xuICAgICAgICBwb3NpdGlvbjogcGFyZW50Tm9kZS5zdHlsZS5wb3NpdGlvblxuICAgICAgfSxcbiAgICAgIG9mZnNldEhlaWdodDogcGFyZW50Tm9kZS5vZmZzZXRIZWlnaHRcbiAgICB9O1xuICAgIHRoaXMuX29mZnNldFRvV2luZG93ID0ge1xuICAgICAgbGVmdDogbm9kZVdpbk9mZnNldC5sZWZ0LFxuICAgICAgcmlnaHQ6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCAtIG5vZGVXaW5PZmZzZXQucmlnaHRcbiAgICB9O1xuICAgIHRoaXMuX29mZnNldFRvUGFyZW50ID0ge1xuICAgICAgdG9wOiBub2RlV2luT2Zmc2V0LnRvcCAtIHBhcmVudFdpbk9mZnNldC50b3AgLSBwYXJzZU51bWVyaWMocGFyZW50Q29tcHV0ZWRTdHlsZS5ib3JkZXJUb3BXaWR0aCksXG4gICAgICBsZWZ0OiBub2RlV2luT2Zmc2V0LmxlZnQgLSBwYXJlbnRXaW5PZmZzZXQubGVmdCAtIHBhcnNlTnVtZXJpYyhwYXJlbnRDb21wdXRlZFN0eWxlLmJvcmRlckxlZnRXaWR0aCksXG4gICAgICByaWdodDogLW5vZGVXaW5PZmZzZXQucmlnaHQgKyBwYXJlbnRXaW5PZmZzZXQucmlnaHQgLSBwYXJzZU51bWVyaWMocGFyZW50Q29tcHV0ZWRTdHlsZS5ib3JkZXJSaWdodFdpZHRoKVxuICAgIH07XG4gICAgdGhpcy5fc3R5bGVzID0ge1xuICAgICAgcG9zaXRpb246IG9yaWdpbmFsUG9zaXRpb24sXG4gICAgICB0b3A6IG5vZGUuc3R5bGUudG9wLFxuICAgICAgYm90dG9tOiBub2RlLnN0eWxlLmJvdHRvbSxcbiAgICAgIGxlZnQ6IG5vZGUuc3R5bGUubGVmdCxcbiAgICAgIHJpZ2h0OiBub2RlLnN0eWxlLnJpZ2h0LFxuICAgICAgd2lkdGg6IG5vZGUuc3R5bGUud2lkdGgsXG4gICAgICBtYXJnaW5Ub3A6IG5vZGUuc3R5bGUubWFyZ2luVG9wLFxuICAgICAgbWFyZ2luTGVmdDogbm9kZS5zdHlsZS5tYXJnaW5MZWZ0LFxuICAgICAgbWFyZ2luUmlnaHQ6IG5vZGUuc3R5bGUubWFyZ2luUmlnaHRcbiAgICB9O1xuXG4gICAgY29uc3Qgbm9kZVRvcFZhbHVlID0gcGFyc2VOdW1lcmljKG5vZGVDb21wdXRlZFByb3BzLnRvcCk7XG4gICAgdGhpcy5fbGltaXRzID0ge1xuICAgICAgc3RhcnQ6IG5vZGVXaW5PZmZzZXQudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0IC0gbm9kZVRvcFZhbHVlLFxuICAgICAgZW5kOiBwYXJlbnRXaW5PZmZzZXQudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0ICsgcGFyZW50Tm9kZS5vZmZzZXRIZWlnaHQgLVxuICAgICAgICBwYXJzZU51bWVyaWMocGFyZW50Q29tcHV0ZWRTdHlsZS5ib3JkZXJCb3R0b21XaWR0aCkgLSBub2RlLm9mZnNldEhlaWdodCAtXG4gICAgICAgIG5vZGVUb3BWYWx1ZSAtIHBhcnNlTnVtZXJpYyhub2RlQ29tcHV0ZWRQcm9wcy5tYXJnaW5Cb3R0b20pXG4gICAgfTtcblxuICAgIC8qXG4gICAgICogNS4gRW5zdXJlIHRoYXQgdGhlIG5vZGUgd2lsbCBiZSBwb3NpdGlvbmVkIHJlbGF0aXZlbHkgdG8gdGhlIHBhcmVudCBub2RlXG4gICAgICovXG4gICAgY29uc3QgcGFyZW50UG9zaXRpb24gPSBwYXJlbnRDb21wdXRlZFN0eWxlLnBvc2l0aW9uO1xuXG4gICAgaWYgKFxuICAgICAgcGFyZW50UG9zaXRpb24gIT0gJ2Fic29sdXRlJyAmJlxuICAgICAgcGFyZW50UG9zaXRpb24gIT0gJ3JlbGF0aXZlJ1xuICAgICkge1xuICAgICAgcGFyZW50Tm9kZS5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiA2LiBSZWNhbGMgbm9kZSBwb3NpdGlvbi5cbiAgICAgKiAgICBJdOKAmXMgaW1wb3J0YW50IHRvIGRvIHRoaXMgYmVmb3JlIGNsb25lIGluamVjdGlvbiB0byBhdm9pZCBzY3JvbGxpbmcgYnVnIGluIENocm9tZS5cbiAgICAgKi9cbiAgICB0aGlzLl9yZWNhbGNQb3NpdGlvbigpO1xuXG4gICAgLypcbiAgICAgKiA3LiBDcmVhdGUgYSBjbG9uZVxuICAgICAqL1xuICAgIGNvbnN0IGNsb25lID0gdGhpcy5fY2xvbmUgPSB7fTtcbiAgICBjbG9uZS5ub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAvLyBBcHBseSBzdHlsZXMgdG8gdGhlIGNsb25lXG4gICAgZXh0ZW5kKGNsb25lLm5vZGUuc3R5bGUsIHtcbiAgICAgIHdpZHRoOiBub2RlV2luT2Zmc2V0LnJpZ2h0IC0gbm9kZVdpbk9mZnNldC5sZWZ0ICsgJ3B4JyxcbiAgICAgIGhlaWdodDogbm9kZVdpbk9mZnNldC5ib3R0b20gLSBub2RlV2luT2Zmc2V0LnRvcCArICdweCcsXG4gICAgICBtYXJnaW5Ub3A6IG5vZGVDb21wdXRlZFByb3BzLm1hcmdpblRvcCxcbiAgICAgIG1hcmdpbkJvdHRvbTogbm9kZUNvbXB1dGVkUHJvcHMubWFyZ2luQm90dG9tLFxuICAgICAgbWFyZ2luTGVmdDogbm9kZUNvbXB1dGVkUHJvcHMubWFyZ2luTGVmdCxcbiAgICAgIG1hcmdpblJpZ2h0OiBub2RlQ29tcHV0ZWRQcm9wcy5tYXJnaW5SaWdodCxcbiAgICAgIGNzc0Zsb2F0OiBub2RlQ29tcHV0ZWRQcm9wcy5jc3NGbG9hdCxcbiAgICAgIHBhZGRpbmc6IDAsXG4gICAgICBib3JkZXI6IDAsXG4gICAgICBib3JkZXJTcGFjaW5nOiAwLFxuICAgICAgZm9udFNpemU6ICcxZW0nLFxuICAgICAgcG9zaXRpb246ICdzdGF0aWMnXG4gICAgfSk7XG5cbiAgICByZWZlcmVuY2VOb2RlLmluc2VydEJlZm9yZShjbG9uZS5ub2RlLCBub2RlKTtcbiAgICBjbG9uZS5kb2NPZmZzZXRUb3AgPSBnZXREb2NPZmZzZXRUb3AoY2xvbmUubm9kZSk7XG4gIH1cblxuICBfcmVjYWxjUG9zaXRpb24oKSB7XG4gICAgaWYgKCF0aGlzLl9hY3RpdmUgfHwgdGhpcy5fcmVtb3ZlZCkgcmV0dXJuO1xuXG4gICAgY29uc3Qgc3RpY2t5TW9kZSA9IHNjcm9sbC50b3AgPD0gdGhpcy5fbGltaXRzLnN0YXJ0ID8gJ3N0YXJ0JyA6IHNjcm9sbC50b3AgPj0gdGhpcy5fbGltaXRzLmVuZCA/ICdlbmQnIDogJ21pZGRsZSc7XG5cbiAgICBpZiAodGhpcy5fc3RpY2t5TW9kZSA9PSBzdGlja3lNb2RlKSByZXR1cm47XG5cbiAgICBzd2l0Y2ggKHN0aWNreU1vZGUpIHtcbiAgICAgIGNhc2UgJ3N0YXJ0JzpcbiAgICAgICAgZXh0ZW5kKHRoaXMuX25vZGUuc3R5bGUsIHtcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBsZWZ0OiB0aGlzLl9vZmZzZXRUb1BhcmVudC5sZWZ0ICsgJ3B4JyxcbiAgICAgICAgICByaWdodDogdGhpcy5fb2Zmc2V0VG9QYXJlbnQucmlnaHQgKyAncHgnLFxuICAgICAgICAgIHRvcDogdGhpcy5fb2Zmc2V0VG9QYXJlbnQudG9wICsgJ3B4JyxcbiAgICAgICAgICBib3R0b206ICdhdXRvJyxcbiAgICAgICAgICB3aWR0aDogJ2F1dG8nLFxuICAgICAgICAgIG1hcmdpbkxlZnQ6IDAsXG4gICAgICAgICAgbWFyZ2luUmlnaHQ6IDAsXG4gICAgICAgICAgbWFyZ2luVG9wOiAwXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnbWlkZGxlJzpcbiAgICAgICAgZXh0ZW5kKHRoaXMuX25vZGUuc3R5bGUsIHtcbiAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICBsZWZ0OiB0aGlzLl9vZmZzZXRUb1dpbmRvdy5sZWZ0ICsgJ3B4JyxcbiAgICAgICAgICByaWdodDogdGhpcy5fb2Zmc2V0VG9XaW5kb3cucmlnaHQgKyAncHgnLFxuICAgICAgICAgIHRvcDogdGhpcy5fc3R5bGVzLnRvcCxcbiAgICAgICAgICBib3R0b206ICdhdXRvJyxcbiAgICAgICAgICB3aWR0aDogJ2F1dG8nLFxuICAgICAgICAgIG1hcmdpbkxlZnQ6IDAsXG4gICAgICAgICAgbWFyZ2luUmlnaHQ6IDAsXG4gICAgICAgICAgbWFyZ2luVG9wOiAwXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnZW5kJzpcbiAgICAgICAgZXh0ZW5kKHRoaXMuX25vZGUuc3R5bGUsIHtcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBsZWZ0OiB0aGlzLl9vZmZzZXRUb1BhcmVudC5sZWZ0ICsgJ3B4JyxcbiAgICAgICAgICByaWdodDogdGhpcy5fb2Zmc2V0VG9QYXJlbnQucmlnaHQgKyAncHgnLFxuICAgICAgICAgIHRvcDogJ2F1dG8nLFxuICAgICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgICB3aWR0aDogJ2F1dG8nLFxuICAgICAgICAgIG1hcmdpbkxlZnQ6IDAsXG4gICAgICAgICAgbWFyZ2luUmlnaHQ6IDBcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMuX3N0aWNreU1vZGUgPSBzdGlja3lNb2RlO1xuICB9XG5cbiAgX2Zhc3RDaGVjaygpIHtcbiAgICBpZiAoIXRoaXMuX2FjdGl2ZSB8fCB0aGlzLl9yZW1vdmVkKSByZXR1cm47XG5cbiAgICBpZiAoXG4gICAgICBNYXRoLmFicyhnZXREb2NPZmZzZXRUb3AodGhpcy5fY2xvbmUubm9kZSkgLSB0aGlzLl9jbG9uZS5kb2NPZmZzZXRUb3ApID4gMSB8fFxuICAgICAgTWF0aC5hYnModGhpcy5fcGFyZW50Lm5vZGUub2Zmc2V0SGVpZ2h0IC0gdGhpcy5fcGFyZW50Lm9mZnNldEhlaWdodCkgPiAxXG4gICAgKSB0aGlzLnJlZnJlc2goKTtcbiAgfVxuXG4gIF9kZWFjdGl2YXRlKCkge1xuICAgIGlmICghdGhpcy5fYWN0aXZlIHx8IHRoaXMuX3JlbW92ZWQpIHJldHVybjtcblxuICAgIHRoaXMuX2Nsb25lLm5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLl9jbG9uZS5ub2RlKTtcbiAgICBkZWxldGUgdGhpcy5fY2xvbmU7XG5cbiAgICBleHRlbmQodGhpcy5fbm9kZS5zdHlsZSwgdGhpcy5fc3R5bGVzKTtcbiAgICBkZWxldGUgdGhpcy5fc3R5bGVzO1xuXG4gICAgLy8gQ2hlY2sgd2hldGhlciBlbGVtZW504oCZcyBwYXJlbnQgbm9kZSBpcyB1c2VkIGJ5IG90aGVyIHN0aWNraWVzLlxuICAgIC8vIElmIG5vdCwgcmVzdG9yZSBwYXJlbnQgbm9kZeKAmXMgc3R5bGVzLlxuICAgIGlmICghc3RpY2tpZXMuc29tZShzdGlja3kgPT4gc3RpY2t5ICE9PSB0aGlzICYmIHN0aWNreS5fcGFyZW50ICYmIHN0aWNreS5fcGFyZW50Lm5vZGUgPT09IHRoaXMuX3BhcmVudC5ub2RlKSkge1xuICAgICAgZXh0ZW5kKHRoaXMuX3BhcmVudC5ub2RlLnN0eWxlLCB0aGlzLl9wYXJlbnQuc3R5bGVzKTtcbiAgICB9XG4gICAgZGVsZXRlIHRoaXMuX3BhcmVudDtcblxuICAgIHRoaXMuX3N0aWNreU1vZGUgPSBudWxsO1xuICAgIHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xuXG4gICAgZGVsZXRlIHRoaXMuX29mZnNldFRvV2luZG93O1xuICAgIGRlbGV0ZSB0aGlzLl9vZmZzZXRUb1BhcmVudDtcbiAgICBkZWxldGUgdGhpcy5fbGltaXRzO1xuICB9XG5cbiAgcmVtb3ZlKCkge1xuICAgIHRoaXMuX2RlYWN0aXZhdGUoKTtcblxuICAgIHN0aWNraWVzLnNvbWUoKHN0aWNreSwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChzdGlja3kuX25vZGUgPT09IHRoaXMuX25vZGUpIHtcbiAgICAgICAgc3RpY2tpZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLl9yZW1vdmVkID0gdHJ1ZTtcbiAgfVxufVxuXG5cbi8qXG4gKiA1LiBTdGlja3lmaWxsIEFQSVxuICovXG5jb25zdCBTdGlja3lmaWxsID0ge1xuICBzdGlja2llcyxcbiAgU3RpY2t5LFxuXG4gIGZvcmNlU3RpY2t5KCkge1xuICAgIHNlcHB1a3UgPSBmYWxzZTtcbiAgICBpbml0KCk7XG5cbiAgICB0aGlzLnJlZnJlc2hBbGwoKTtcbiAgfSxcblxuICBhZGRPbmUobm9kZSkge1xuICAgIC8vIENoZWNrIHdoZXRoZXIgaXTigJlzIGEgbm9kZVxuICAgIGlmICghKG5vZGUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHtcbiAgICAgIC8vIE1heWJlIGl04oCZcyBhIG5vZGUgbGlzdCBvZiBzb21lIHNvcnQ/XG4gICAgICAvLyBUYWtlIGZpcnN0IG5vZGUgZnJvbSB0aGUgbGlzdCB0aGVuXG4gICAgICBpZiAobm9kZS5sZW5ndGggJiYgbm9kZVswXSkgbm9kZSA9IG5vZGVbMF07XG4gICAgICBlbHNlIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiBTdGlja3lmaWxsIGlzIGFscmVhZHkgYXBwbGllZCB0byB0aGUgbm9kZVxuICAgIC8vIGFuZCByZXR1cm4gZXhpc3Rpbmcgc3RpY2t5XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGlja2llcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHN0aWNraWVzW2ldLl9ub2RlID09PSBub2RlKSByZXR1cm4gc3RpY2tpZXNbaV07XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIGFuZCByZXR1cm4gbmV3IHN0aWNreVxuICAgIHJldHVybiBuZXcgU3RpY2t5KG5vZGUpO1xuICB9LFxuXG4gIGFkZChub2RlTGlzdCkge1xuICAgIC8vIElmIGl04oCZcyBhIG5vZGUgbWFrZSBhbiBhcnJheSBvZiBvbmUgbm9kZVxuICAgIGlmIChub2RlTGlzdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSBub2RlTGlzdCA9IFtub2RlTGlzdF07XG4gICAgLy8gQ2hlY2sgaWYgdGhlIGFyZ3VtZW50IGlzIGFuIGl0ZXJhYmxlIG9mIHNvbWUgc29ydFxuICAgIGlmICghbm9kZUxpc3QubGVuZ3RoKSByZXR1cm47XG5cbiAgICAvLyBBZGQgZXZlcnkgZWxlbWVudCBhcyBhIHN0aWNreSBhbmQgcmV0dXJuIGFuIGFycmF5IG9mIGNyZWF0ZWQgU3RpY2t5IGluc3RhbmNlc1xuICAgIGNvbnN0IGFkZGVkU3RpY2tpZXMgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG5vZGUgPSBub2RlTGlzdFtpXTtcblxuICAgICAgLy8gSWYgaXTigJlzIG5vdCBhbiBIVE1MRWxlbWVudCDigJMgY3JlYXRlIGFuIGVtcHR5IGVsZW1lbnQgdG8gcHJlc2VydmUgMS10by0xXG4gICAgICAvLyBjb3JyZWxhdGlvbiB3aXRoIGlucHV0IGxpc3RcbiAgICAgIGlmICghKG5vZGUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHtcbiAgICAgICAgYWRkZWRTdGlja2llcy5wdXNoKHZvaWQgMCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBTdGlja3lmaWxsIGlzIGFscmVhZHkgYXBwbGllZCB0byB0aGUgbm9kZVxuICAgICAgLy8gYWRkIGV4aXN0aW5nIHN0aWNreVxuICAgICAgaWYgKHN0aWNraWVzLnNvbWUoc3RpY2t5ID0+IHtcbiAgICAgICAgICBpZiAoc3RpY2t5Ll9ub2RlID09PSBub2RlKSB7XG4gICAgICAgICAgICBhZGRlZFN0aWNraWVzLnB1c2goc3RpY2t5KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkpIGNvbnRpbnVlO1xuXG4gICAgICAvLyBDcmVhdGUgYW5kIGFkZCBuZXcgc3RpY2t5XG4gICAgICBhZGRlZFN0aWNraWVzLnB1c2gobmV3IFN0aWNreShub2RlKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFkZGVkU3RpY2tpZXM7XG4gIH0sXG5cbiAgcmVmcmVzaEFsbCgpIHtcbiAgICBzdGlja2llcy5mb3JFYWNoKHN0aWNreSA9PiBzdGlja3kucmVmcmVzaCgpKTtcbiAgfSxcblxuICByZW1vdmVPbmUobm9kZSkge1xuICAgIC8vIENoZWNrIHdoZXRoZXIgaXTigJlzIGEgbm9kZVxuICAgIGlmICghKG5vZGUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHtcbiAgICAgIC8vIE1heWJlIGl04oCZcyBhIG5vZGUgbGlzdCBvZiBzb21lIHNvcnQ/XG4gICAgICAvLyBUYWtlIGZpcnN0IG5vZGUgZnJvbSB0aGUgbGlzdCB0aGVuXG4gICAgICBpZiAobm9kZS5sZW5ndGggJiYgbm9kZVswXSkgbm9kZSA9IG5vZGVbMF07XG4gICAgICBlbHNlIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgdGhlIHN0aWNraWVzIGJvdW5kIHRvIHRoZSBub2RlcyBpbiB0aGUgbGlzdFxuICAgIHN0aWNraWVzLnNvbWUoc3RpY2t5ID0+IHtcbiAgICAgIGlmIChzdGlja3kuX25vZGUgPT09IG5vZGUpIHtcbiAgICAgICAgc3RpY2t5LnJlbW92ZSgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICByZW1vdmUobm9kZUxpc3QpIHtcbiAgICAvLyBJZiBpdOKAmXMgYSBub2RlIG1ha2UgYW4gYXJyYXkgb2Ygb25lIG5vZGVcbiAgICBpZiAobm9kZUxpc3QgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkgbm9kZUxpc3QgPSBbbm9kZUxpc3RdO1xuICAgIC8vIENoZWNrIGlmIHRoZSBhcmd1bWVudCBpcyBhbiBpdGVyYWJsZSBvZiBzb21lIHNvcnRcbiAgICBpZiAoIW5vZGVMaXN0Lmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgLy8gUmVtb3ZlIHRoZSBzdGlja2llcyBib3VuZCB0byB0aGUgbm9kZXMgaW4gdGhlIGxpc3RcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBub2RlID0gbm9kZUxpc3RbaV07XG5cbiAgICAgIHN0aWNraWVzLnNvbWUoc3RpY2t5ID0+IHtcbiAgICAgICAgaWYgKHN0aWNreS5fbm9kZSA9PT0gbm9kZSkge1xuICAgICAgICAgIHN0aWNreS5yZW1vdmUoKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9LFxuXG4gIHJlbW92ZUFsbCgpIHtcbiAgICB3aGlsZSAoc3RpY2tpZXMubGVuZ3RoKSBzdGlja2llc1swXS5yZW1vdmUoKTtcbiAgfVxufTtcblxuXG4vKlxuICogNi4gU2V0dXAgZXZlbnRzICh1bmxlc3MgdGhlIHBvbHlmaWxsIHdhcyBkaXNhYmxlZClcbiAqL1xuZnVuY3Rpb24gaW5pdCgpIHtcbiAgaWYgKGlzSW5pdGlhbGl6ZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpc0luaXRpYWxpemVkID0gdHJ1ZTtcblxuICAvLyBXYXRjaCBmb3Igc2Nyb2xsIHBvc2l0aW9uIGNoYW5nZXMgYW5kIHRyaWdnZXIgcmVjYWxjL3JlZnJlc2ggaWYgbmVlZGVkXG4gIGZ1bmN0aW9uIGNoZWNrU2Nyb2xsKCkge1xuICAgIGlmICh3aW5kb3cucGFnZVhPZmZzZXQgIT0gc2Nyb2xsLmxlZnQpIHtcbiAgICAgIHNjcm9sbC50b3AgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgICBzY3JvbGwubGVmdCA9IHdpbmRvdy5wYWdlWE9mZnNldDtcblxuICAgICAgU3RpY2t5ZmlsbC5yZWZyZXNoQWxsKCk7XG4gICAgfSBlbHNlIGlmICh3aW5kb3cucGFnZVlPZmZzZXQgIT0gc2Nyb2xsLnRvcCkge1xuICAgICAgc2Nyb2xsLnRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgIHNjcm9sbC5sZWZ0ID0gd2luZG93LnBhZ2VYT2Zmc2V0O1xuXG4gICAgICAvLyByZWNhbGMgcG9zaXRpb24gZm9yIGFsbCBzdGlja2llc1xuICAgICAgc3RpY2tpZXMuZm9yRWFjaChzdGlja3kgPT4gc3RpY2t5Ll9yZWNhbGNQb3NpdGlvbigpKTtcbiAgICB9XG4gIH1cblxuICBjaGVja1Njcm9sbCgpO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgY2hlY2tTY3JvbGwpO1xuXG4gIC8vIFdhdGNoIGZvciB3aW5kb3cgcmVzaXplcyBhbmQgZGV2aWNlIG9yaWVudGF0aW9uIGNoYW5nZXMgYW5kIHRyaWdnZXIgcmVmcmVzaFxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgU3RpY2t5ZmlsbC5yZWZyZXNoQWxsKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgU3RpY2t5ZmlsbC5yZWZyZXNoQWxsKTtcblxuICAvL0Zhc3QgZGlydHkgY2hlY2sgZm9yIGxheW91dCBjaGFuZ2VzIGV2ZXJ5IDUwMG1zXG4gIGxldCBmYXN0Q2hlY2tUaW1lcjtcblxuICBmdW5jdGlvbiBzdGFydEZhc3RDaGVja1RpbWVyKCkge1xuICAgIGZhc3RDaGVja1RpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgc3RpY2tpZXMuZm9yRWFjaChzdGlja3kgPT4gc3RpY2t5Ll9mYXN0Q2hlY2soKSk7XG4gICAgfSwgNTAwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0b3BGYXN0Q2hlY2tUaW1lcigpIHtcbiAgICBjbGVhckludGVydmFsKGZhc3RDaGVja1RpbWVyKTtcbiAgfVxuXG4gIGxldCBkb2NIaWRkZW5LZXk7XG4gIGxldCB2aXNpYmlsaXR5Q2hhbmdlRXZlbnROYW1lO1xuXG4gIGlmICgnaGlkZGVuJyBpbiBkb2N1bWVudCkge1xuICAgIGRvY0hpZGRlbktleSA9ICdoaWRkZW4nO1xuICAgIHZpc2liaWxpdHlDaGFuZ2VFdmVudE5hbWUgPSAndmlzaWJpbGl0eWNoYW5nZSc7XG4gIH0gZWxzZSBpZiAoJ3dlYmtpdEhpZGRlbicgaW4gZG9jdW1lbnQpIHtcbiAgICBkb2NIaWRkZW5LZXkgPSAnd2Via2l0SGlkZGVuJztcbiAgICB2aXNpYmlsaXR5Q2hhbmdlRXZlbnROYW1lID0gJ3dlYmtpdHZpc2liaWxpdHljaGFuZ2UnO1xuICB9XG5cbiAgaWYgKHZpc2liaWxpdHlDaGFuZ2VFdmVudE5hbWUpIHtcbiAgICBpZiAoIWRvY3VtZW50W2RvY0hpZGRlbktleV0pIHN0YXJ0RmFzdENoZWNrVGltZXIoKTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIodmlzaWJpbGl0eUNoYW5nZUV2ZW50TmFtZSwgKCkgPT4ge1xuICAgICAgaWYgKGRvY3VtZW50W2RvY0hpZGRlbktleV0pIHtcbiAgICAgICAgc3RvcEZhc3RDaGVja1RpbWVyKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGFydEZhc3RDaGVja1RpbWVyKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSBzdGFydEZhc3RDaGVja1RpbWVyKCk7XG59XG5cbmlmICghc2VwcHVrdSkgaW5pdCgpO1xuXG5cbi8qXG4gKiA3LiBFeHBvc2UgU3RpY2t5ZmlsbFxuICovXG5pZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICBtb2R1bGUuZXhwb3J0cyA9IFN0aWNreWZpbGw7XG59IGVsc2UgaWYgKGlzV2luZG93RGVmaW5lZCkge1xuICB3aW5kb3cuU3RpY2t5ZmlsbCA9IFN0aWNreWZpbGw7XG59XG5cbi8qISBwaWN0dXJlZmlsbCAtIHYzLjAuMiAtIDIwMTYtMDItMTJcbiAqIGh0dHBzOi8vc2NvdHRqZWhsLmdpdGh1Yi5pby9waWN0dXJlZmlsbC9cbiAqIENvcHlyaWdodCAoYykgMjAxNiBodHRwczovL2dpdGh1Yi5jb20vc2NvdHRqZWhsL3BpY3R1cmVmaWxsL2Jsb2IvbWFzdGVyL0F1dGhvcnMudHh0OyBMaWNlbnNlZCBNSVRcbiAqL1xuLyohIEdlY2tvLVBpY3R1cmUgLSB2MS4wXG4gKiBodHRwczovL2dpdGh1Yi5jb20vc2NvdHRqZWhsL3BpY3R1cmVmaWxsL3RyZWUvMy4wL3NyYy9wbHVnaW5zL2dlY2tvLXBpY3R1cmVcbiAqIEZpcmVmb3gncyBlYXJseSBwaWN0dXJlIGltcGxlbWVudGF0aW9uIChwcmlvciB0byBGRjQxKSBpcyBzdGF0aWMgYW5kIGRvZXNcbiAqIG5vdCByZWFjdCB0byB2aWV3cG9ydCBjaGFuZ2VzLiBUaGlzIHRpbnkgbW9kdWxlIGZpeGVzIHRoaXMuXG4gKi9cbihmdW5jdGlvbiAod2luZG93KSB7XG4gIC8qanNoaW50IGVxbnVsbDp0cnVlICovXG4gIHZhciB1YSA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG5cbiAgaWYgKHdpbmRvdy5IVE1MUGljdHVyZUVsZW1lbnQgJiYgKCgvZWNrby8pLnRlc3QodWEpICYmIHVhLm1hdGNoKC9ydlxcOihcXGQrKS8pICYmIFJlZ0V4cC4kMSA8IDQ1KSkge1xuICAgIGFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0aW1lcjtcblxuICAgICAgdmFyIGR1bW15U3JjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNvdXJjZVwiKTtcblxuICAgICAgdmFyIGZpeFJlc3BpbWcgPSBmdW5jdGlvbiAoaW1nKSB7XG4gICAgICAgIHZhciBzb3VyY2UsIHNpemVzO1xuICAgICAgICB2YXIgcGljdHVyZSA9IGltZy5wYXJlbnROb2RlO1xuXG4gICAgICAgIGlmIChwaWN0dXJlLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgPT09IFwiUElDVFVSRVwiKSB7XG4gICAgICAgICAgc291cmNlID0gZHVtbXlTcmMuY2xvbmVOb2RlKCk7XG5cbiAgICAgICAgICBwaWN0dXJlLmluc2VydEJlZm9yZShzb3VyY2UsIHBpY3R1cmUuZmlyc3RFbGVtZW50Q2hpbGQpO1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcGljdHVyZS5yZW1vdmVDaGlsZChzb3VyY2UpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKCFpbWcuX3BmTGFzdFNpemUgfHwgaW1nLm9mZnNldFdpZHRoID4gaW1nLl9wZkxhc3RTaXplKSB7XG4gICAgICAgICAgaW1nLl9wZkxhc3RTaXplID0gaW1nLm9mZnNldFdpZHRoO1xuICAgICAgICAgIHNpemVzID0gaW1nLnNpemVzO1xuICAgICAgICAgIGltZy5zaXplcyArPSBcIiwxMDB2d1wiO1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaW1nLnNpemVzID0gc2l6ZXM7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHZhciBmaW5kUGljdHVyZUltZ3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIgaW1ncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJwaWN0dXJlID4gaW1nLCBpbWdbc3Jjc2V0XVtzaXplc11cIik7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBpbWdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZml4UmVzcGltZyhpbWdzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHZhciBvblJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KGZpbmRQaWN0dXJlSW1ncywgOTkpO1xuICAgICAgfTtcbiAgICAgIHZhciBtcSA9IHdpbmRvdy5tYXRjaE1lZGlhICYmIG1hdGNoTWVkaWEoXCIob3JpZW50YXRpb246IGxhbmRzY2FwZSlcIik7XG4gICAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb25SZXNpemUoKTtcblxuICAgICAgICBpZiAobXEgJiYgbXEuYWRkTGlzdGVuZXIpIHtcbiAgICAgICAgICBtcS5hZGRMaXN0ZW5lcihvblJlc2l6ZSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGR1bW15U3JjLnNyY3NldCA9IFwiZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoQVFBQkFBQUFBQ0g1QkFFS0FBRUFMQUFBQUFBQkFBRUFBQUlDVEFFQU93PT1cIjtcblxuICAgICAgaWYgKC9eW2N8aV18ZCQvLnRlc3QoZG9jdW1lbnQucmVhZHlTdGF0ZSB8fCBcIlwiKSkge1xuICAgICAgICBpbml0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBpbml0KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG9uUmVzaXplO1xuICAgIH0pKCkpO1xuICB9XG59KSh3aW5kb3cpO1xuXG4vKiEgUGljdHVyZWZpbGwgLSB2My4wLjJcbiAqIGh0dHA6Ly9zY290dGplaGwuZ2l0aHViLmlvL3BpY3R1cmVmaWxsXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUgaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0amVobC9waWN0dXJlZmlsbC9ibG9iL21hc3Rlci9BdXRob3JzLnR4dDtcbiAqICBMaWNlbnNlOiBNSVRcbiAqL1xuXG4oZnVuY3Rpb24gKHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAvLyBFbmFibGUgc3RyaWN0IG1vZGVcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLy8gSFRNTCBzaGltfHYgaXQgZm9yIG9sZCBJRSAoSUU5IHdpbGwgc3RpbGwgbmVlZCB0aGUgSFRNTCB2aWRlbyB0YWcgd29ya2Fyb3VuZClcbiAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBpY3R1cmVcIik7XG5cbiAgdmFyIHdhcm4sIGVtaW5weCwgYWx3YXlzQ2hlY2tXRGVzY3JpcHRvciwgZXZhbElkO1xuICAvLyBsb2NhbCBvYmplY3QgZm9yIG1ldGhvZCByZWZlcmVuY2VzIGFuZCB0ZXN0aW5nIGV4cG9zdXJlXG4gIHZhciBwZiA9IHt9O1xuICB2YXIgaXNTdXBwb3J0VGVzdFJlYWR5ID0gZmFsc2U7XG4gIHZhciBub29wID0gZnVuY3Rpb24gKCkge307XG4gIHZhciBpbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gIHZhciBnZXRJbWdBdHRyID0gaW1hZ2UuZ2V0QXR0cmlidXRlO1xuICB2YXIgc2V0SW1nQXR0ciA9IGltYWdlLnNldEF0dHJpYnV0ZTtcbiAgdmFyIHJlbW92ZUltZ0F0dHIgPSBpbWFnZS5yZW1vdmVBdHRyaWJ1dGU7XG4gIHZhciBkb2NFbGVtID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICB2YXIgdHlwZXMgPSB7fTtcbiAgdmFyIGNmZyA9IHtcbiAgICAvL3Jlc291cmNlIHNlbGVjdGlvbjpcbiAgICBhbGdvcml0aG06IFwiXCJcbiAgfTtcbiAgdmFyIHNyY0F0dHIgPSBcImRhdGEtcGZzcmNcIjtcbiAgdmFyIHNyY3NldEF0dHIgPSBzcmNBdHRyICsgXCJzZXRcIjtcbiAgLy8gdWEgc25pZmZpbmcgaXMgZG9uZSBmb3IgdW5kZXRlY3RhYmxlIGltZyBsb2FkaW5nIGZlYXR1cmVzLFxuICAvLyB0byBkbyBzb21lIG5vbiBjcnVjaWFsIHBlcmYgb3B0aW1pemF0aW9uc1xuICB2YXIgdWEgPSBuYXZpZ2F0b3IudXNlckFnZW50O1xuICB2YXIgc3VwcG9ydEFib3J0ID0gKC9yaWRlbnQvKS50ZXN0KHVhKSB8fCAoKC9lY2tvLykudGVzdCh1YSkgJiYgdWEubWF0Y2goL3J2XFw6KFxcZCspLykgJiYgUmVnRXhwLiQxID4gMzUpO1xuICB2YXIgY3VyU3JjUHJvcCA9IFwiY3VycmVudFNyY1wiO1xuICB2YXIgcmVnV0Rlc2MgPSAvXFxzK1xcKz9cXGQrKGVcXGQrKT93LztcbiAgdmFyIHJlZ1NpemUgPSAvKFxcKFteKV0rXFwpKT9cXHMqKC4rKS87XG4gIHZhciBzZXRPcHRpb25zID0gd2luZG93LnBpY3R1cmVmaWxsQ0ZHO1xuICAvKipcbiAgICogU2hvcnRjdXQgcHJvcGVydHkgZm9yIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby93ZWJhcHBzZWMvc3BlY3MvbWl4ZWRjb250ZW50LyNyZXN0cmljdHMtbWl4ZWQtY29udGVudCAoIGZvciBlYXN5IG92ZXJyaWRpbmcgaW4gdGVzdHMgKVxuICAgKi9cbiAgLy8gYmFzZVN0eWxlIGFsc28gdXNlZCBieSBnZXRFbVZhbHVlIChpLmUuOiB3aWR0aDogMWVtIGlzIGltcG9ydGFudClcbiAgdmFyIGJhc2VTdHlsZSA9IFwicG9zaXRpb246YWJzb2x1dGU7bGVmdDowO3Zpc2liaWxpdHk6aGlkZGVuO2Rpc3BsYXk6YmxvY2s7cGFkZGluZzowO2JvcmRlcjpub25lO2ZvbnQtc2l6ZToxZW07d2lkdGg6MWVtO292ZXJmbG93OmhpZGRlbjtjbGlwOnJlY3QoMHB4LCAwcHgsIDBweCwgMHB4KVwiO1xuICB2YXIgZnNDc3MgPSBcImZvbnQtc2l6ZToxMDAlIWltcG9ydGFudDtcIjtcbiAgdmFyIGlzVndEaXJ0eSA9IHRydWU7XG5cbiAgdmFyIGNzc0NhY2hlID0ge307XG4gIHZhciBzaXplTGVuZ3RoQ2FjaGUgPSB7fTtcbiAgdmFyIERQUiA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICB2YXIgdW5pdHMgPSB7XG4gICAgcHg6IDEsXG4gICAgXCJpblwiOiA5NlxuICB9O1xuICB2YXIgYW5jaG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gIC8qKlxuICAgKiBhbHJlYWR5UnVuIGZsYWcgdXNlZCBmb3Igc2V0T3B0aW9ucy4gaXMgaXQgdHJ1ZSBzZXRPcHRpb25zIHdpbGwgcmVldmFsdWF0ZVxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHZhciBhbHJlYWR5UnVuID0gZmFsc2U7XG5cbiAgLy8gUmV1c2FibGUsIG5vbi1cImdcIiBSZWdleGVzXG5cbiAgLy8gKERvbid0IHVzZSBcXHMsIHRvIGF2b2lkIG1hdGNoaW5nIG5vbi1icmVha2luZyBzcGFjZS4pXG4gIHZhciByZWdleExlYWRpbmdTcGFjZXMgPSAvXlsgXFx0XFxuXFxyXFx1MDAwY10rLyxcbiAgICByZWdleExlYWRpbmdDb21tYXNPclNwYWNlcyA9IC9eWywgXFx0XFxuXFxyXFx1MDAwY10rLyxcbiAgICByZWdleExlYWRpbmdOb3RTcGFjZXMgPSAvXlteIFxcdFxcblxcclxcdTAwMGNdKy8sXG4gICAgcmVnZXhUcmFpbGluZ0NvbW1hcyA9IC9bLF0rJC8sXG4gICAgcmVnZXhOb25OZWdhdGl2ZUludGVnZXIgPSAvXlxcZCskLyxcblxuICAgIC8vICggUG9zaXRpdmUgb3IgbmVnYXRpdmUgb3IgdW5zaWduZWQgaW50ZWdlcnMgb3IgZGVjaW1hbHMsIHdpdGhvdXQgb3Igd2l0aG91dCBleHBvbmVudHMuXG4gICAgLy8gTXVzdCBpbmNsdWRlIGF0IGxlYXN0IG9uZSBkaWdpdC5cbiAgICAvLyBBY2NvcmRpbmcgdG8gc3BlYyB0ZXN0cyBhbnkgZGVjaW1hbCBwb2ludCBtdXN0IGJlIGZvbGxvd2VkIGJ5IGEgZGlnaXQuXG4gICAgLy8gTm8gbGVhZGluZyBwbHVzIHNpZ24gaXMgYWxsb3dlZC4pXG4gICAgLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvaW5mcmFzdHJ1Y3R1cmUuaHRtbCN2YWxpZC1mbG9hdGluZy1wb2ludC1udW1iZXJcbiAgICByZWdleEZsb2F0aW5nUG9pbnQgPSAvXi0/KD86WzAtOV0rfFswLTldKlxcLlswLTldKykoPzpbZUVdWystXT9bMC05XSspPyQvO1xuXG4gIHZhciBvbiA9IGZ1bmN0aW9uIChvYmosIGV2dCwgZm4sIGNhcHR1cmUpIHtcbiAgICBpZiAob2JqLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIG9iai5hZGRFdmVudExpc3RlbmVyKGV2dCwgZm4sIGNhcHR1cmUgfHwgZmFsc2UpO1xuICAgIH0gZWxzZSBpZiAob2JqLmF0dGFjaEV2ZW50KSB7XG4gICAgICBvYmouYXR0YWNoRXZlbnQoXCJvblwiICsgZXZ0LCBmbik7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBzaW1wbGUgbWVtb2l6ZSBmdW5jdGlvbjpcbiAgICovXG5cbiAgdmFyIG1lbW9pemUgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICB2YXIgY2FjaGUgPSB7fTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICBpZiAoIShpbnB1dCBpbiBjYWNoZSkpIHtcbiAgICAgICAgY2FjaGVbaW5wdXRdID0gZm4oaW5wdXQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNhY2hlW2lucHV0XTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFVUSUxJVFkgRlVOQ1RJT05TXG5cbiAgLy8gTWFudWFsIGlzIGZhc3RlciB0aGFuIFJlZ0V4XG4gIC8vIGh0dHA6Ly9qc3BlcmYuY29tL3doaXRlc3BhY2UtY2hhcmFjdGVyLzVcbiAgZnVuY3Rpb24gaXNTcGFjZShjKSB7XG4gICAgcmV0dXJuIChjID09PSBcIlxcdTAwMjBcIiB8fCAvLyBzcGFjZVxuICAgICAgYyA9PT0gXCJcXHUwMDA5XCIgfHwgLy8gaG9yaXpvbnRhbCB0YWJcbiAgICAgIGMgPT09IFwiXFx1MDAwQVwiIHx8IC8vIG5ldyBsaW5lXG4gICAgICBjID09PSBcIlxcdTAwMENcIiB8fCAvLyBmb3JtIGZlZWRcbiAgICAgIGMgPT09IFwiXFx1MDAwRFwiKTsgLy8gY2FycmlhZ2UgcmV0dXJuXG4gIH1cblxuICAvKipcbiAgICogZ2V0cyBhIG1lZGlhcXVlcnkgYW5kIHJldHVybnMgYSBib29sZWFuIG9yIGdldHMgYSBjc3MgbGVuZ3RoIGFuZCByZXR1cm5zIGEgbnVtYmVyXG4gICAqIEBwYXJhbSBjc3MgbWVkaWFxdWVyaWVzIG9yIGNzcyBsZW5ndGhcbiAgICogQHJldHVybnMge2Jvb2xlYW58bnVtYmVyfVxuICAgKlxuICAgKiBiYXNlZCBvbjogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vam9uYXRoYW50bmVhbC9kYjRmNzcwMDliMTU1ZjA4MzczOFxuICAgKi9cbiAgdmFyIGV2YWxDU1MgPSAoZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIHJlZ0xlbmd0aCA9IC9eKFtcXGRcXC5dKykoZW18dnd8cHgpJC87XG4gICAgdmFyIHJlcGxhY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgaW5kZXggPSAwLFxuICAgICAgICBzdHJpbmcgPSBhcmdzWzBdO1xuICAgICAgd2hpbGUgKCsraW5kZXggaW4gYXJncykge1xuICAgICAgICBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZShhcmdzW2luZGV4XSwgYXJnc1srK2luZGV4XSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RyaW5nO1xuICAgIH07XG5cbiAgICB2YXIgYnVpbGRTdHIgPSBtZW1vaXplKGZ1bmN0aW9uIChjc3MpIHtcblxuICAgICAgcmV0dXJuIFwicmV0dXJuIFwiICsgcmVwbGFjZSgoY3NzIHx8IFwiXCIpLnRvTG93ZXJDYXNlKCksXG4gICAgICAgIC8vIGludGVycHJldCBgYW5kYFxuICAgICAgICAvXFxiYW5kXFxiL2csIFwiJiZcIixcblxuICAgICAgICAvLyBpbnRlcnByZXQgYCxgXG4gICAgICAgIC8sL2csIFwifHxcIixcblxuICAgICAgICAvLyBpbnRlcnByZXQgYG1pbi1gIGFzID49XG4gICAgICAgIC9taW4tKFthLXotXFxzXSspOi9nLCBcImUuJDE+PVwiLFxuXG4gICAgICAgIC8vIGludGVycHJldCBgbWF4LWAgYXMgPD1cbiAgICAgICAgL21heC0oW2Etei1cXHNdKyk6L2csIFwiZS4kMTw9XCIsXG5cbiAgICAgICAgLy9jYWxjIHZhbHVlXG4gICAgICAgIC9jYWxjKFteKV0rKS9nLCBcIigkMSlcIixcblxuICAgICAgICAvLyBpbnRlcnByZXQgY3NzIHZhbHVlc1xuICAgICAgICAvKFxcZCtbXFwuXSpbXFxkXSopKFthLXpdKykvZywgXCIoJDEgKiBlLiQyKVwiLFxuICAgICAgICAvL21ha2UgZXZhbCBsZXNzIGV2aWxcbiAgICAgICAgL14oPyEoZS5bYS16XXxbMC05XFwuJj18PjxcXCtcXC1cXCpcXChcXClcXC9dKSkuKi9pZywgXCJcIlxuICAgICAgKSArIFwiO1wiO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChjc3MsIGxlbmd0aCkge1xuICAgICAgdmFyIHBhcnNlZExlbmd0aDtcbiAgICAgIGlmICghKGNzcyBpbiBjc3NDYWNoZSkpIHtcbiAgICAgICAgY3NzQ2FjaGVbY3NzXSA9IGZhbHNlO1xuICAgICAgICBpZiAobGVuZ3RoICYmIChwYXJzZWRMZW5ndGggPSBjc3MubWF0Y2gocmVnTGVuZ3RoKSkpIHtcbiAgICAgICAgICBjc3NDYWNoZVtjc3NdID0gcGFyc2VkTGVuZ3RoWzFdICogdW5pdHNbcGFyc2VkTGVuZ3RoWzJdXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvKmpzaGludCBldmlsOnRydWUgKi9cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY3NzQ2FjaGVbY3NzXSA9IG5ldyBGdW5jdGlvbihcImVcIiwgYnVpbGRTdHIoY3NzKSkodW5pdHMpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgICAgLypqc2hpbnQgZXZpbDpmYWxzZSAqL1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gY3NzQ2FjaGVbY3NzXTtcbiAgICB9O1xuICB9KSgpO1xuXG4gIHZhciBzZXRSZXNvbHV0aW9uID0gZnVuY3Rpb24gKGNhbmRpZGF0ZSwgc2l6ZXNhdHRyKSB7XG4gICAgaWYgKGNhbmRpZGF0ZS53KSB7IC8vIGggPSBtZWFucyBoZWlnaHQ6IHx8IGRlc2NyaXB0b3IudHlwZSA9PT0gJ2gnIGRvIG5vdCBoYW5kbGUgeWV0Li4uXG4gICAgICBjYW5kaWRhdGUuY1dpZHRoID0gcGYuY2FsY0xpc3RMZW5ndGgoc2l6ZXNhdHRyIHx8IFwiMTAwdndcIik7XG4gICAgICBjYW5kaWRhdGUucmVzID0gY2FuZGlkYXRlLncgLyBjYW5kaWRhdGUuY1dpZHRoO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYW5kaWRhdGUucmVzID0gY2FuZGlkYXRlLmQ7XG4gICAgfVxuICAgIHJldHVybiBjYW5kaWRhdGU7XG4gIH07XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBvcHRcbiAgICovXG4gIHZhciBwaWN0dXJlZmlsbCA9IGZ1bmN0aW9uIChvcHQpIHtcblxuICAgIGlmICghaXNTdXBwb3J0VGVzdFJlYWR5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGVsZW1lbnRzLCBpLCBwbGVuO1xuXG4gICAgdmFyIG9wdGlvbnMgPSBvcHQgfHwge307XG5cbiAgICBpZiAob3B0aW9ucy5lbGVtZW50cyAmJiBvcHRpb25zLmVsZW1lbnRzLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICBpZiAob3B0aW9ucy5lbGVtZW50cy5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpID09PSBcIklNR1wiKSB7XG4gICAgICAgIG9wdGlvbnMuZWxlbWVudHMgPSBbb3B0aW9ucy5lbGVtZW50c107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHRpb25zLmNvbnRleHQgPSBvcHRpb25zLmVsZW1lbnRzO1xuICAgICAgICBvcHRpb25zLmVsZW1lbnRzID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbGVtZW50cyA9IG9wdGlvbnMuZWxlbWVudHMgfHwgcGYucXNhKChvcHRpb25zLmNvbnRleHQgfHwgZG9jdW1lbnQpLCAob3B0aW9ucy5yZWV2YWx1YXRlIHx8IG9wdGlvbnMucmVzZWxlY3QpID8gcGYuc2VsIDogcGYuc2VsU2hvcnQpO1xuXG4gICAgaWYgKChwbGVuID0gZWxlbWVudHMubGVuZ3RoKSkge1xuXG4gICAgICBwZi5zZXR1cFJ1bihvcHRpb25zKTtcbiAgICAgIGFscmVhZHlSdW4gPSB0cnVlO1xuXG4gICAgICAvLyBMb29wIHRocm91Z2ggYWxsIGVsZW1lbnRzXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgcGxlbjsgaSsrKSB7XG4gICAgICAgIHBmLmZpbGxJbWcoZWxlbWVudHNbaV0sIG9wdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICBwZi50ZWFyZG93blJ1bihvcHRpb25zKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIG91dHB1dHMgYSB3YXJuaW5nIGZvciB0aGUgZGV2ZWxvcGVyXG4gICAqIEBwYXJhbSB7bWVzc2FnZX1cbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgd2FybiA9ICh3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLndhcm4pID9cbiAgICBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgY29uc29sZS53YXJuKG1lc3NhZ2UpO1xuICAgIH0gOlxuICAgIG5vb3A7XG5cbiAgaWYgKCEoY3VyU3JjUHJvcCBpbiBpbWFnZSkpIHtcbiAgICBjdXJTcmNQcm9wID0gXCJzcmNcIjtcbiAgfVxuXG4gIC8vIEFkZCBzdXBwb3J0IGZvciBzdGFuZGFyZCBtaW1lIHR5cGVzLlxuICB0eXBlc1tcImltYWdlL2pwZWdcIl0gPSB0cnVlO1xuICB0eXBlc1tcImltYWdlL2dpZlwiXSA9IHRydWU7XG4gIHR5cGVzW1wiaW1hZ2UvcG5nXCJdID0gdHJ1ZTtcblxuICBmdW5jdGlvbiBkZXRlY3RUeXBlU3VwcG9ydCh0eXBlLCB0eXBlVXJpKSB7XG4gICAgLy8gYmFzZWQgb24gTW9kZXJuaXpyJ3MgbG9zc2xlc3MgaW1nLXdlYnAgdGVzdFxuICAgIC8vIG5vdGU6IGFzeW5jaHJvbm91c1xuICAgIHZhciBpbWFnZSA9IG5ldyB3aW5kb3cuSW1hZ2UoKTtcbiAgICBpbWFnZS5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgdHlwZXNbdHlwZV0gPSBmYWxzZTtcbiAgICAgIHBpY3R1cmVmaWxsKCk7XG4gICAgfTtcbiAgICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0eXBlc1t0eXBlXSA9IGltYWdlLndpZHRoID09PSAxO1xuICAgICAgcGljdHVyZWZpbGwoKTtcbiAgICB9O1xuICAgIGltYWdlLnNyYyA9IHR5cGVVcmk7XG4gICAgcmV0dXJuIFwicGVuZGluZ1wiO1xuICB9XG5cbiAgLy8gdGVzdCBzdmcgc3VwcG9ydFxuICB0eXBlc1tcImltYWdlL3N2Zyt4bWxcIl0gPSBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5oYXNGZWF0dXJlKFwiaHR0cDovL3d3dy53My5vcmcvVFIvU1ZHMTEvZmVhdHVyZSNJbWFnZVwiLCBcIjEuMVwiKTtcblxuICAvKipcbiAgICogdXBkYXRlcyB0aGUgaW50ZXJuYWwgdlcgcHJvcGVydHkgd2l0aCB0aGUgY3VycmVudCB2aWV3cG9ydCB3aWR0aCBpbiBweFxuICAgKi9cbiAgZnVuY3Rpb24gdXBkYXRlTWV0cmljcygpIHtcblxuICAgIGlzVndEaXJ0eSA9IGZhbHNlO1xuICAgIERQUiA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgIGNzc0NhY2hlID0ge307XG4gICAgc2l6ZUxlbmd0aENhY2hlID0ge307XG5cbiAgICBwZi5EUFIgPSBEUFIgfHwgMTtcblxuICAgIHVuaXRzLndpZHRoID0gTWF0aC5tYXgod2luZG93LmlubmVyV2lkdGggfHwgMCwgZG9jRWxlbS5jbGllbnRXaWR0aCk7XG4gICAgdW5pdHMuaGVpZ2h0ID0gTWF0aC5tYXgod2luZG93LmlubmVySGVpZ2h0IHx8IDAsIGRvY0VsZW0uY2xpZW50SGVpZ2h0KTtcblxuICAgIHVuaXRzLnZ3ID0gdW5pdHMud2lkdGggLyAxMDA7XG4gICAgdW5pdHMudmggPSB1bml0cy5oZWlnaHQgLyAxMDA7XG5cbiAgICBldmFsSWQgPSBbdW5pdHMuaGVpZ2h0LCB1bml0cy53aWR0aCwgRFBSXS5qb2luKFwiLVwiKTtcblxuICAgIHVuaXRzLmVtID0gcGYuZ2V0RW1WYWx1ZSgpO1xuICAgIHVuaXRzLnJlbSA9IHVuaXRzLmVtO1xuICB9XG5cbiAgZnVuY3Rpb24gY2hvb3NlTG93UmVzKGxvd2VyVmFsdWUsIGhpZ2hlclZhbHVlLCBkcHJWYWx1ZSwgaXNDYWNoZWQpIHtcbiAgICB2YXIgYm9udXNGYWN0b3IsIHRvb011Y2gsIGJvbnVzLCBtZWFuRGVuc2l0eTtcblxuICAgIC8vZXhwZXJpbWVudGFsXG4gICAgaWYgKGNmZy5hbGdvcml0aG0gPT09IFwic2F2ZURhdGFcIikge1xuICAgICAgaWYgKGxvd2VyVmFsdWUgPiAyLjcpIHtcbiAgICAgICAgbWVhbkRlbnNpdHkgPSBkcHJWYWx1ZSArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b29NdWNoID0gaGlnaGVyVmFsdWUgLSBkcHJWYWx1ZTtcbiAgICAgICAgYm9udXNGYWN0b3IgPSBNYXRoLnBvdyhsb3dlclZhbHVlIC0gMC42LCAxLjUpO1xuXG4gICAgICAgIGJvbnVzID0gdG9vTXVjaCAqIGJvbnVzRmFjdG9yO1xuXG4gICAgICAgIGlmIChpc0NhY2hlZCkge1xuICAgICAgICAgIGJvbnVzICs9IDAuMSAqIGJvbnVzRmFjdG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgbWVhbkRlbnNpdHkgPSBsb3dlclZhbHVlICsgYm9udXM7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG1lYW5EZW5zaXR5ID0gKGRwclZhbHVlID4gMSkgP1xuICAgICAgICBNYXRoLnNxcnQobG93ZXJWYWx1ZSAqIGhpZ2hlclZhbHVlKSA6XG4gICAgICAgIGxvd2VyVmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lYW5EZW5zaXR5ID4gZHByVmFsdWU7XG4gIH1cblxuICBmdW5jdGlvbiBhcHBseUJlc3RDYW5kaWRhdGUoaW1nKSB7XG4gICAgdmFyIHNyY1NldENhbmRpZGF0ZXM7XG4gICAgdmFyIG1hdGNoaW5nU2V0ID0gcGYuZ2V0U2V0KGltZyk7XG4gICAgdmFyIGV2YWx1YXRlZCA9IGZhbHNlO1xuICAgIGlmIChtYXRjaGluZ1NldCAhPT0gXCJwZW5kaW5nXCIpIHtcbiAgICAgIGV2YWx1YXRlZCA9IGV2YWxJZDtcbiAgICAgIGlmIChtYXRjaGluZ1NldCkge1xuICAgICAgICBzcmNTZXRDYW5kaWRhdGVzID0gcGYuc2V0UmVzKG1hdGNoaW5nU2V0KTtcbiAgICAgICAgcGYuYXBwbHlTZXRDYW5kaWRhdGUoc3JjU2V0Q2FuZGlkYXRlcywgaW1nKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaW1nW3BmLm5zXS5ldmFsZWQgPSBldmFsdWF0ZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBhc2NlbmRpbmdTb3J0KGEsIGIpIHtcbiAgICByZXR1cm4gYS5yZXMgLSBiLnJlcztcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFNyY1RvQ3VyKGltZywgc3JjLCBzZXQpIHtcbiAgICB2YXIgY2FuZGlkYXRlO1xuICAgIGlmICghc2V0ICYmIHNyYykge1xuICAgICAgc2V0ID0gaW1nW3BmLm5zXS5zZXRzO1xuICAgICAgc2V0ID0gc2V0ICYmIHNldFtzZXQubGVuZ3RoIC0gMV07XG4gICAgfVxuXG4gICAgY2FuZGlkYXRlID0gZ2V0Q2FuZGlkYXRlRm9yU3JjKHNyYywgc2V0KTtcblxuICAgIGlmIChjYW5kaWRhdGUpIHtcbiAgICAgIHNyYyA9IHBmLm1ha2VVcmwoc3JjKTtcbiAgICAgIGltZ1twZi5uc10uY3VyU3JjID0gc3JjO1xuICAgICAgaW1nW3BmLm5zXS5jdXJDYW4gPSBjYW5kaWRhdGU7XG5cbiAgICAgIGlmICghY2FuZGlkYXRlLnJlcykge1xuICAgICAgICBzZXRSZXNvbHV0aW9uKGNhbmRpZGF0ZSwgY2FuZGlkYXRlLnNldC5zaXplcyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjYW5kaWRhdGU7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDYW5kaWRhdGVGb3JTcmMoc3JjLCBzZXQpIHtcbiAgICB2YXIgaSwgY2FuZGlkYXRlLCBjYW5kaWRhdGVzO1xuICAgIGlmIChzcmMgJiYgc2V0KSB7XG4gICAgICBjYW5kaWRhdGVzID0gcGYucGFyc2VTZXQoc2V0KTtcbiAgICAgIHNyYyA9IHBmLm1ha2VVcmwoc3JjKTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBjYW5kaWRhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChzcmMgPT09IHBmLm1ha2VVcmwoY2FuZGlkYXRlc1tpXS51cmwpKSB7XG4gICAgICAgICAgY2FuZGlkYXRlID0gY2FuZGlkYXRlc1tpXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY2FuZGlkYXRlO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QWxsU291cmNlRWxlbWVudHMocGljdHVyZSwgY2FuZGlkYXRlcykge1xuICAgIHZhciBpLCBsZW4sIHNvdXJjZSwgc3Jjc2V0O1xuXG4gICAgLy8gU1BFQyBtaXNtYXRjaCBpbnRlbmRlZCBmb3Igc2l6ZSBhbmQgcGVyZjpcbiAgICAvLyBhY3R1YWxseSBvbmx5IHNvdXJjZSBlbGVtZW50cyBwcmVjZWRpbmcgdGhlIGltZyBzaG91bGQgYmUgdXNlZFxuICAgIC8vIGFsc28gbm90ZTogZG9uJ3QgdXNlIHFzYSBoZXJlLCBiZWNhdXNlIElFOCBzb21ldGltZXMgZG9lc24ndCBsaWtlIHNvdXJjZSBhcyB0aGUga2V5IHBhcnQgaW4gYSBzZWxlY3RvclxuICAgIHZhciBzb3VyY2VzID0gcGljdHVyZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNvdXJjZVwiKTtcblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IHNvdXJjZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHNvdXJjZSA9IHNvdXJjZXNbaV07XG4gICAgICBzb3VyY2VbcGYubnNdID0gdHJ1ZTtcbiAgICAgIHNyY3NldCA9IHNvdXJjZS5nZXRBdHRyaWJ1dGUoXCJzcmNzZXRcIik7XG5cbiAgICAgIC8vIGlmIHNvdXJjZSBkb2VzIG5vdCBoYXZlIGEgc3Jjc2V0IGF0dHJpYnV0ZSwgc2tpcFxuICAgICAgaWYgKHNyY3NldCkge1xuICAgICAgICBjYW5kaWRhdGVzLnB1c2goe1xuICAgICAgICAgIHNyY3NldDogc3Jjc2V0LFxuICAgICAgICAgIG1lZGlhOiBzb3VyY2UuZ2V0QXR0cmlidXRlKFwibWVkaWFcIiksXG4gICAgICAgICAgdHlwZTogc291cmNlLmdldEF0dHJpYnV0ZShcInR5cGVcIiksXG4gICAgICAgICAgc2l6ZXM6IHNvdXJjZS5nZXRBdHRyaWJ1dGUoXCJzaXplc1wiKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3Jjc2V0IFBhcnNlclxuICAgKiBCeSBBbGV4IEJlbGwgfCAgTUlUIExpY2Vuc2VcbiAgICpcbiAgICogQHJldHVybnMgQXJyYXkgW3t1cmw6IF8sIGQ6IF8sIHc6IF8sIGg6Xywgc2V0Ol8oPz8/Pyl9LCAuLi5dXG4gICAqXG4gICAqIEJhc2VkIHN1cGVyIGR1cGVyIGNsb3NlbHkgb24gdGhlIHJlZmVyZW5jZSBhbGdvcml0aG0gYXQ6XG4gICAqIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2VtYmVkZGVkLWNvbnRlbnQuaHRtbCNwYXJzZS1hLXNyY3NldC1hdHRyaWJ1dGVcbiAgICovXG5cbiAgLy8gMS4gTGV0IGlucHV0IGJlIHRoZSB2YWx1ZSBwYXNzZWQgdG8gdGhpcyBhbGdvcml0aG0uXG4gIC8vIChUTy1ETyA6IEV4cGxhaW4gd2hhdCBcInNldFwiIGFyZ3VtZW50IGlzIGhlcmUuIE1heWJlIGNob29zZSBhIG1vcmVcbiAgLy8gZGVzY3JpcHRpdmUgJiBtb3JlIHNlYXJjaGFibGUgbmFtZS4gIFNpbmNlIHBhc3NpbmcgdGhlIFwic2V0XCIgaW4gcmVhbGx5IGhhc1xuICAvLyBub3RoaW5nIHRvIGRvIHdpdGggcGFyc2luZyBwcm9wZXIsIEkgd291bGQgcHJlZmVyIHRoaXMgYXNzaWdubWVudCBldmVudHVhbGx5XG4gIC8vIGdvIGluIGFuIGV4dGVybmFsIGZuLilcbiAgZnVuY3Rpb24gcGFyc2VTcmNzZXQoaW5wdXQsIHNldCkge1xuXG4gICAgZnVuY3Rpb24gY29sbGVjdENoYXJhY3RlcnMocmVnRXgpIHtcbiAgICAgIHZhciBjaGFycyxcbiAgICAgICAgbWF0Y2ggPSByZWdFeC5leGVjKGlucHV0LnN1YnN0cmluZyhwb3MpKTtcbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICBjaGFycyA9IG1hdGNoWzBdO1xuICAgICAgICBwb3MgKz0gY2hhcnMubGVuZ3RoO1xuICAgICAgICByZXR1cm4gY2hhcnM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGlucHV0TGVuZ3RoID0gaW5wdXQubGVuZ3RoLFxuICAgICAgdXJsLFxuICAgICAgZGVzY3JpcHRvcnMsXG4gICAgICBjdXJyZW50RGVzY3JpcHRvcixcbiAgICAgIHN0YXRlLFxuICAgICAgYyxcblxuICAgICAgLy8gMi4gTGV0IHBvc2l0aW9uIGJlIGEgcG9pbnRlciBpbnRvIGlucHV0LCBpbml0aWFsbHkgcG9pbnRpbmcgYXQgdGhlIHN0YXJ0XG4gICAgICAvLyAgICBvZiB0aGUgc3RyaW5nLlxuICAgICAgcG9zID0gMCxcblxuICAgICAgLy8gMy4gTGV0IGNhbmRpZGF0ZXMgYmUgYW4gaW5pdGlhbGx5IGVtcHR5IHNvdXJjZSBzZXQuXG4gICAgICBjYW5kaWRhdGVzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGRlc2NyaXB0b3IgcHJvcGVydGllcyB0byBhIGNhbmRpZGF0ZSwgcHVzaGVzIHRvIHRoZSBjYW5kaWRhdGVzIGFycmF5XG4gICAgICogQHJldHVybiB1bmRlZmluZWRcbiAgICAgKi9cbiAgICAvLyAoRGVjbGFyZWQgb3V0c2lkZSBvZiB0aGUgd2hpbGUgbG9vcCBzbyB0aGF0IGl0J3Mgb25seSBjcmVhdGVkIG9uY2UuXG4gICAgLy8gKFRoaXMgZm4gaXMgZGVmaW5lZCBiZWZvcmUgaXQgaXMgdXNlZCwgaW4gb3JkZXIgdG8gcGFzcyBKU0hJTlQuXG4gICAgLy8gVW5mb3J0dW5hdGVseSB0aGlzIGJyZWFrcyB0aGUgc2VxdWVuY2luZyBvZiB0aGUgc3BlYyBjb21tZW50cy4gOi8gKVxuICAgIGZ1bmN0aW9uIHBhcnNlRGVzY3JpcHRvcnMoKSB7XG5cbiAgICAgIC8vIDkuIERlc2NyaXB0b3IgcGFyc2VyOiBMZXQgZXJyb3IgYmUgbm8uXG4gICAgICB2YXIgcEVycm9yID0gZmFsc2UsXG5cbiAgICAgICAgLy8gMTAuIExldCB3aWR0aCBiZSBhYnNlbnQuXG4gICAgICAgIC8vIDExLiBMZXQgZGVuc2l0eSBiZSBhYnNlbnQuXG4gICAgICAgIC8vIDEyLiBMZXQgZnV0dXJlLWNvbXBhdC1oIGJlIGFic2VudC4gKFdlJ3JlIGltcGxlbWVudGluZyBpdCBub3cgYXMgaClcbiAgICAgICAgdywgZCwgaCwgaSxcbiAgICAgICAgY2FuZGlkYXRlID0ge30sXG4gICAgICAgIGRlc2MsIGxhc3RDaGFyLCB2YWx1ZSwgaW50VmFsLCBmbG9hdFZhbDtcblxuICAgICAgLy8gMTMuIEZvciBlYWNoIGRlc2NyaXB0b3IgaW4gZGVzY3JpcHRvcnMsIHJ1biB0aGUgYXBwcm9wcmlhdGUgc2V0IG9mIHN0ZXBzXG4gICAgICAvLyBmcm9tIHRoZSBmb2xsb3dpbmcgbGlzdDpcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBkZXNjcmlwdG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICBkZXNjID0gZGVzY3JpcHRvcnNbaV07XG5cbiAgICAgICAgbGFzdENoYXIgPSBkZXNjW2Rlc2MubGVuZ3RoIC0gMV07XG4gICAgICAgIHZhbHVlID0gZGVzYy5zdWJzdHJpbmcoMCwgZGVzYy5sZW5ndGggLSAxKTtcbiAgICAgICAgaW50VmFsID0gcGFyc2VJbnQodmFsdWUsIDEwKTtcbiAgICAgICAgZmxvYXRWYWwgPSBwYXJzZUZsb2F0KHZhbHVlKTtcblxuICAgICAgICAvLyBJZiB0aGUgZGVzY3JpcHRvciBjb25zaXN0cyBvZiBhIHZhbGlkIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyIGZvbGxvd2VkIGJ5XG4gICAgICAgIC8vIGEgVSswMDc3IExBVElOIFNNQUxMIExFVFRFUiBXIGNoYXJhY3RlclxuICAgICAgICBpZiAocmVnZXhOb25OZWdhdGl2ZUludGVnZXIudGVzdCh2YWx1ZSkgJiYgKGxhc3RDaGFyID09PSBcIndcIikpIHtcblxuICAgICAgICAgIC8vIElmIHdpZHRoIGFuZCBkZW5zaXR5IGFyZSBub3QgYm90aCBhYnNlbnQsIHRoZW4gbGV0IGVycm9yIGJlIHllcy5cbiAgICAgICAgICBpZiAodyB8fCBkKSB7XG4gICAgICAgICAgICBwRXJyb3IgPSB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEFwcGx5IHRoZSBydWxlcyBmb3IgcGFyc2luZyBub24tbmVnYXRpdmUgaW50ZWdlcnMgdG8gdGhlIGRlc2NyaXB0b3IuXG4gICAgICAgICAgLy8gSWYgdGhlIHJlc3VsdCBpcyB6ZXJvLCBsZXQgZXJyb3IgYmUgeWVzLlxuICAgICAgICAgIC8vIE90aGVyd2lzZSwgbGV0IHdpZHRoIGJlIHRoZSByZXN1bHQuXG4gICAgICAgICAgaWYgKGludFZhbCA9PT0gMCkge1xuICAgICAgICAgICAgcEVycm9yID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdyA9IGludFZhbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBJZiB0aGUgZGVzY3JpcHRvciBjb25zaXN0cyBvZiBhIHZhbGlkIGZsb2F0aW5nLXBvaW50IG51bWJlciBmb2xsb3dlZCBieVxuICAgICAgICAgIC8vIGEgVSswMDc4IExBVElOIFNNQUxMIExFVFRFUiBYIGNoYXJhY3RlclxuICAgICAgICB9IGVsc2UgaWYgKHJlZ2V4RmxvYXRpbmdQb2ludC50ZXN0KHZhbHVlKSAmJiAobGFzdENoYXIgPT09IFwieFwiKSkge1xuXG4gICAgICAgICAgLy8gSWYgd2lkdGgsIGRlbnNpdHkgYW5kIGZ1dHVyZS1jb21wYXQtaCBhcmUgbm90IGFsbCBhYnNlbnQsIHRoZW4gbGV0IGVycm9yXG4gICAgICAgICAgLy8gYmUgeWVzLlxuICAgICAgICAgIGlmICh3IHx8IGQgfHwgaCkge1xuICAgICAgICAgICAgcEVycm9yID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBcHBseSB0aGUgcnVsZXMgZm9yIHBhcnNpbmcgZmxvYXRpbmctcG9pbnQgbnVtYmVyIHZhbHVlcyB0byB0aGUgZGVzY3JpcHRvci5cbiAgICAgICAgICAvLyBJZiB0aGUgcmVzdWx0IGlzIGxlc3MgdGhhbiB6ZXJvLCBsZXQgZXJyb3IgYmUgeWVzLiBPdGhlcndpc2UsIGxldCBkZW5zaXR5XG4gICAgICAgICAgLy8gYmUgdGhlIHJlc3VsdC5cbiAgICAgICAgICBpZiAoZmxvYXRWYWwgPCAwKSB7XG4gICAgICAgICAgICBwRXJyb3IgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkID0gZmxvYXRWYWw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSWYgdGhlIGRlc2NyaXB0b3IgY29uc2lzdHMgb2YgYSB2YWxpZCBub24tbmVnYXRpdmUgaW50ZWdlciBmb2xsb3dlZCBieVxuICAgICAgICAgIC8vIGEgVSswMDY4IExBVElOIFNNQUxMIExFVFRFUiBIIGNoYXJhY3RlclxuICAgICAgICB9IGVsc2UgaWYgKHJlZ2V4Tm9uTmVnYXRpdmVJbnRlZ2VyLnRlc3QodmFsdWUpICYmIChsYXN0Q2hhciA9PT0gXCJoXCIpKSB7XG5cbiAgICAgICAgICAvLyBJZiBoZWlnaHQgYW5kIGRlbnNpdHkgYXJlIG5vdCBib3RoIGFic2VudCwgdGhlbiBsZXQgZXJyb3IgYmUgeWVzLlxuICAgICAgICAgIGlmIChoIHx8IGQpIHtcbiAgICAgICAgICAgIHBFcnJvciA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQXBwbHkgdGhlIHJ1bGVzIGZvciBwYXJzaW5nIG5vbi1uZWdhdGl2ZSBpbnRlZ2VycyB0byB0aGUgZGVzY3JpcHRvci5cbiAgICAgICAgICAvLyBJZiB0aGUgcmVzdWx0IGlzIHplcm8sIGxldCBlcnJvciBiZSB5ZXMuIE90aGVyd2lzZSwgbGV0IGZ1dHVyZS1jb21wYXQtaFxuICAgICAgICAgIC8vIGJlIHRoZSByZXN1bHQuXG4gICAgICAgICAgaWYgKGludFZhbCA9PT0gMCkge1xuICAgICAgICAgICAgcEVycm9yID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaCA9IGludFZhbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBbnl0aGluZyBlbHNlLCBMZXQgZXJyb3IgYmUgeWVzLlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBFcnJvciA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gLy8gKGNsb3NlIHN0ZXAgMTMgZm9yIGxvb3ApXG5cbiAgICAgIC8vIDE1LiBJZiBlcnJvciBpcyBzdGlsbCBubywgdGhlbiBhcHBlbmQgYSBuZXcgaW1hZ2Ugc291cmNlIHRvIGNhbmRpZGF0ZXMgd2hvc2VcbiAgICAgIC8vIFVSTCBpcyB1cmwsIGFzc29jaWF0ZWQgd2l0aCBhIHdpZHRoIHdpZHRoIGlmIG5vdCBhYnNlbnQgYW5kIGEgcGl4ZWxcbiAgICAgIC8vIGRlbnNpdHkgZGVuc2l0eSBpZiBub3QgYWJzZW50LiBPdGhlcndpc2UsIHRoZXJlIGlzIGEgcGFyc2UgZXJyb3IuXG4gICAgICBpZiAoIXBFcnJvcikge1xuICAgICAgICBjYW5kaWRhdGUudXJsID0gdXJsO1xuXG4gICAgICAgIGlmICh3KSB7XG4gICAgICAgICAgY2FuZGlkYXRlLncgPSB3O1xuICAgICAgICB9XG4gICAgICAgIGlmIChkKSB7XG4gICAgICAgICAgY2FuZGlkYXRlLmQgPSBkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChoKSB7XG4gICAgICAgICAgY2FuZGlkYXRlLmggPSBoO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaCAmJiAhZCAmJiAhdykge1xuICAgICAgICAgIGNhbmRpZGF0ZS5kID0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2FuZGlkYXRlLmQgPT09IDEpIHtcbiAgICAgICAgICBzZXQuaGFzMXggPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNhbmRpZGF0ZS5zZXQgPSBzZXQ7XG5cbiAgICAgICAgY2FuZGlkYXRlcy5wdXNoKGNhbmRpZGF0ZSk7XG4gICAgICB9XG4gICAgfSAvLyAoY2xvc2UgcGFyc2VEZXNjcmlwdG9ycyBmbilcblxuICAgIC8qKlxuICAgICAqIFRva2VuaXplcyBkZXNjcmlwdG9yIHByb3BlcnRpZXMgcHJpb3IgdG8gcGFyc2luZ1xuICAgICAqIFJldHVybnMgdW5kZWZpbmVkLlxuICAgICAqIChBZ2FpbiwgdGhpcyBmbiBpcyBkZWZpbmVkIGJlZm9yZSBpdCBpcyB1c2VkLCBpbiBvcmRlciB0byBwYXNzIEpTSElOVC5cbiAgICAgKiBVbmZvcnR1bmF0ZWx5IHRoaXMgYnJlYWtzIHRoZSBsb2dpY2FsIHNlcXVlbmNpbmcgb2YgdGhlIHNwZWMgY29tbWVudHMuIDovIClcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0b2tlbml6ZSgpIHtcblxuICAgICAgLy8gOC4xLiBEZXNjcmlwdG9yIHRva2VuaXNlcjogU2tpcCB3aGl0ZXNwYWNlXG4gICAgICBjb2xsZWN0Q2hhcmFjdGVycyhyZWdleExlYWRpbmdTcGFjZXMpO1xuXG4gICAgICAvLyA4LjIuIExldCBjdXJyZW50IGRlc2NyaXB0b3IgYmUgdGhlIGVtcHR5IHN0cmluZy5cbiAgICAgIGN1cnJlbnREZXNjcmlwdG9yID0gXCJcIjtcblxuICAgICAgLy8gOC4zLiBMZXQgc3RhdGUgYmUgaW4gZGVzY3JpcHRvci5cbiAgICAgIHN0YXRlID0gXCJpbiBkZXNjcmlwdG9yXCI7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG5cbiAgICAgICAgLy8gOC40LiBMZXQgYyBiZSB0aGUgY2hhcmFjdGVyIGF0IHBvc2l0aW9uLlxuICAgICAgICBjID0gaW5wdXQuY2hhckF0KHBvcyk7XG5cbiAgICAgICAgLy8gIERvIHRoZSBmb2xsb3dpbmcgZGVwZW5kaW5nIG9uIHRoZSB2YWx1ZSBvZiBzdGF0ZS5cbiAgICAgICAgLy8gIEZvciB0aGUgcHVycG9zZSBvZiB0aGlzIHN0ZXAsIFwiRU9GXCIgaXMgYSBzcGVjaWFsIGNoYXJhY3RlciByZXByZXNlbnRpbmdcbiAgICAgICAgLy8gIHRoYXQgcG9zaXRpb24gaXMgcGFzdCB0aGUgZW5kIG9mIGlucHV0LlxuXG4gICAgICAgIC8vIEluIGRlc2NyaXB0b3JcbiAgICAgICAgaWYgKHN0YXRlID09PSBcImluIGRlc2NyaXB0b3JcIikge1xuICAgICAgICAgIC8vIERvIHRoZSBmb2xsb3dpbmcsIGRlcGVuZGluZyBvbiB0aGUgdmFsdWUgb2YgYzpcblxuICAgICAgICAgIC8vIFNwYWNlIGNoYXJhY3RlclxuICAgICAgICAgIC8vIElmIGN1cnJlbnQgZGVzY3JpcHRvciBpcyBub3QgZW1wdHksIGFwcGVuZCBjdXJyZW50IGRlc2NyaXB0b3IgdG9cbiAgICAgICAgICAvLyBkZXNjcmlwdG9ycyBhbmQgbGV0IGN1cnJlbnQgZGVzY3JpcHRvciBiZSB0aGUgZW1wdHkgc3RyaW5nLlxuICAgICAgICAgIC8vIFNldCBzdGF0ZSB0byBhZnRlciBkZXNjcmlwdG9yLlxuICAgICAgICAgIGlmIChpc1NwYWNlKGMpKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudERlc2NyaXB0b3IpIHtcbiAgICAgICAgICAgICAgZGVzY3JpcHRvcnMucHVzaChjdXJyZW50RGVzY3JpcHRvcik7XG4gICAgICAgICAgICAgIGN1cnJlbnREZXNjcmlwdG9yID0gXCJcIjtcbiAgICAgICAgICAgICAgc3RhdGUgPSBcImFmdGVyIGRlc2NyaXB0b3JcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVSswMDJDIENPTU1BICgsKVxuICAgICAgICAgICAgLy8gQWR2YW5jZSBwb3NpdGlvbiB0byB0aGUgbmV4dCBjaGFyYWN0ZXIgaW4gaW5wdXQuIElmIGN1cnJlbnQgZGVzY3JpcHRvclxuICAgICAgICAgICAgLy8gaXMgbm90IGVtcHR5LCBhcHBlbmQgY3VycmVudCBkZXNjcmlwdG9yIHRvIGRlc2NyaXB0b3JzLiBKdW1wIHRvIHRoZSBzdGVwXG4gICAgICAgICAgICAvLyBsYWJlbGVkIGRlc2NyaXB0b3IgcGFyc2VyLlxuICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gXCIsXCIpIHtcbiAgICAgICAgICAgIHBvcyArPSAxO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnREZXNjcmlwdG9yKSB7XG4gICAgICAgICAgICAgIGRlc2NyaXB0b3JzLnB1c2goY3VycmVudERlc2NyaXB0b3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFyc2VEZXNjcmlwdG9ycygpO1xuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAvLyBVKzAwMjggTEVGVCBQQVJFTlRIRVNJUyAoKClcbiAgICAgICAgICAgIC8vIEFwcGVuZCBjIHRvIGN1cnJlbnQgZGVzY3JpcHRvci4gU2V0IHN0YXRlIHRvIGluIHBhcmVucy5cbiAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09IFwiXFx1MDAyOFwiKSB7XG4gICAgICAgICAgICBjdXJyZW50RGVzY3JpcHRvciA9IGN1cnJlbnREZXNjcmlwdG9yICsgYztcbiAgICAgICAgICAgIHN0YXRlID0gXCJpbiBwYXJlbnNcIjtcblxuICAgICAgICAgICAgLy8gRU9GXG4gICAgICAgICAgICAvLyBJZiBjdXJyZW50IGRlc2NyaXB0b3IgaXMgbm90IGVtcHR5LCBhcHBlbmQgY3VycmVudCBkZXNjcmlwdG9yIHRvXG4gICAgICAgICAgICAvLyBkZXNjcmlwdG9ycy4gSnVtcCB0byB0aGUgc3RlcCBsYWJlbGVkIGRlc2NyaXB0b3IgcGFyc2VyLlxuICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gXCJcIikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnREZXNjcmlwdG9yKSB7XG4gICAgICAgICAgICAgIGRlc2NyaXB0b3JzLnB1c2goY3VycmVudERlc2NyaXB0b3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFyc2VEZXNjcmlwdG9ycygpO1xuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAvLyBBbnl0aGluZyBlbHNlXG4gICAgICAgICAgICAvLyBBcHBlbmQgYyB0byBjdXJyZW50IGRlc2NyaXB0b3IuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1cnJlbnREZXNjcmlwdG9yID0gY3VycmVudERlc2NyaXB0b3IgKyBjO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyAoZW5kIFwiaW4gZGVzY3JpcHRvclwiXG5cbiAgICAgICAgICAvLyBJbiBwYXJlbnNcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gXCJpbiBwYXJlbnNcIikge1xuXG4gICAgICAgICAgLy8gVSswMDI5IFJJR0hUIFBBUkVOVEhFU0lTICgpKVxuICAgICAgICAgIC8vIEFwcGVuZCBjIHRvIGN1cnJlbnQgZGVzY3JpcHRvci4gU2V0IHN0YXRlIHRvIGluIGRlc2NyaXB0b3IuXG4gICAgICAgICAgaWYgKGMgPT09IFwiKVwiKSB7XG4gICAgICAgICAgICBjdXJyZW50RGVzY3JpcHRvciA9IGN1cnJlbnREZXNjcmlwdG9yICsgYztcbiAgICAgICAgICAgIHN0YXRlID0gXCJpbiBkZXNjcmlwdG9yXCI7XG5cbiAgICAgICAgICAgIC8vIEVPRlxuICAgICAgICAgICAgLy8gQXBwZW5kIGN1cnJlbnQgZGVzY3JpcHRvciB0byBkZXNjcmlwdG9ycy4gSnVtcCB0byB0aGUgc3RlcCBsYWJlbGVkXG4gICAgICAgICAgICAvLyBkZXNjcmlwdG9yIHBhcnNlci5cbiAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09IFwiXCIpIHtcbiAgICAgICAgICAgIGRlc2NyaXB0b3JzLnB1c2goY3VycmVudERlc2NyaXB0b3IpO1xuICAgICAgICAgICAgcGFyc2VEZXNjcmlwdG9ycygpO1xuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAvLyBBbnl0aGluZyBlbHNlXG4gICAgICAgICAgICAvLyBBcHBlbmQgYyB0byBjdXJyZW50IGRlc2NyaXB0b3IuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1cnJlbnREZXNjcmlwdG9yID0gY3VycmVudERlc2NyaXB0b3IgKyBjO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEFmdGVyIGRlc2NyaXB0b3JcbiAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gXCJhZnRlciBkZXNjcmlwdG9yXCIpIHtcblxuICAgICAgICAgIC8vIERvIHRoZSBmb2xsb3dpbmcsIGRlcGVuZGluZyBvbiB0aGUgdmFsdWUgb2YgYzpcbiAgICAgICAgICAvLyBTcGFjZSBjaGFyYWN0ZXI6IFN0YXkgaW4gdGhpcyBzdGF0ZS5cbiAgICAgICAgICBpZiAoaXNTcGFjZShjKSkge1xuXG4gICAgICAgICAgICAvLyBFT0Y6IEp1bXAgdG8gdGhlIHN0ZXAgbGFiZWxlZCBkZXNjcmlwdG9yIHBhcnNlci5cbiAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09IFwiXCIpIHtcbiAgICAgICAgICAgIHBhcnNlRGVzY3JpcHRvcnMoKTtcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgLy8gQW55dGhpbmcgZWxzZVxuICAgICAgICAgICAgLy8gU2V0IHN0YXRlIHRvIGluIGRlc2NyaXB0b3IuIFNldCBwb3NpdGlvbiB0byB0aGUgcHJldmlvdXMgY2hhcmFjdGVyIGluIGlucHV0LlxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZSA9IFwiaW4gZGVzY3JpcHRvclwiO1xuICAgICAgICAgICAgcG9zIC09IDE7XG5cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZHZhbmNlIHBvc2l0aW9uIHRvIHRoZSBuZXh0IGNoYXJhY3RlciBpbiBpbnB1dC5cbiAgICAgICAgcG9zICs9IDE7XG5cbiAgICAgICAgLy8gUmVwZWF0IHRoaXMgc3RlcC5cbiAgICAgIH0gLy8gKGNsb3NlIHdoaWxlIHRydWUgbG9vcClcbiAgICB9XG5cbiAgICAvLyA0LiBTcGxpdHRpbmcgbG9vcDogQ29sbGVjdCBhIHNlcXVlbmNlIG9mIGNoYXJhY3RlcnMgdGhhdCBhcmUgc3BhY2VcbiAgICAvLyAgICBjaGFyYWN0ZXJzIG9yIFUrMDAyQyBDT01NQSBjaGFyYWN0ZXJzLiBJZiBhbnkgVSswMDJDIENPTU1BIGNoYXJhY3RlcnNcbiAgICAvLyAgICB3ZXJlIGNvbGxlY3RlZCwgdGhhdCBpcyBhIHBhcnNlIGVycm9yLlxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBjb2xsZWN0Q2hhcmFjdGVycyhyZWdleExlYWRpbmdDb21tYXNPclNwYWNlcyk7XG5cbiAgICAgIC8vIDUuIElmIHBvc2l0aW9uIGlzIHBhc3QgdGhlIGVuZCBvZiBpbnB1dCwgcmV0dXJuIGNhbmRpZGF0ZXMgYW5kIGFib3J0IHRoZXNlIHN0ZXBzLlxuICAgICAgaWYgKHBvcyA+PSBpbnB1dExlbmd0aCkge1xuICAgICAgICByZXR1cm4gY2FuZGlkYXRlczsgLy8gKHdlJ3JlIGRvbmUsIHRoaXMgaXMgdGhlIHNvbGUgcmV0dXJuIHBhdGgpXG4gICAgICB9XG5cbiAgICAgIC8vIDYuIENvbGxlY3QgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIHRoYXQgYXJlIG5vdCBzcGFjZSBjaGFyYWN0ZXJzLFxuICAgICAgLy8gICAgYW5kIGxldCB0aGF0IGJlIHVybC5cbiAgICAgIHVybCA9IGNvbGxlY3RDaGFyYWN0ZXJzKHJlZ2V4TGVhZGluZ05vdFNwYWNlcyk7XG5cbiAgICAgIC8vIDcuIExldCBkZXNjcmlwdG9ycyBiZSBhIG5ldyBlbXB0eSBsaXN0LlxuICAgICAgZGVzY3JpcHRvcnMgPSBbXTtcblxuICAgICAgLy8gOC4gSWYgdXJsIGVuZHMgd2l0aCBhIFUrMDAyQyBDT01NQSBjaGFyYWN0ZXIgKCwpLCBmb2xsb3cgdGhlc2Ugc3Vic3RlcHM6XG4gICAgICAvL1x0XHQoMSkuIFJlbW92ZSBhbGwgdHJhaWxpbmcgVSswMDJDIENPTU1BIGNoYXJhY3RlcnMgZnJvbSB1cmwuIElmIHRoaXMgcmVtb3ZlZFxuICAgICAgLy8gICAgICAgICBtb3JlIHRoYW4gb25lIGNoYXJhY3RlciwgdGhhdCBpcyBhIHBhcnNlIGVycm9yLlxuICAgICAgaWYgKHVybC5zbGljZSgtMSkgPT09IFwiLFwiKSB7XG4gICAgICAgIHVybCA9IHVybC5yZXBsYWNlKHJlZ2V4VHJhaWxpbmdDb21tYXMsIFwiXCIpO1xuICAgICAgICAvLyAoSnVtcCBhaGVhZCB0byBzdGVwIDkgdG8gc2tpcCB0b2tlbml6YXRpb24gYW5kIGp1c3QgcHVzaCB0aGUgY2FuZGlkYXRlKS5cbiAgICAgICAgcGFyc2VEZXNjcmlwdG9ycygpO1xuXG4gICAgICAgIC8vXHRPdGhlcndpc2UsIGZvbGxvdyB0aGVzZSBzdWJzdGVwczpcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRva2VuaXplKCk7XG4gICAgICB9IC8vIChjbG9zZSBlbHNlIG9mIHN0ZXAgOClcblxuICAgICAgLy8gMTYuIFJldHVybiB0byB0aGUgc3RlcCBsYWJlbGVkIHNwbGl0dGluZyBsb29wLlxuICAgIH0gLy8gKENsb3NlIG9mIGJpZyB3aGlsZSBsb29wLilcbiAgfVxuXG4gIC8qXG4gICAqIFNpemVzIFBhcnNlclxuICAgKlxuICAgKiBCeSBBbGV4IEJlbGwgfCAgTUlUIExpY2Vuc2VcbiAgICpcbiAgICogTm9uLXN0cmljdCBidXQgYWNjdXJhdGUgYW5kIGxpZ2h0d2VpZ2h0IEpTIFBhcnNlciBmb3IgdGhlIHN0cmluZyB2YWx1ZSA8aW1nIHNpemVzPVwiaGVyZVwiPlxuICAgKlxuICAgKiBSZWZlcmVuY2UgYWxnb3JpdGhtIGF0OlxuICAgKiBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9lbWJlZGRlZC1jb250ZW50Lmh0bWwjcGFyc2UtYS1zaXplcy1hdHRyaWJ1dGVcbiAgICpcbiAgICogTW9zdCBjb21tZW50cyBhcmUgY29waWVkIGluIGRpcmVjdGx5IGZyb20gdGhlIHNwZWNcbiAgICogKGV4Y2VwdCBmb3IgY29tbWVudHMgaW4gcGFyZW5zKS5cbiAgICpcbiAgICogR3JhbW1hciBpczpcbiAgICogPHNvdXJjZS1zaXplLWxpc3Q+ID0gPHNvdXJjZS1zaXplPiMgWyAsIDxzb3VyY2Utc2l6ZS12YWx1ZT4gXT8gfCA8c291cmNlLXNpemUtdmFsdWU+XG4gICAqIDxzb3VyY2Utc2l6ZT4gPSA8bWVkaWEtY29uZGl0aW9uPiA8c291cmNlLXNpemUtdmFsdWU+XG4gICAqIDxzb3VyY2Utc2l6ZS12YWx1ZT4gPSA8bGVuZ3RoPlxuICAgKiBodHRwOi8vd3d3LnczLm9yZy9odG1sL3dnL2RyYWZ0cy9odG1sL21hc3Rlci9lbWJlZGRlZC1jb250ZW50Lmh0bWwjYXR0ci1pbWctc2l6ZXNcbiAgICpcbiAgICogRS5nLiBcIihtYXgtd2lkdGg6IDMwZW0pIDEwMHZ3LCAobWF4LXdpZHRoOiA1MGVtKSA3MHZ3LCAxMDB2d1wiXG4gICAqIG9yIFwiKG1pbi13aWR0aDogMzBlbSksIGNhbGMoMzB2dyAtIDE1cHgpXCIgb3IganVzdCBcIjMwdndcIlxuICAgKlxuICAgKiBSZXR1cm5zIHRoZSBmaXJzdCB2YWxpZCA8Y3NzLWxlbmd0aD4gd2l0aCBhIG1lZGlhIGNvbmRpdGlvbiB0aGF0IGV2YWx1YXRlcyB0byB0cnVlLFxuICAgKiBvciBcIjEwMHZ3XCIgaWYgYWxsIHZhbGlkIG1lZGlhIGNvbmRpdGlvbnMgZXZhbHVhdGUgdG8gZmFsc2UuXG4gICAqXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHBhcnNlU2l6ZXMoc3RyVmFsdWUpIHtcblxuICAgIC8vIChQZXJjZW50YWdlIENTUyBsZW5ndGhzIGFyZSBub3QgYWxsb3dlZCBpbiB0aGlzIGNhc2UsIHRvIGF2b2lkIGNvbmZ1c2lvbjpcbiAgICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9lbWJlZGRlZC1jb250ZW50Lmh0bWwjdmFsaWQtc291cmNlLXNpemUtbGlzdFxuICAgIC8vIENTUyBhbGxvd3MgYSBzaW5nbGUgb3B0aW9uYWwgcGx1cyBvciBtaW51cyBzaWduOlxuICAgIC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL0NTUzIvc3luZGF0YS5odG1sI251bWJlcnNcbiAgICAvLyBDU1MgaXMgQVNDSUkgY2FzZS1pbnNlbnNpdGl2ZTpcbiAgICAvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9DU1MyL3N5bmRhdGEuaHRtbCNjaGFyYWN0ZXJzIClcbiAgICAvLyBTcGVjIGFsbG93cyBleHBvbmVudGlhbCBub3RhdGlvbiBmb3IgPG51bWJlcj4gdHlwZTpcbiAgICAvLyBodHRwOi8vZGV2LnczLm9yZy9jc3N3Zy9jc3MtdmFsdWVzLyNudW1iZXJzXG4gICAgdmFyIHJlZ2V4Q3NzTGVuZ3RoV2l0aFVuaXRzID0gL14oPzpbKy1dP1swLTldK3xbMC05XSpcXC5bMC05XSspKD86W2VFXVsrLV0/WzAtOV0rKT8oPzpjaHxjbXxlbXxleHxpbnxtbXxwY3xwdHxweHxyZW18dmh8dm1pbnx2bWF4fHZ3KSQvaTtcblxuICAgIC8vIChUaGlzIGlzIGEgcXVpY2sgYW5kIGxlbmllbnQgdGVzdC4gQmVjYXVzZSBvZiBvcHRpb25hbCB1bmxpbWl0ZWQtZGVwdGggaW50ZXJuYWxcbiAgICAvLyBncm91cGluZyBwYXJlbnMgYW5kIHN0cmljdCBzcGFjaW5nIHJ1bGVzLCB0aGlzIGNvdWxkIGdldCB2ZXJ5IGNvbXBsaWNhdGVkLilcbiAgICB2YXIgcmVnZXhDc3NDYWxjID0gL15jYWxjXFwoKD86WzAtOWEteiBcXC5cXCtcXC1cXCpcXC9cXChcXCldKylcXCkkL2k7XG5cbiAgICB2YXIgaTtcbiAgICB2YXIgdW5wYXJzZWRTaXplc0xpc3Q7XG4gICAgdmFyIHVucGFyc2VkU2l6ZXNMaXN0TGVuZ3RoO1xuICAgIHZhciB1bnBhcnNlZFNpemU7XG4gICAgdmFyIGxhc3RDb21wb25lbnRWYWx1ZTtcbiAgICB2YXIgc2l6ZTtcblxuICAgIC8vIFVUSUxJVFkgRlVOQ1RJT05TXG5cbiAgICAvLyAgKFRveSBDU1MgcGFyc2VyLiBUaGUgZ29hbHMgaGVyZSBhcmU6XG4gICAgLy8gIDEpIGV4cGFuc2l2ZSB0ZXN0IGNvdmVyYWdlIHdpdGhvdXQgdGhlIHdlaWdodCBvZiBhIGZ1bGwgQ1NTIHBhcnNlci5cbiAgICAvLyAgMikgQXZvaWRpbmcgcmVnZXggd2hlcmV2ZXIgY29udmVuaWVudC5cbiAgICAvLyAgUXVpY2sgdGVzdHM6IGh0dHA6Ly9qc2ZpZGRsZS5uZXQvZ3RudEw0Z3IvMy9cbiAgICAvLyAgUmV0dXJucyBhbiBhcnJheSBvZiBhcnJheXMuKVxuICAgIGZ1bmN0aW9uIHBhcnNlQ29tcG9uZW50VmFsdWVzKHN0cikge1xuICAgICAgdmFyIGNocmN0cjtcbiAgICAgIHZhciBjb21wb25lbnQgPSBcIlwiO1xuICAgICAgdmFyIGNvbXBvbmVudEFycmF5ID0gW107XG4gICAgICB2YXIgbGlzdEFycmF5ID0gW107XG4gICAgICB2YXIgcGFyZW5EZXB0aCA9IDA7XG4gICAgICB2YXIgcG9zID0gMDtcbiAgICAgIHZhciBpbkNvbW1lbnQgPSBmYWxzZTtcblxuICAgICAgZnVuY3Rpb24gcHVzaENvbXBvbmVudCgpIHtcbiAgICAgICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgICAgIGNvbXBvbmVudEFycmF5LnB1c2goY29tcG9uZW50KTtcbiAgICAgICAgICBjb21wb25lbnQgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHB1c2hDb21wb25lbnRBcnJheSgpIHtcbiAgICAgICAgaWYgKGNvbXBvbmVudEFycmF5WzBdKSB7XG4gICAgICAgICAgbGlzdEFycmF5LnB1c2goY29tcG9uZW50QXJyYXkpO1xuICAgICAgICAgIGNvbXBvbmVudEFycmF5ID0gW107XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gKExvb3AgZm9yd2FyZHMgZnJvbSB0aGUgYmVnaW5uaW5nIG9mIHRoZSBzdHJpbmcuKVxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgY2hyY3RyID0gc3RyLmNoYXJBdChwb3MpO1xuXG4gICAgICAgIGlmIChjaHJjdHIgPT09IFwiXCIpIHsgLy8gKCBFbmQgb2Ygc3RyaW5nIHJlYWNoZWQuKVxuICAgICAgICAgIHB1c2hDb21wb25lbnQoKTtcbiAgICAgICAgICBwdXNoQ29tcG9uZW50QXJyYXkoKTtcbiAgICAgICAgICByZXR1cm4gbGlzdEFycmF5O1xuICAgICAgICB9IGVsc2UgaWYgKGluQ29tbWVudCkge1xuICAgICAgICAgIGlmICgoY2hyY3RyID09PSBcIipcIikgJiYgKHN0cltwb3MgKyAxXSA9PT0gXCIvXCIpKSB7IC8vIChBdCBlbmQgb2YgYSBjb21tZW50LilcbiAgICAgICAgICAgIGluQ29tbWVudCA9IGZhbHNlO1xuICAgICAgICAgICAgcG9zICs9IDI7XG4gICAgICAgICAgICBwdXNoQ29tcG9uZW50KCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcG9zICs9IDE7IC8vIChTa2lwIGFsbCBjaGFyYWN0ZXJzIGluc2lkZSBjb21tZW50cy4pXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaXNTcGFjZShjaHJjdHIpKSB7XG4gICAgICAgICAgLy8gKElmIHByZXZpb3VzIGNoYXJhY3RlciBpbiBsb29wIHdhcyBhbHNvIGEgc3BhY2UsIG9yIGlmXG4gICAgICAgICAgLy8gYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgc3RyaW5nLCBkbyBub3QgYWRkIHNwYWNlIGNoYXIgdG9cbiAgICAgICAgICAvLyBjb21wb25lbnQuKVxuICAgICAgICAgIGlmICgoc3RyLmNoYXJBdChwb3MgLSAxKSAmJiBpc1NwYWNlKHN0ci5jaGFyQXQocG9zIC0gMSkpKSB8fCAhY29tcG9uZW50KSB7XG4gICAgICAgICAgICBwb3MgKz0gMTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH0gZWxzZSBpZiAocGFyZW5EZXB0aCA9PT0gMCkge1xuICAgICAgICAgICAgcHVzaENvbXBvbmVudCgpO1xuICAgICAgICAgICAgcG9zICs9IDE7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gKFJlcGxhY2UgYW55IHNwYWNlIGNoYXJhY3RlciB3aXRoIGEgcGxhaW4gc3BhY2UgZm9yIGxlZ2liaWxpdHkuKVxuICAgICAgICAgICAgY2hyY3RyID0gXCIgXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGNocmN0ciA9PT0gXCIoXCIpIHtcbiAgICAgICAgICBwYXJlbkRlcHRoICs9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hyY3RyID09PSBcIilcIikge1xuICAgICAgICAgIHBhcmVuRGVwdGggLT0gMTtcbiAgICAgICAgfSBlbHNlIGlmIChjaHJjdHIgPT09IFwiLFwiKSB7XG4gICAgICAgICAgcHVzaENvbXBvbmVudCgpO1xuICAgICAgICAgIHB1c2hDb21wb25lbnRBcnJheSgpO1xuICAgICAgICAgIHBvcyArPSAxO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IGVsc2UgaWYgKChjaHJjdHIgPT09IFwiL1wiKSAmJiAoc3RyLmNoYXJBdChwb3MgKyAxKSA9PT0gXCIqXCIpKSB7XG4gICAgICAgICAgaW5Db21tZW50ID0gdHJ1ZTtcbiAgICAgICAgICBwb3MgKz0gMjtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbXBvbmVudCA9IGNvbXBvbmVudCArIGNocmN0cjtcbiAgICAgICAgcG9zICs9IDE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNWYWxpZE5vbk5lZ2F0aXZlU291cmNlU2l6ZVZhbHVlKHMpIHtcbiAgICAgIGlmIChyZWdleENzc0xlbmd0aFdpdGhVbml0cy50ZXN0KHMpICYmIChwYXJzZUZsb2F0KHMpID49IDApKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKHJlZ2V4Q3NzQ2FsYy50ZXN0KHMpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgLy8gKCBodHRwOi8vd3d3LnczLm9yZy9UUi9DU1MyL3N5bmRhdGEuaHRtbCNudW1iZXJzIHNheXM6XG4gICAgICAvLyBcIi0wIGlzIGVxdWl2YWxlbnQgdG8gMCBhbmQgaXMgbm90IGEgbmVnYXRpdmUgbnVtYmVyLlwiIHdoaWNoIG1lYW5zIHRoYXRcbiAgICAgIC8vIHVuaXRsZXNzIHplcm8gYW5kIHVuaXRsZXNzIG5lZ2F0aXZlIHplcm8gbXVzdCBiZSBhY2NlcHRlZCBhcyBzcGVjaWFsIGNhc2VzLilcbiAgICAgIGlmICgocyA9PT0gXCIwXCIpIHx8IChzID09PSBcIi0wXCIpIHx8IChzID09PSBcIiswXCIpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFdoZW4gYXNrZWQgdG8gcGFyc2UgYSBzaXplcyBhdHRyaWJ1dGUgZnJvbSBhbiBlbGVtZW50LCBwYXJzZSBhXG4gICAgLy8gY29tbWEtc2VwYXJhdGVkIGxpc3Qgb2YgY29tcG9uZW50IHZhbHVlcyBmcm9tIHRoZSB2YWx1ZSBvZiB0aGUgZWxlbWVudCdzXG4gICAgLy8gc2l6ZXMgYXR0cmlidXRlIChvciB0aGUgZW1wdHkgc3RyaW5nLCBpZiB0aGUgYXR0cmlidXRlIGlzIGFic2VudCksIGFuZCBsZXRcbiAgICAvLyB1bnBhcnNlZCBzaXplcyBsaXN0IGJlIHRoZSByZXN1bHQuXG4gICAgLy8gaHR0cDovL2Rldi53My5vcmcvY3Nzd2cvY3NzLXN5bnRheC8jcGFyc2UtY29tbWEtc2VwYXJhdGVkLWxpc3Qtb2YtY29tcG9uZW50LXZhbHVlc1xuXG4gICAgdW5wYXJzZWRTaXplc0xpc3QgPSBwYXJzZUNvbXBvbmVudFZhbHVlcyhzdHJWYWx1ZSk7XG4gICAgdW5wYXJzZWRTaXplc0xpc3RMZW5ndGggPSB1bnBhcnNlZFNpemVzTGlzdC5sZW5ndGg7XG5cbiAgICAvLyBGb3IgZWFjaCB1bnBhcnNlZCBzaXplIGluIHVucGFyc2VkIHNpemVzIGxpc3Q6XG4gICAgZm9yIChpID0gMDsgaSA8IHVucGFyc2VkU2l6ZXNMaXN0TGVuZ3RoOyBpKyspIHtcbiAgICAgIHVucGFyc2VkU2l6ZSA9IHVucGFyc2VkU2l6ZXNMaXN0W2ldO1xuXG4gICAgICAvLyAxLiBSZW1vdmUgYWxsIGNvbnNlY3V0aXZlIDx3aGl0ZXNwYWNlLXRva2VuPnMgZnJvbSB0aGUgZW5kIG9mIHVucGFyc2VkIHNpemUuXG4gICAgICAvLyAoIHBhcnNlQ29tcG9uZW50VmFsdWVzKCkgYWxyZWFkeSBvbWl0cyBzcGFjZXMgb3V0c2lkZSBvZiBwYXJlbnMuIClcblxuICAgICAgLy8gSWYgdW5wYXJzZWQgc2l6ZSBpcyBub3cgZW1wdHksIHRoYXQgaXMgYSBwYXJzZSBlcnJvcjsgY29udGludWUgdG8gdGhlIG5leHRcbiAgICAgIC8vIGl0ZXJhdGlvbiBvZiB0aGlzIGFsZ29yaXRobS5cbiAgICAgIC8vICggcGFyc2VDb21wb25lbnRWYWx1ZXMoKSB3b24ndCBwdXNoIGFuIGVtcHR5IGFycmF5LiApXG5cbiAgICAgIC8vIDIuIElmIHRoZSBsYXN0IGNvbXBvbmVudCB2YWx1ZSBpbiB1bnBhcnNlZCBzaXplIGlzIGEgdmFsaWQgbm9uLW5lZ2F0aXZlXG4gICAgICAvLyA8c291cmNlLXNpemUtdmFsdWU+LCBsZXQgc2l6ZSBiZSBpdHMgdmFsdWUgYW5kIHJlbW92ZSB0aGUgY29tcG9uZW50IHZhbHVlXG4gICAgICAvLyBmcm9tIHVucGFyc2VkIHNpemUuIEFueSBDU1MgZnVuY3Rpb24gb3RoZXIgdGhhbiB0aGUgY2FsYygpIGZ1bmN0aW9uIGlzXG4gICAgICAvLyBpbnZhbGlkLiBPdGhlcndpc2UsIHRoZXJlIGlzIGEgcGFyc2UgZXJyb3I7IGNvbnRpbnVlIHRvIHRoZSBuZXh0IGl0ZXJhdGlvblxuICAgICAgLy8gb2YgdGhpcyBhbGdvcml0aG0uXG4gICAgICAvLyBodHRwOi8vZGV2LnczLm9yZy9jc3N3Zy9jc3Mtc3ludGF4LyNwYXJzZS1jb21wb25lbnQtdmFsdWVcbiAgICAgIGxhc3RDb21wb25lbnRWYWx1ZSA9IHVucGFyc2VkU2l6ZVt1bnBhcnNlZFNpemUubGVuZ3RoIC0gMV07XG5cbiAgICAgIGlmIChpc1ZhbGlkTm9uTmVnYXRpdmVTb3VyY2VTaXplVmFsdWUobGFzdENvbXBvbmVudFZhbHVlKSkge1xuICAgICAgICBzaXplID0gbGFzdENvbXBvbmVudFZhbHVlO1xuICAgICAgICB1bnBhcnNlZFNpemUucG9wKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gMy4gUmVtb3ZlIGFsbCBjb25zZWN1dGl2ZSA8d2hpdGVzcGFjZS10b2tlbj5zIGZyb20gdGhlIGVuZCBvZiB1bnBhcnNlZFxuICAgICAgLy8gc2l6ZS4gSWYgdW5wYXJzZWQgc2l6ZSBpcyBub3cgZW1wdHksIHJldHVybiBzaXplIGFuZCBleGl0IHRoaXMgYWxnb3JpdGhtLlxuICAgICAgLy8gSWYgdGhpcyB3YXMgbm90IHRoZSBsYXN0IGl0ZW0gaW4gdW5wYXJzZWQgc2l6ZXMgbGlzdCwgdGhhdCBpcyBhIHBhcnNlIGVycm9yLlxuICAgICAgaWYgKHVucGFyc2VkU2l6ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHNpemU7XG4gICAgICB9XG5cbiAgICAgIC8vIDQuIFBhcnNlIHRoZSByZW1haW5pbmcgY29tcG9uZW50IHZhbHVlcyBpbiB1bnBhcnNlZCBzaXplIGFzIGFcbiAgICAgIC8vIDxtZWRpYS1jb25kaXRpb24+LiBJZiBpdCBkb2VzIG5vdCBwYXJzZSBjb3JyZWN0bHksIG9yIGl0IGRvZXMgcGFyc2VcbiAgICAgIC8vIGNvcnJlY3RseSBidXQgdGhlIDxtZWRpYS1jb25kaXRpb24+IGV2YWx1YXRlcyB0byBmYWxzZSwgY29udGludWUgdG8gdGhlXG4gICAgICAvLyBuZXh0IGl0ZXJhdGlvbiBvZiB0aGlzIGFsZ29yaXRobS5cbiAgICAgIC8vIChQYXJzaW5nIGFsbCBwb3NzaWJsZSBjb21wb3VuZCBtZWRpYSBjb25kaXRpb25zIGluIEpTIGlzIGhlYXZ5LCBjb21wbGljYXRlZCxcbiAgICAgIC8vIGFuZCB0aGUgcGF5b2ZmIGlzIHVuY2xlYXIuIElzIHRoZXJlIGV2ZXIgYW4gc2l0dWF0aW9uIHdoZXJlIHRoZVxuICAgICAgLy8gbWVkaWEgY29uZGl0aW9uIHBhcnNlcyBpbmNvcnJlY3RseSBidXQgc3RpbGwgc29tZWhvdyBldmFsdWF0ZXMgdG8gdHJ1ZT9cbiAgICAgIC8vIENhbiB3ZSBqdXN0IHJlbHkgb24gdGhlIGJyb3dzZXIvcG9seWZpbGwgdG8gZG8gaXQ/KVxuICAgICAgdW5wYXJzZWRTaXplID0gdW5wYXJzZWRTaXplLmpvaW4oXCIgXCIpO1xuICAgICAgaWYgKCEocGYubWF0Y2hlc01lZGlhKHVucGFyc2VkU2l6ZSkpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyA1LiBSZXR1cm4gc2l6ZSBhbmQgZXhpdCB0aGlzIGFsZ29yaXRobS5cbiAgICAgIHJldHVybiBzaXplO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBhYm92ZSBhbGdvcml0aG0gZXhoYXVzdHMgdW5wYXJzZWQgc2l6ZXMgbGlzdCB3aXRob3V0IHJldHVybmluZyBhXG4gICAgLy8gc2l6ZSB2YWx1ZSwgcmV0dXJuIDEwMHZ3LlxuICAgIHJldHVybiBcIjEwMHZ3XCI7XG4gIH1cblxuICAvLyBuYW1lc3BhY2VcbiAgcGYubnMgPSAoXCJwZlwiICsgbmV3IERhdGUoKS5nZXRUaW1lKCkpLnN1YnN0cigwLCA5KTtcblxuICAvLyBzcmNzZXQgc3VwcG9ydCB0ZXN0XG4gIHBmLnN1cFNyY3NldCA9IFwic3Jjc2V0XCIgaW4gaW1hZ2U7XG4gIHBmLnN1cFNpemVzID0gXCJzaXplc1wiIGluIGltYWdlO1xuICBwZi5zdXBQaWN0dXJlID0gISF3aW5kb3cuSFRNTFBpY3R1cmVFbGVtZW50O1xuXG4gIC8vIFVDIGJyb3dzZXIgZG9lcyBjbGFpbSB0byBzdXBwb3J0IHNyY3NldCBhbmQgcGljdHVyZSwgYnV0IG5vdCBzaXplcyxcbiAgLy8gdGhpcyBleHRlbmRlZCB0ZXN0IHJldmVhbHMgdGhlIGJyb3dzZXIgZG9lcyBzdXBwb3J0IG5vdGhpbmdcbiAgaWYgKHBmLnN1cFNyY3NldCAmJiBwZi5zdXBQaWN0dXJlICYmICFwZi5zdXBTaXplcykge1xuICAgIChmdW5jdGlvbiAoaW1hZ2UyKSB7XG4gICAgICBpbWFnZS5zcmNzZXQgPSBcImRhdGE6LGFcIjtcbiAgICAgIGltYWdlMi5zcmMgPSBcImRhdGE6LGFcIjtcbiAgICAgIHBmLnN1cFNyY3NldCA9IGltYWdlLmNvbXBsZXRlID09PSBpbWFnZTIuY29tcGxldGU7XG4gICAgICBwZi5zdXBQaWN0dXJlID0gcGYuc3VwU3Jjc2V0ICYmIHBmLnN1cFBpY3R1cmU7XG4gICAgfSkoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKSk7XG4gIH1cblxuICAvLyBTYWZhcmk5IGhhcyBiYXNpYyBzdXBwb3J0IGZvciBzaXplcywgYnV0IGRvZXMndCBleHBvc2UgdGhlIGBzaXplc2AgaWRsIGF0dHJpYnV0ZVxuICBpZiAocGYuc3VwU3Jjc2V0ICYmICFwZi5zdXBTaXplcykge1xuXG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB3aWR0aDIgPSBcImRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFnQUJBUEFBQVAvLy93QUFBQ0g1QkFBQUFBQUFMQUFBQUFBQ0FBRUFBQUlDQkFvQU93PT1cIjtcbiAgICAgIHZhciB3aWR0aDEgPSBcImRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFRQUJBQUFBQUNINUJBRUtBQUVBTEFBQUFBQUJBQUVBQUFJQ1RBRUFPdz09XCI7XG4gICAgICB2YXIgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgIHZhciB0ZXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgd2lkdGggPSBpbWcud2lkdGg7XG5cbiAgICAgICAgaWYgKHdpZHRoID09PSAyKSB7XG4gICAgICAgICAgcGYuc3VwU2l6ZXMgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgYWx3YXlzQ2hlY2tXRGVzY3JpcHRvciA9IHBmLnN1cFNyY3NldCAmJiAhcGYuc3VwU2l6ZXM7XG5cbiAgICAgICAgaXNTdXBwb3J0VGVzdFJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgLy8gZm9yY2UgYXN5bmNcbiAgICAgICAgc2V0VGltZW91dChwaWN0dXJlZmlsbCk7XG4gICAgICB9O1xuXG4gICAgICBpbWcub25sb2FkID0gdGVzdDtcbiAgICAgIGltZy5vbmVycm9yID0gdGVzdDtcbiAgICAgIGltZy5zZXRBdHRyaWJ1dGUoXCJzaXplc1wiLCBcIjlweFwiKTtcblxuICAgICAgaW1nLnNyY3NldCA9IHdpZHRoMSArIFwiIDF3LFwiICsgd2lkdGgyICsgXCIgOXdcIjtcbiAgICAgIGltZy5zcmMgPSB3aWR0aDE7XG4gICAgfSkoKTtcblxuICB9IGVsc2Uge1xuICAgIGlzU3VwcG9ydFRlc3RSZWFkeSA9IHRydWU7XG4gIH1cblxuICAvLyB1c2luZyBwZi5xc2EgaW5zdGVhZCBvZiBkb20gdHJhdmVyc2luZyBkb2VzIHNjYWxlIG11Y2ggYmV0dGVyLFxuICAvLyBlc3BlY2lhbGx5IG9uIHNpdGVzIG1peGluZyByZXNwb25zaXZlIGFuZCBub24tcmVzcG9uc2l2ZSBpbWFnZXNcbiAgcGYuc2VsU2hvcnQgPSBcInBpY3R1cmU+aW1nLGltZ1tzcmNzZXRdXCI7XG4gIHBmLnNlbCA9IHBmLnNlbFNob3J0O1xuICBwZi5jZmcgPSBjZmc7XG5cbiAgLyoqXG4gICAqIFNob3J0Y3V0IHByb3BlcnR5IGZvciBgZGV2aWNlUGl4ZWxSYXRpb2AgKCBmb3IgZWFzeSBvdmVycmlkaW5nIGluIHRlc3RzIClcbiAgICovXG4gIHBmLkRQUiA9IChEUFIgfHwgMSk7XG4gIHBmLnUgPSB1bml0cztcblxuICAvLyBjb250YWluZXIgb2Ygc3VwcG9ydGVkIG1pbWUgdHlwZXMgdGhhdCBvbmUgbWlnaHQgbmVlZCB0byBxdWFsaWZ5IGJlZm9yZSB1c2luZ1xuICBwZi50eXBlcyA9IHR5cGVzO1xuXG4gIHBmLnNldFNpemUgPSBub29wO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgc3RyaW5nIGFuZCByZXR1cm5zIHRoZSBhYnNvbHV0ZSBVUkxcbiAgICogQHBhcmFtIHNyY1xuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBhYnNvbHV0ZSBVUkxcbiAgICovXG5cbiAgcGYubWFrZVVybCA9IG1lbW9pemUoZnVuY3Rpb24gKHNyYykge1xuICAgIGFuY2hvci5ocmVmID0gc3JjO1xuICAgIHJldHVybiBhbmNob3IuaHJlZjtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBET00gZWxlbWVudCBvciBkb2N1bWVudCBhbmQgYSBzZWxjdG9yIGFuZCByZXR1cm5zIHRoZSBmb3VuZCBtYXRjaGVzXG4gICAqIENhbiBiZSBleHRlbmRlZCB3aXRoIGpRdWVyeS9TaXp6bGUgZm9yIElFNyBzdXBwb3J0XG4gICAqIEBwYXJhbSBjb250ZXh0XG4gICAqIEBwYXJhbSBzZWxcbiAgICogQHJldHVybnMge05vZGVMaXN0fEFycmF5fVxuICAgKi9cbiAgcGYucXNhID0gZnVuY3Rpb24gKGNvbnRleHQsIHNlbCkge1xuICAgIHJldHVybiAoXCJxdWVyeVNlbGVjdG9yXCIgaW4gY29udGV4dCkgPyBjb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKSA6IFtdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTaG9ydGN1dCBtZXRob2QgZm9yIG1hdGNoTWVkaWEgKCBmb3IgZWFzeSBvdmVycmlkaW5nIGluIHRlc3RzIClcbiAgICogd2V0aGVyIG5hdGl2ZSBvciBwZi5tTVEgaXMgdXNlZCB3aWxsIGJlIGRlY2lkZWQgbGF6eSBvbiBmaXJzdCBjYWxsXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgcGYubWF0Y2hlc01lZGlhID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh3aW5kb3cubWF0Y2hNZWRpYSAmJiAobWF0Y2hNZWRpYShcIihtaW4td2lkdGg6IDAuMWVtKVwiKSB8fCB7fSkubWF0Y2hlcykge1xuICAgICAgcGYubWF0Y2hlc01lZGlhID0gZnVuY3Rpb24gKG1lZGlhKSB7XG4gICAgICAgIHJldHVybiAhbWVkaWEgfHwgKG1hdGNoTWVkaWEobWVkaWEpLm1hdGNoZXMpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGYubWF0Y2hlc01lZGlhID0gcGYubU1RO1xuICAgIH1cblxuICAgIHJldHVybiBwZi5tYXRjaGVzTWVkaWEuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcblxuICAvKipcbiAgICogQSBzaW1wbGlmaWVkIG1hdGNoTWVkaWEgaW1wbGVtZW50YXRpb24gZm9yIElFOCBhbmQgSUU5XG4gICAqIGhhbmRsZXMgb25seSBtaW4td2lkdGgvbWF4LXdpZHRoIHdpdGggcHggb3IgZW0gdmFsdWVzXG4gICAqIEBwYXJhbSBtZWRpYVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIHBmLm1NUSA9IGZ1bmN0aW9uIChtZWRpYSkge1xuICAgIHJldHVybiBtZWRpYSA/IGV2YWxDU1MobWVkaWEpIDogdHJ1ZTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY2FsY3VsYXRlZCBsZW5ndGggaW4gY3NzIHBpeGVsIGZyb20gdGhlIGdpdmVuIHNvdXJjZVNpemVWYWx1ZVxuICAgKiBodHRwOi8vZGV2LnczLm9yZy9jc3N3Zy9jc3MtdmFsdWVzLTMvI2xlbmd0aC12YWx1ZVxuICAgKiBpbnRlbmRlZCBTcGVjIG1pc21hdGNoZXM6XG4gICAqICogRG9lcyBub3QgY2hlY2sgZm9yIGludmFsaWQgdXNlIG9mIENTUyBmdW5jdGlvbnNcbiAgICogKiBEb2VzIGhhbmRsZSBhIGNvbXB1dGVkIGxlbmd0aCBvZiAwIHRoZSBzYW1lIGFzIGEgbmVnYXRpdmUgYW5kIHRoZXJlZm9yZSBpbnZhbGlkIHZhbHVlXG4gICAqIEBwYXJhbSBzb3VyY2VTaXplVmFsdWVcbiAgICogQHJldHVybnMge051bWJlcn1cbiAgICovXG4gIHBmLmNhbGNMZW5ndGggPSBmdW5jdGlvbiAoc291cmNlU2l6ZVZhbHVlKSB7XG5cbiAgICB2YXIgdmFsdWUgPSBldmFsQ1NTKHNvdXJjZVNpemVWYWx1ZSwgdHJ1ZSkgfHwgZmFsc2U7XG4gICAgaWYgKHZhbHVlIDwgMCkge1xuICAgICAgdmFsdWUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIFRha2VzIGEgdHlwZSBzdHJpbmcgYW5kIGNoZWNrcyBpZiBpdHMgc3VwcG9ydGVkXG4gICAqL1xuXG4gIHBmLnN1cHBvcnRzVHlwZSA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgcmV0dXJuICh0eXBlKSA/IHR5cGVzW3R5cGVdIDogdHJ1ZTtcbiAgfTtcblxuICAvKipcbiAgICogUGFyc2VzIGEgc291cmNlU2l6ZSBpbnRvIG1lZGlhQ29uZGl0aW9uIChtZWRpYSkgYW5kIHNvdXJjZVNpemVWYWx1ZSAobGVuZ3RoKVxuICAgKiBAcGFyYW0gc291cmNlU2l6ZVN0clxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIHBmLnBhcnNlU2l6ZSA9IG1lbW9pemUoZnVuY3Rpb24gKHNvdXJjZVNpemVTdHIpIHtcbiAgICB2YXIgbWF0Y2ggPSAoc291cmNlU2l6ZVN0ciB8fCBcIlwiKS5tYXRjaChyZWdTaXplKTtcbiAgICByZXR1cm4ge1xuICAgICAgbWVkaWE6IG1hdGNoICYmIG1hdGNoWzFdLFxuICAgICAgbGVuZ3RoOiBtYXRjaCAmJiBtYXRjaFsyXVxuICAgIH07XG4gIH0pO1xuXG4gIHBmLnBhcnNlU2V0ID0gZnVuY3Rpb24gKHNldCkge1xuICAgIGlmICghc2V0LmNhbmRzKSB7XG4gICAgICBzZXQuY2FuZHMgPSBwYXJzZVNyY3NldChzZXQuc3Jjc2V0LCBzZXQpO1xuICAgIH1cbiAgICByZXR1cm4gc2V0LmNhbmRzO1xuICB9O1xuXG4gIC8qKlxuICAgKiByZXR1cm5zIDFlbSBpbiBjc3MgcHggZm9yIGh0bWwvYm9keSBkZWZhdWx0IHNpemVcbiAgICogZnVuY3Rpb24gdGFrZW4gZnJvbSByZXNwb25kanNcbiAgICogQHJldHVybnMgeyp8bnVtYmVyfVxuICAgKi9cbiAgcGYuZ2V0RW1WYWx1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYm9keTtcbiAgICBpZiAoIWVtaW5weCAmJiAoYm9keSA9IGRvY3VtZW50LmJvZHkpKSB7XG4gICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxcbiAgICAgICAgb3JpZ2luYWxIVE1MQ1NTID0gZG9jRWxlbS5zdHlsZS5jc3NUZXh0LFxuICAgICAgICBvcmlnaW5hbEJvZHlDU1MgPSBib2R5LnN0eWxlLmNzc1RleHQ7XG5cbiAgICAgIGRpdi5zdHlsZS5jc3NUZXh0ID0gYmFzZVN0eWxlO1xuXG4gICAgICAvLyAxZW0gaW4gYSBtZWRpYSBxdWVyeSBpcyB0aGUgdmFsdWUgb2YgdGhlIGRlZmF1bHQgZm9udCBzaXplIG9mIHRoZSBicm93c2VyXG4gICAgICAvLyByZXNldCBkb2NFbGVtIGFuZCBib2R5IHRvIGVuc3VyZSB0aGUgY29ycmVjdCB2YWx1ZSBpcyByZXR1cm5lZFxuICAgICAgZG9jRWxlbS5zdHlsZS5jc3NUZXh0ID0gZnNDc3M7XG4gICAgICBib2R5LnN0eWxlLmNzc1RleHQgPSBmc0NzcztcblxuICAgICAgYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgZW1pbnB4ID0gZGl2Lm9mZnNldFdpZHRoO1xuICAgICAgYm9keS5yZW1vdmVDaGlsZChkaXYpO1xuXG4gICAgICAvL2Fsc28gdXBkYXRlIGVtaW5weCBiZWZvcmUgcmV0dXJuaW5nXG4gICAgICBlbWlucHggPSBwYXJzZUZsb2F0KGVtaW5weCwgMTApO1xuXG4gICAgICAvLyByZXN0b3JlIHRoZSBvcmlnaW5hbCB2YWx1ZXNcbiAgICAgIGRvY0VsZW0uc3R5bGUuY3NzVGV4dCA9IG9yaWdpbmFsSFRNTENTUztcbiAgICAgIGJvZHkuc3R5bGUuY3NzVGV4dCA9IG9yaWdpbmFsQm9keUNTUztcblxuICAgIH1cbiAgICByZXR1cm4gZW1pbnB4IHx8IDE2O1xuICB9O1xuXG4gIC8qKlxuICAgKiBUYWtlcyBhIHN0cmluZyBvZiBzaXplcyBhbmQgcmV0dXJucyB0aGUgd2lkdGggaW4gcGl4ZWxzIGFzIGEgbnVtYmVyXG4gICAqL1xuICBwZi5jYWxjTGlzdExlbmd0aCA9IGZ1bmN0aW9uIChzb3VyY2VTaXplTGlzdFN0cikge1xuICAgIC8vIFNwbGl0IHVwIHNvdXJjZSBzaXplIGxpc3QsIGllICggbWF4LXdpZHRoOiAzMGVtICkgMTAwJSwgKCBtYXgtd2lkdGg6IDUwZW0gKSA1MCUsIDMzJVxuICAgIC8vXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICBvciAobWluLXdpZHRoOjMwZW0pIGNhbGMoMzAlIC0gMTVweClcbiAgICBpZiAoIShzb3VyY2VTaXplTGlzdFN0ciBpbiBzaXplTGVuZ3RoQ2FjaGUpIHx8IGNmZy51VCkge1xuICAgICAgdmFyIHdpbm5pbmdMZW5ndGggPSBwZi5jYWxjTGVuZ3RoKHBhcnNlU2l6ZXMoc291cmNlU2l6ZUxpc3RTdHIpKTtcblxuICAgICAgc2l6ZUxlbmd0aENhY2hlW3NvdXJjZVNpemVMaXN0U3RyXSA9ICF3aW5uaW5nTGVuZ3RoID8gdW5pdHMud2lkdGggOiB3aW5uaW5nTGVuZ3RoO1xuICAgIH1cblxuICAgIHJldHVybiBzaXplTGVuZ3RoQ2FjaGVbc291cmNlU2l6ZUxpc3RTdHJdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBUYWtlcyBhIGNhbmRpZGF0ZSBvYmplY3Qgd2l0aCBhIHNyY3NldCBwcm9wZXJ0eSBpbiB0aGUgZm9ybSBvZiB1cmwvXG4gICAqIGV4LiBcImltYWdlcy9waWMtbWVkaXVtLnBuZyAxeCwgaW1hZ2VzL3BpYy1tZWRpdW0tMngucG5nIDJ4XCIgb3JcbiAgICogICAgIFwiaW1hZ2VzL3BpYy1tZWRpdW0ucG5nIDQwMHcsIGltYWdlcy9waWMtbWVkaXVtLTJ4LnBuZyA4MDB3XCIgb3JcbiAgICogICAgIFwiaW1hZ2VzL3BpYy1zbWFsbC5wbmdcIlxuICAgKiBHZXQgYW4gYXJyYXkgb2YgaW1hZ2UgY2FuZGlkYXRlcyBpbiB0aGUgZm9ybSBvZlxuICAgKiAgICAgIHt1cmw6IFwiL2Zvby9iYXIucG5nXCIsIHJlc29sdXRpb246IDF9XG4gICAqIHdoZXJlIHJlc29sdXRpb24gaXMgaHR0cDovL2Rldi53My5vcmcvY3Nzd2cvY3NzLXZhbHVlcy0zLyNyZXNvbHV0aW9uLXZhbHVlXG4gICAqIElmIHNpemVzIGlzIHNwZWNpZmllZCwgcmVzIGlzIGNhbGN1bGF0ZWRcbiAgICovXG4gIHBmLnNldFJlcyA9IGZ1bmN0aW9uIChzZXQpIHtcbiAgICB2YXIgY2FuZGlkYXRlcztcbiAgICBpZiAoc2V0KSB7XG5cbiAgICAgIGNhbmRpZGF0ZXMgPSBwZi5wYXJzZVNldChzZXQpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FuZGlkYXRlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBzZXRSZXNvbHV0aW9uKGNhbmRpZGF0ZXNbaV0sIHNldC5zaXplcyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjYW5kaWRhdGVzO1xuICB9O1xuXG4gIHBmLnNldFJlcy5yZXMgPSBzZXRSZXNvbHV0aW9uO1xuXG4gIHBmLmFwcGx5U2V0Q2FuZGlkYXRlID0gZnVuY3Rpb24gKGNhbmRpZGF0ZXMsIGltZykge1xuICAgIGlmICghY2FuZGlkYXRlcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGNhbmRpZGF0ZSxcbiAgICAgIGksXG4gICAgICBqLFxuICAgICAgbGVuZ3RoLFxuICAgICAgYmVzdENhbmRpZGF0ZSxcbiAgICAgIGN1clNyYyxcbiAgICAgIGN1ckNhbixcbiAgICAgIGNhbmRpZGF0ZVNyYyxcbiAgICAgIGFib3J0Q3VyU3JjO1xuXG4gICAgdmFyIGltYWdlRGF0YSA9IGltZ1twZi5uc107XG4gICAgdmFyIGRwciA9IHBmLkRQUjtcblxuICAgIGN1clNyYyA9IGltYWdlRGF0YS5jdXJTcmMgfHwgaW1nW2N1clNyY1Byb3BdO1xuXG4gICAgY3VyQ2FuID0gaW1hZ2VEYXRhLmN1ckNhbiB8fCBzZXRTcmNUb0N1cihpbWcsIGN1clNyYywgY2FuZGlkYXRlc1swXS5zZXQpO1xuXG4gICAgLy8gaWYgd2UgaGF2ZSBhIGN1cnJlbnQgc291cmNlLCB3ZSBtaWdodCBlaXRoZXIgYmVjb21lIGxhenkgb3IgZ2l2ZSB0aGlzIHNvdXJjZSBzb21lIGFkdmFudGFnZVxuICAgIGlmIChjdXJDYW4gJiYgY3VyQ2FuLnNldCA9PT0gY2FuZGlkYXRlc1swXS5zZXQpIHtcblxuICAgICAgLy8gaWYgYnJvd3NlciBjYW4gYWJvcnQgaW1hZ2UgcmVxdWVzdCBhbmQgdGhlIGltYWdlIGhhcyBhIGhpZ2hlciBwaXhlbCBkZW5zaXR5IHRoYW4gbmVlZGVkXG4gICAgICAvLyBhbmQgdGhpcyBpbWFnZSBpc24ndCBkb3dubG9hZGVkIHlldCwgd2Ugc2tpcCBuZXh0IHBhcnQgYW5kIHRyeSB0byBzYXZlIGJhbmR3aWR0aFxuICAgICAgYWJvcnRDdXJTcmMgPSAoc3VwcG9ydEFib3J0ICYmICFpbWcuY29tcGxldGUgJiYgY3VyQ2FuLnJlcyAtIDAuMSA+IGRwcik7XG5cbiAgICAgIGlmICghYWJvcnRDdXJTcmMpIHtcbiAgICAgICAgY3VyQ2FuLmNhY2hlZCA9IHRydWU7XG5cbiAgICAgICAgLy8gaWYgY3VycmVudCBjYW5kaWRhdGUgaXMgXCJiZXN0XCIsIFwiYmV0dGVyXCIgb3IgXCJva2F5XCIsXG4gICAgICAgIC8vIHNldCBpdCB0byBiZXN0Q2FuZGlkYXRlXG4gICAgICAgIGlmIChjdXJDYW4ucmVzID49IGRwcikge1xuICAgICAgICAgIGJlc3RDYW5kaWRhdGUgPSBjdXJDYW47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWJlc3RDYW5kaWRhdGUpIHtcblxuICAgICAgY2FuZGlkYXRlcy5zb3J0KGFzY2VuZGluZ1NvcnQpO1xuXG4gICAgICBsZW5ndGggPSBjYW5kaWRhdGVzLmxlbmd0aDtcbiAgICAgIGJlc3RDYW5kaWRhdGUgPSBjYW5kaWRhdGVzW2xlbmd0aCAtIDFdO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY2FuZGlkYXRlID0gY2FuZGlkYXRlc1tpXTtcbiAgICAgICAgaWYgKGNhbmRpZGF0ZS5yZXMgPj0gZHByKSB7XG4gICAgICAgICAgaiA9IGkgLSAxO1xuXG4gICAgICAgICAgLy8gd2UgaGF2ZSBmb3VuZCB0aGUgcGVyZmVjdCBjYW5kaWRhdGUsXG4gICAgICAgICAgLy8gYnV0IGxldCdzIGltcHJvdmUgdGhpcyBhIGxpdHRsZSBiaXQgd2l0aCBzb21lIGFzc3VtcHRpb25zIDstKVxuICAgICAgICAgIGlmIChjYW5kaWRhdGVzW2pdICYmXG4gICAgICAgICAgICAoYWJvcnRDdXJTcmMgfHwgY3VyU3JjICE9PSBwZi5tYWtlVXJsKGNhbmRpZGF0ZS51cmwpKSAmJlxuICAgICAgICAgICAgY2hvb3NlTG93UmVzKGNhbmRpZGF0ZXNbal0ucmVzLCBjYW5kaWRhdGUucmVzLCBkcHIsIGNhbmRpZGF0ZXNbal0uY2FjaGVkKSkge1xuXG4gICAgICAgICAgICBiZXN0Q2FuZGlkYXRlID0gY2FuZGlkYXRlc1tqXTtcblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiZXN0Q2FuZGlkYXRlID0gY2FuZGlkYXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChiZXN0Q2FuZGlkYXRlKSB7XG5cbiAgICAgIGNhbmRpZGF0ZVNyYyA9IHBmLm1ha2VVcmwoYmVzdENhbmRpZGF0ZS51cmwpO1xuXG4gICAgICBpbWFnZURhdGEuY3VyU3JjID0gY2FuZGlkYXRlU3JjO1xuICAgICAgaW1hZ2VEYXRhLmN1ckNhbiA9IGJlc3RDYW5kaWRhdGU7XG5cbiAgICAgIGlmIChjYW5kaWRhdGVTcmMgIT09IGN1clNyYykge1xuICAgICAgICBwZi5zZXRTcmMoaW1nLCBiZXN0Q2FuZGlkYXRlKTtcbiAgICAgIH1cbiAgICAgIHBmLnNldFNpemUoaW1nKTtcbiAgICB9XG4gIH07XG5cbiAgcGYuc2V0U3JjID0gZnVuY3Rpb24gKGltZywgYmVzdENhbmRpZGF0ZSkge1xuICAgIHZhciBvcmlnV2lkdGg7XG4gICAgaW1nLnNyYyA9IGJlc3RDYW5kaWRhdGUudXJsO1xuXG4gICAgLy8gYWx0aG91Z2ggdGhpcyBpcyBhIHNwZWNpZmljIFNhZmFyaSBpc3N1ZSwgd2UgZG9uJ3Qgd2FudCB0byB0YWtlIHRvbyBtdWNoIGRpZmZlcmVudCBjb2RlIHBhdGhzXG4gICAgaWYgKGJlc3RDYW5kaWRhdGUuc2V0LnR5cGUgPT09IFwiaW1hZ2Uvc3ZnK3htbFwiKSB7XG4gICAgICBvcmlnV2lkdGggPSBpbWcuc3R5bGUud2lkdGg7XG4gICAgICBpbWcuc3R5bGUud2lkdGggPSAoaW1nLm9mZnNldFdpZHRoICsgMSkgKyBcInB4XCI7XG5cbiAgICAgIC8vIG5leHQgbGluZSBvbmx5IHNob3VsZCB0cmlnZ2VyIGEgcmVwYWludFxuICAgICAgLy8gaWYuLi4gaXMgb25seSBkb25lIHRvIHRyaWNrIGRlYWQgY29kZSByZW1vdmFsXG4gICAgICBpZiAoaW1nLm9mZnNldFdpZHRoICsgMSkge1xuICAgICAgICBpbWcuc3R5bGUud2lkdGggPSBvcmlnV2lkdGg7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHBmLmdldFNldCA9IGZ1bmN0aW9uIChpbWcpIHtcbiAgICB2YXIgaSwgc2V0LCBzdXBwb3J0c1R5cGU7XG4gICAgdmFyIG1hdGNoID0gZmFsc2U7XG4gICAgdmFyIHNldHMgPSBpbWdbcGYubnNdLnNldHM7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgc2V0cy5sZW5ndGggJiYgIW1hdGNoOyBpKyspIHtcbiAgICAgIHNldCA9IHNldHNbaV07XG5cbiAgICAgIGlmICghc2V0LnNyY3NldCB8fCAhcGYubWF0Y2hlc01lZGlhKHNldC5tZWRpYSkgfHwgIShzdXBwb3J0c1R5cGUgPSBwZi5zdXBwb3J0c1R5cGUoc2V0LnR5cGUpKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN1cHBvcnRzVHlwZSA9PT0gXCJwZW5kaW5nXCIpIHtcbiAgICAgICAgc2V0ID0gc3VwcG9ydHNUeXBlO1xuICAgICAgfVxuXG4gICAgICBtYXRjaCA9IHNldDtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBtYXRjaDtcbiAgfTtcblxuICBwZi5wYXJzZVNldHMgPSBmdW5jdGlvbiAoZWxlbWVudCwgcGFyZW50LCBvcHRpb25zKSB7XG4gICAgdmFyIHNyY3NldEF0dHJpYnV0ZSwgaW1hZ2VTZXQsIGlzV0Rlc2NyaXBvciwgc3Jjc2V0UGFyc2VkO1xuXG4gICAgdmFyIGhhc1BpY3R1cmUgPSBwYXJlbnQgJiYgcGFyZW50Lm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgPT09IFwiUElDVFVSRVwiO1xuICAgIHZhciBpbWFnZURhdGEgPSBlbGVtZW50W3BmLm5zXTtcblxuICAgIGlmIChpbWFnZURhdGEuc3JjID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5zcmMpIHtcbiAgICAgIGltYWdlRGF0YS5zcmMgPSBnZXRJbWdBdHRyLmNhbGwoZWxlbWVudCwgXCJzcmNcIik7XG4gICAgICBpZiAoaW1hZ2VEYXRhLnNyYykge1xuICAgICAgICBzZXRJbWdBdHRyLmNhbGwoZWxlbWVudCwgc3JjQXR0ciwgaW1hZ2VEYXRhLnNyYyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZW1vdmVJbWdBdHRyLmNhbGwoZWxlbWVudCwgc3JjQXR0cik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGltYWdlRGF0YS5zcmNzZXQgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnNyY3NldCB8fCAhcGYuc3VwU3Jjc2V0IHx8IGVsZW1lbnQuc3Jjc2V0KSB7XG4gICAgICBzcmNzZXRBdHRyaWJ1dGUgPSBnZXRJbWdBdHRyLmNhbGwoZWxlbWVudCwgXCJzcmNzZXRcIik7XG4gICAgICBpbWFnZURhdGEuc3Jjc2V0ID0gc3Jjc2V0QXR0cmlidXRlO1xuICAgICAgc3Jjc2V0UGFyc2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpbWFnZURhdGEuc2V0cyA9IFtdO1xuXG4gICAgaWYgKGhhc1BpY3R1cmUpIHtcbiAgICAgIGltYWdlRGF0YS5waWMgPSB0cnVlO1xuICAgICAgZ2V0QWxsU291cmNlRWxlbWVudHMocGFyZW50LCBpbWFnZURhdGEuc2V0cyk7XG4gICAgfVxuXG4gICAgaWYgKGltYWdlRGF0YS5zcmNzZXQpIHtcbiAgICAgIGltYWdlU2V0ID0ge1xuICAgICAgICBzcmNzZXQ6IGltYWdlRGF0YS5zcmNzZXQsXG4gICAgICAgIHNpemVzOiBnZXRJbWdBdHRyLmNhbGwoZWxlbWVudCwgXCJzaXplc1wiKVxuICAgICAgfTtcblxuICAgICAgaW1hZ2VEYXRhLnNldHMucHVzaChpbWFnZVNldCk7XG5cbiAgICAgIGlzV0Rlc2NyaXBvciA9IChhbHdheXNDaGVja1dEZXNjcmlwdG9yIHx8IGltYWdlRGF0YS5zcmMpICYmIHJlZ1dEZXNjLnRlc3QoaW1hZ2VEYXRhLnNyY3NldCB8fCBcIlwiKTtcblxuICAgICAgLy8gYWRkIG5vcm1hbCBzcmMgYXMgY2FuZGlkYXRlLCBpZiBzb3VyY2UgaGFzIG5vIHcgZGVzY3JpcHRvclxuICAgICAgaWYgKCFpc1dEZXNjcmlwb3IgJiYgaW1hZ2VEYXRhLnNyYyAmJiAhZ2V0Q2FuZGlkYXRlRm9yU3JjKGltYWdlRGF0YS5zcmMsIGltYWdlU2V0KSAmJiAhaW1hZ2VTZXQuaGFzMXgpIHtcbiAgICAgICAgaW1hZ2VTZXQuc3Jjc2V0ICs9IFwiLCBcIiArIGltYWdlRGF0YS5zcmM7XG4gICAgICAgIGltYWdlU2V0LmNhbmRzLnB1c2goe1xuICAgICAgICAgIHVybDogaW1hZ2VEYXRhLnNyYyxcbiAgICAgICAgICBkOiAxLFxuICAgICAgICAgIHNldDogaW1hZ2VTZXRcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICB9IGVsc2UgaWYgKGltYWdlRGF0YS5zcmMpIHtcbiAgICAgIGltYWdlRGF0YS5zZXRzLnB1c2goe1xuICAgICAgICBzcmNzZXQ6IGltYWdlRGF0YS5zcmMsXG4gICAgICAgIHNpemVzOiBudWxsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpbWFnZURhdGEuY3VyQ2FuID0gbnVsbDtcbiAgICBpbWFnZURhdGEuY3VyU3JjID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gaWYgaW1nIGhhcyBwaWN0dXJlIG9yIHRoZSBzcmNzZXQgd2FzIHJlbW92ZWQgb3IgaGFzIGEgc3Jjc2V0IGFuZCBkb2VzIG5vdCBzdXBwb3J0IHNyY3NldCBhdCBhbGxcbiAgICAvLyBvciBoYXMgYSB3IGRlc2NyaXB0b3IgKGFuZCBkb2VzIG5vdCBzdXBwb3J0IHNpemVzKSBzZXQgc3VwcG9ydCB0byBmYWxzZSB0byBldmFsdWF0ZVxuICAgIGltYWdlRGF0YS5zdXBwb3J0ZWQgPSAhKGhhc1BpY3R1cmUgfHwgKGltYWdlU2V0ICYmICFwZi5zdXBTcmNzZXQpIHx8IChpc1dEZXNjcmlwb3IgJiYgIXBmLnN1cFNpemVzKSk7XG5cbiAgICBpZiAoc3Jjc2V0UGFyc2VkICYmIHBmLnN1cFNyY3NldCAmJiAhaW1hZ2VEYXRhLnN1cHBvcnRlZCkge1xuICAgICAgaWYgKHNyY3NldEF0dHJpYnV0ZSkge1xuICAgICAgICBzZXRJbWdBdHRyLmNhbGwoZWxlbWVudCwgc3Jjc2V0QXR0ciwgc3Jjc2V0QXR0cmlidXRlKTtcbiAgICAgICAgZWxlbWVudC5zcmNzZXQgPSBcIlwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVtb3ZlSW1nQXR0ci5jYWxsKGVsZW1lbnQsIHNyY3NldEF0dHIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpbWFnZURhdGEuc3VwcG9ydGVkICYmICFpbWFnZURhdGEuc3Jjc2V0ICYmICgoIWltYWdlRGF0YS5zcmMgJiYgZWxlbWVudC5zcmMpIHx8IGVsZW1lbnQuc3JjICE9PSBwZi5tYWtlVXJsKGltYWdlRGF0YS5zcmMpKSkge1xuICAgICAgaWYgKGltYWdlRGF0YS5zcmMgPT09IG51bGwpIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJzcmNcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LnNyYyA9IGltYWdlRGF0YS5zcmM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaW1hZ2VEYXRhLnBhcnNlZCA9IHRydWU7XG4gIH07XG5cbiAgcGYuZmlsbEltZyA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdmFyIGltYWdlRGF0YTtcbiAgICB2YXIgZXh0cmVtZSA9IG9wdGlvbnMucmVzZWxlY3QgfHwgb3B0aW9ucy5yZWV2YWx1YXRlO1xuXG4gICAgLy8gZXhwYW5kbyBmb3IgY2FjaGluZyBkYXRhIG9uIHRoZSBpbWdcbiAgICBpZiAoIWVsZW1lbnRbcGYubnNdKSB7XG4gICAgICBlbGVtZW50W3BmLm5zXSA9IHt9O1xuICAgIH1cblxuICAgIGltYWdlRGF0YSA9IGVsZW1lbnRbcGYubnNdO1xuXG4gICAgLy8gaWYgdGhlIGVsZW1lbnQgaGFzIGFscmVhZHkgYmVlbiBldmFsdWF0ZWQsIHNraXAgaXRcbiAgICAvLyB1bmxlc3MgYG9wdGlvbnMucmVldmFsdWF0ZWAgaXMgc2V0IHRvIHRydWUgKCB0aGlzLCBmb3IgZXhhbXBsZSxcbiAgICAvLyBpcyBzZXQgdG8gdHJ1ZSB3aGVuIHJ1bm5pbmcgYHBpY3R1cmVmaWxsYCBvbiBgcmVzaXplYCApLlxuICAgIGlmICghZXh0cmVtZSAmJiBpbWFnZURhdGEuZXZhbGVkID09PSBldmFsSWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIWltYWdlRGF0YS5wYXJzZWQgfHwgb3B0aW9ucy5yZWV2YWx1YXRlKSB7XG4gICAgICBwZi5wYXJzZVNldHMoZWxlbWVudCwgZWxlbWVudC5wYXJlbnROb2RlLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBpZiAoIWltYWdlRGF0YS5zdXBwb3J0ZWQpIHtcbiAgICAgIGFwcGx5QmVzdENhbmRpZGF0ZShlbGVtZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW1hZ2VEYXRhLmV2YWxlZCA9IGV2YWxJZDtcbiAgICB9XG4gIH07XG5cbiAgcGYuc2V0dXBSdW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFhbHJlYWR5UnVuIHx8IGlzVndEaXJ0eSB8fCAoRFBSICE9PSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbykpIHtcbiAgICAgIHVwZGF0ZU1ldHJpY3MoKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gSWYgcGljdHVyZSBpcyBzdXBwb3J0ZWQsIHdlbGwsIHRoYXQncyBhd2Vzb21lLlxuICBpZiAocGYuc3VwUGljdHVyZSkge1xuICAgIHBpY3R1cmVmaWxsID0gbm9vcDtcbiAgICBwZi5maWxsSW1nID0gbm9vcDtcbiAgfSBlbHNlIHtcblxuICAgIC8vIFNldCB1cCBwaWN0dXJlIHBvbHlmaWxsIGJ5IHBvbGxpbmcgdGhlIGRvY3VtZW50XG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBpc0RvbVJlYWR5O1xuICAgICAgdmFyIHJlZ1JlYWR5ID0gd2luZG93LmF0dGFjaEV2ZW50ID8gL2QkfF5jLyA6IC9kJHxeY3xeaS87XG5cbiAgICAgIHZhciBydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByZWFkeVN0YXRlID0gZG9jdW1lbnQucmVhZHlTdGF0ZSB8fCBcIlwiO1xuXG4gICAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHJ1biwgcmVhZHlTdGF0ZSA9PT0gXCJsb2FkaW5nXCIgPyAyMDAgOiA5OTkpO1xuICAgICAgICBpZiAoZG9jdW1lbnQuYm9keSkge1xuICAgICAgICAgIHBmLmZpbGxJbWdzKCk7XG4gICAgICAgICAgaXNEb21SZWFkeSA9IGlzRG9tUmVhZHkgfHwgcmVnUmVhZHkudGVzdChyZWFkeVN0YXRlKTtcbiAgICAgICAgICBpZiAoaXNEb21SZWFkeSkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVySWQpO1xuICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB2YXIgdGltZXJJZCA9IHNldFRpbWVvdXQocnVuLCBkb2N1bWVudC5ib2R5ID8gOSA6IDk5KTtcblxuICAgICAgLy8gQWxzbyBhdHRhY2ggcGljdHVyZWZpbGwgb24gcmVzaXplIGFuZCByZWFkeXN0YXRlY2hhbmdlXG4gICAgICAvLyBodHRwOi8vbW9kZXJuamF2YXNjcmlwdC5ibG9nc3BvdC5jb20vMjAxMy8wOC9idWlsZGluZy1iZXR0ZXItZGVib3VuY2UuaHRtbFxuICAgICAgdmFyIGRlYm91bmNlID0gZnVuY3Rpb24gKGZ1bmMsIHdhaXQpIHtcbiAgICAgICAgdmFyIHRpbWVvdXQsIHRpbWVzdGFtcDtcbiAgICAgICAgdmFyIGxhdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBsYXN0ID0gKG5ldyBEYXRlKCkpIC0gdGltZXN0YW1wO1xuXG4gICAgICAgICAgaWYgKGxhc3QgPCB3YWl0KSB7XG4gICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgIGZ1bmMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpO1xuXG4gICAgICAgICAgaWYgKCF0aW1lb3V0KSB7XG4gICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfTtcbiAgICAgIHZhciBsYXN0Q2xpZW50V2lkdGggPSBkb2NFbGVtLmNsaWVudEhlaWdodDtcbiAgICAgIHZhciBvblJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaXNWd0RpcnR5ID0gTWF0aC5tYXgod2luZG93LmlubmVyV2lkdGggfHwgMCwgZG9jRWxlbS5jbGllbnRXaWR0aCkgIT09IHVuaXRzLndpZHRoIHx8IGRvY0VsZW0uY2xpZW50SGVpZ2h0ICE9PSBsYXN0Q2xpZW50V2lkdGg7XG4gICAgICAgIGxhc3RDbGllbnRXaWR0aCA9IGRvY0VsZW0uY2xpZW50SGVpZ2h0O1xuICAgICAgICBpZiAoaXNWd0RpcnR5KSB7XG4gICAgICAgICAgcGYuZmlsbEltZ3MoKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgb24od2luZG93LCBcInJlc2l6ZVwiLCBkZWJvdW5jZShvblJlc2l6ZSwgOTkpKTtcbiAgICAgIG9uKGRvY3VtZW50LCBcInJlYWR5c3RhdGVjaGFuZ2VcIiwgcnVuKTtcbiAgICB9KSgpO1xuICB9XG5cbiAgcGYucGljdHVyZWZpbGwgPSBwaWN0dXJlZmlsbDtcbiAgLy91c2UgdGhpcyBpbnRlcm5hbGx5IGZvciBlYXN5IG1vbmtleSBwYXRjaGluZy9wZXJmb3JtYW5jZSB0ZXN0aW5nXG4gIHBmLmZpbGxJbWdzID0gcGljdHVyZWZpbGw7XG4gIHBmLnRlYXJkb3duUnVuID0gbm9vcDtcblxuICAvKiBleHBvc2UgbWV0aG9kcyBmb3IgdGVzdGluZyAqL1xuICBwaWN0dXJlZmlsbC5fID0gcGY7XG5cbiAgd2luZG93LnBpY3R1cmVmaWxsQ0ZHID0ge1xuICAgIHBmOiBwZixcbiAgICBwdXNoOiBmdW5jdGlvbiAoYXJncykge1xuICAgICAgdmFyIG5hbWUgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICBpZiAodHlwZW9mIHBmW25hbWVdID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcGZbbmFtZV0uYXBwbHkocGYsIGFyZ3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2ZnW25hbWVdID0gYXJnc1swXTtcbiAgICAgICAgaWYgKGFscmVhZHlSdW4pIHtcbiAgICAgICAgICBwZi5maWxsSW1ncyh7XG4gICAgICAgICAgICByZXNlbGVjdDogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHdoaWxlIChzZXRPcHRpb25zICYmIHNldE9wdGlvbnMubGVuZ3RoKSB7XG4gICAgd2luZG93LnBpY3R1cmVmaWxsQ0ZHLnB1c2goc2V0T3B0aW9ucy5zaGlmdCgpKTtcbiAgfVxuXG4gIC8qIGV4cG9zZSBwaWN0dXJlZmlsbCAqL1xuICB3aW5kb3cucGljdHVyZWZpbGwgPSBwaWN0dXJlZmlsbDtcblxuICAvKiBleHBvc2UgcGljdHVyZWZpbGwgKi9cbiAgaWYgKHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSBcIm9iamVjdFwiKSB7XG4gICAgLy8gQ29tbW9uSlMsIGp1c3QgZXhwb3J0XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBwaWN0dXJlZmlsbDtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIEFNRCBzdXBwb3J0XG4gICAgZGVmaW5lKFwicGljdHVyZWZpbGxcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHBpY3R1cmVmaWxsO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gSUU4IGV2YWxzIHRoaXMgc3luYywgc28gaXQgbXVzdCBiZSB0aGUgbGFzdCB0aGluZyB3ZSBkb1xuICBpZiAoIXBmLnN1cFBpY3R1cmUpIHtcbiAgICB0eXBlc1tcImltYWdlL3dlYnBcIl0gPSBkZXRlY3RUeXBlU3VwcG9ydChcImltYWdlL3dlYnBcIiwgXCJkYXRhOmltYWdlL3dlYnA7YmFzZTY0LFVrbEdSa29BQUFCWFJVSlFWbEE0V0FvQUFBQVFBQUFBQUFBQUFBQUFRVXhRU0F3QUFBQUJCeEFSL1E5RVJQOERBQUJXVURnZ0dBQUFBREFCQUowQktnRUFBUUFEQURRbHBBQURjQUQrKy8xUUFBPT1cIik7XG4gIH1cblxufSkod2luZG93LCBkb2N1bWVudCk7XG4iXSwiZmlsZSI6InBvbHlmaWxsLmpzIn0=
