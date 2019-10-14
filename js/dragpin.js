'use strict';
(function () {
  var MAIN_PIN_SIZE = 65;
  var DRAG_PIN_LIMITS = {
    minX: 0,
    maxX: 1200,
    minY: 130,
    maxY: 630
  };

  var address = document.querySelector('#address');

  var setAddressCoords = function (coords) {
    address.value = coords.x + ', ' + coords.y;
  };
  // Координаты главного пина
  var getMainPinPosition = function () {
    var mainPinPosition = {
      x: window.map.mapPinMain.offsetLeft + Math.floor(MAIN_PIN_SIZE / 2),
      y: window.map.mapPinMain.offsetTop + MAIN_PIN_SIZE + window.map.PIN_PEAK_HEIGHT
    };
    return mainPinPosition;
  };

  var dragPin = function () {
    window.map.mapPinMain.addEventListener('mousedown', function (evt) {
      evt.preventDefault();
      // Координаты точки, с которой начинается движение
      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };
      // Удержание кнопки мыши
      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();
        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        var mainPinCoords = getMainPinPosition();
        var newTopCoords = mainPinCoords.y - shift.y;
        var newLeftCoords = mainPinCoords.x - shift.x;
        if ((newTopCoords >= DRAG_PIN_LIMITS.minY && newTopCoords <= DRAG_PIN_LIMITS.maxY) &&
        (newLeftCoords >= DRAG_PIN_LIMITS.minX && newLeftCoords <= DRAG_PIN_LIMITS.maxX)) {
          window.map.mapPinMain.style.top = window.map.mapPinMain.offsetTop - shift.y + 'px';
          window.map.mapPinMain.style.left = window.map.mapPinMain.offsetLeft - shift.x + 'px';
        }
        setAddressCoords(mainPinCoords);
      };
      // При отпускании кнопки мыши перестаем слушать события движения мыши
      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  };
  dragPin();
})();
