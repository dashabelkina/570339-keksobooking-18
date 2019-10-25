'use strict';
(function () {
  var DEBOUNCE_INTERVAL = 500;

  window.debounce = function (cb) {
    var lastTimeout = null;
    return function () {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, args);
      }, DEBOUNCE_INTERVAL);
    };
  };
})();
