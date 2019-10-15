'use strict';
(function () {
  var PIN_PEAK_HEIGHT = 16;
  var ENTER_KEYCODE = 13;
  var mapPinMainStartCoords = {
    x: '570px',
    y: '375px'
  };

  var map = document.querySelector('.map');
  var mapPinMain = document.querySelector('.map__pin--main');
  // Координаты пина
  var pinMainX = Math.round(parseInt(mapPinMain.style.left, 10));
  var pinMainY = Math.round(parseInt(mapPinMain.style.top, 10) + PIN_PEAK_HEIGHT);
  var pinDeactivateMainY = Math.round(parseInt(mapPinMain.style.top, 10));
  var data = window.data.getMockOffers();

  var setAddressInInput = function (isActive) {
    var addressInput = window.form.adForm.querySelector('input[name="address"]');
    var mapPinPosition = addressInput.value;
    addressInput.value = pinMainX + ', ' + pinDeactivateMainY;
    if (isActive) {
      addressInput.value = pinMainX + ', ' + pinMainY;
    }
    return mapPinPosition;
  };
  // Координаты главного пина по умолчанию
  var getMapPinMainStartPosition = function () {
    mapPinMain.style.left = mapPinMainStartCoords.x;
    mapPinMain.style.top = mapPinMainStartCoords.y;
  };

  setAddressInInput(false);
  window.form.toggleForm(false);

  var onLoadSuccess = function () {
    window.cards.renderPins(data);
  };

  var onLoadError = function (errorText) {
    window.error.getErrorMessage(errorText);
  };

  // Активное состояние страницы
  var activatePage = function () {
    window.backend.load(onLoadSuccess, onLoadError);
    map.classList.remove('map--faded');
    window.form.toggleForm(true);
    setAddressInInput(true);
  };
  // Перевод страницы в активное состояние при клике, срабатывает один раз
  mapPinMain.addEventListener('mouseup', function () {
    activatePage();
  });
  // Перевод страницы в активное состояние при нажатии Enter
  mapPinMain.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      activatePage();
    }
  });

  window.map = {
    mapPinMain: mapPinMain,
    PIN_PEAK_HEIGHT: PIN_PEAK_HEIGHT,
    map: map,
    setAddressInInput: setAddressInInput,
    mapPinMainStartPosition: getMapPinMainStartPosition
  };
})();
