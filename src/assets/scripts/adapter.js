﻿/**
* rem计算方式：设计图尺寸px / 100 = 实际rem  例: 100px = 1rem
*/
(function (window, docWidth) {

  /* 设计图文档宽度 docWidth */

  var doc = window.document,
    docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';

  var recalc = (function refreshRem() {
    var clientWidth = docEl.getBoundingClientRect().width;

    docEl.style.fontSize = (clientWidth / docWidth) * 100 + 'px';

    return refreshRem;
  })();

  /* 添加倍屏标识，安卓倍屏为1 */
  //docEl.setAttribute('data-dpr', window.navigator.appVersion.match(/iphone/gi) ? window.devicePixelRatio : 1);

  //if (/iP(hone|od|ad)/.test(window.navigator.userAgent)) {
  //    /* 添加IOS标识 */
  //    doc.documentElement.classList.add('ios');
  //    /* IOS8以上给html添加hairline样式，以便特殊处理 */
  //    if (parseInt(window.navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)[1], 10) >= 8)
  //        doc.documentElement.classList.add('hairline');
  //}

  if (!doc.addEventListener) return;
  window.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(window, window.document.body.clientWidth);
