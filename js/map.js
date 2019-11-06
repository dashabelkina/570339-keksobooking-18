'use strict';
(function () {
  var PIN_PEAK_HEIGHT = 16;
  var ENTER_KEYCODE = 13;

  var map = document.querySelector('.map');
  var mapPinMain = document.querySelector('.map__pin--main');
  var pinMainX = Math.round(parseInt(mapPinMain.style.left, 10));
  var pinMainY = Math.round(parseInt(mapPinMain.style.top, 10) + PIN_PEAK_HEIGHT);
  var pinDeactivateMainY = Math.round(parseInt(mapPinMain.style.top, 10));

  var setAddressInInput = function (isActive) {
    var addressInput = window.form.adForm.querySelector('input[name="address"]');
    var mapPinPosition = addressInput.value;
    addressInput.value = pinMainX + ', ' + pinDeactivateMainY;
    if (isActive) {
      addressInput.value = pinMainX + ', ' + pinMainY;
    }
    return mapPinPosition;
  };

  var mapPinMainStartPosition = function () {
    mapPinMain.style.left = pinMainX + 'px';
    mapPinMain.style.top = pinDeactivateMainY + 'px';
  };

  setAddressInInput(false);
  window.form.toggleForm(false);

  var onLoadSuccess = function (data) {
    window.cards.setData(data);
    window.cards.renderPins();
  };

  var onLoadError = function (errorText) {
    window.error.createErrorMessage(errorText);
  };

  var activatePage = function () {
    if (!map.classList.contains('map--faded')) {
      return;
    }
    window.backend.load(onLoadSuccess, onLoadError);
    map.classList.remove('map--faded');
    window.form.toggleForm(true);
    setAddressInInput(true);
  };

  mapPinMain.addEventListener('mouseup', function () {
    activatePage();
  });

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
    mapPinMainStartPosition: mapPinMainStartPosition
  };
})();
