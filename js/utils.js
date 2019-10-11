'use strict';
(function () {
  var getRandomNumberInRange = function (min, max) {
    return Math.floor(Math.random() * max) + min;
  };

  var shuffleArray = function (array) {
    var j;
    var temp;
    for (var i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[j];
      array[j] = array[i];
      array[i] = temp;
    }
    return array.slice(0, getRandomNumberInRange(0, array.length));
  };

  var getDeclensionWord = function (n, words) {
    return words[(n % 100 > 4 && n % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][Math.min(n % 10, 5)]];
  };

  var getTemplate = function (data, tpl) {
    var result = '';
    for (var i = 0; i < data.length; i++) {
      result += tpl.replace('{{x}}', data[i]);
    }
    return result;
  };

  window.utils = {
    getRandomNumberInRange: getRandomNumberInRange,
    shuffleArray: shuffleArray,
    getDeclensionWord: getDeclensionWord,
    getTemplate: getTemplate
  };
})();
