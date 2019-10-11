'use strict';
(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var PIN_PEAK_HEIGHT = 20;
  var ENTER_KEYCODE = 13;

  var map = document.querySelector('.map');
  var mapPinMain = document.querySelector('.map__pin--main');
  // Координаты пина
  var pinMainX = Math.round(parseInt(mapPinMain.style.left, 10) + PIN_WIDTH / 2);
  var pinMainY = Math.round(parseInt(mapPinMain.style.top, 10) + PIN_HEIGHT);
  var pinDeactivateMainY = Math.round(parseInt(mapPinMain.style.top, 10) + (PIN_HEIGHT - PIN_PEAK_HEIGHT) / 2);
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
  setAddressInInput(false);
  window.form.toggleForm(false);
  // Активное состояние страницы
  var activatePage = function () {
    map.classList.remove('map--faded');
    window.form.toggleForm(true);
    window.cards.renderPins(data);
    setAddressInInput(true);
  };
  // Перевод страницы в активное состояние при клике, срабатывает один раз
  mapPinMain.addEventListener('mouseup', function () {
    activatePage();
  }, {once: true});
  // Перевод страницы в активное состояние при нажатии Enter
  mapPinMain.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      activatePage();
    }
  }, {once: true});

  window.map = {
    setAddressInInput: setAddressInInput
  };
})();
