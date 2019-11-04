'use strict';
(function () {
  var validationText = {
    notForGuests: 'Этот вариант не для гостей',
    noOptions: 'Можно выбрать только 100 комнат',
    moreRooms: 'В тесноте, в духоте и на всех в обиде. Выберете больше комнат'
  };

  var validityMap = {
    tooShort: 'Заголовок должен состоять минимум из 30 символов',
    tooLong: 'Заголовок не должен превышать 100 символов',
    valueMissing: 'Обязательное поле'
  };

  var OFFER_PRICE = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  var adForm = document.querySelector('.ad-form');
  var mapFilters = document.querySelector('.map__filters');
  var adFormElements = adForm.querySelectorAll('.ad-form__element');
  var adFormRoomsNumber = adForm.querySelector('#room_number');
  var adFormCapacity = adForm.querySelector('#capacity');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var titleInput = adForm.querySelector('#title');
  var priceInput = adForm.querySelector('#price');
  var typeSelect = adForm.querySelector('#type');
  var timeinSelect = adForm.querySelector('#timein');
  var timeoutSelect = adForm.querySelector('#timeout');

  var switchItemsState = function (array, state) {
    for (var i = 0; i < array.length; i++) {
      array[i].disabled = state;
    }
  };

  var setRatioRoomsAndCapacity = function () {
    var rooms = adFormRoomsNumber.value;
    var capacity = adFormCapacity.value;
    switch (true) {
      case +rooms === 100 && +capacity !== 0:
        adFormCapacity.setCustomValidity(validationText.notForGuests);
        break;
      case +capacity === 0 && +rooms !== 100:
        adFormRoomsNumber.setCustomValidity(validationText.noOptions);
        break;
      case +rooms < +capacity && +capacity !== 0:
        adFormRoomsNumber.setCustomValidity(validationText.moreRooms);
        break;
      default:
        adFormCapacity.setCustomValidity('');
        adFormRoomsNumber.setCustomValidity('');
    }
  };

  var onTypeAndPriceChange = function () {
    var priceValue = OFFER_PRICE[typeSelect.value];
    priceInput.min = priceValue;
    priceInput.placeholder = priceValue;
  };

  var setParTime = function (input, value) {
    input.value = value;
  };

  var onTimeoutInputChange = function () {
    setParTime(timeinSelect, timeoutSelect.value);
  };

  var onTimeinInputChange = function () {
    setParTime(timeoutSelect, timeinSelect.value);
  };

  var validityInput = function (input) {
    input.addEventListener('invalid', function () {
      input.setCustomValidity('');
      if (!input.validity.valid) {
        for (var i in input.validity) {
          if (input.validity[i] && validityMap[i]) {
            input.setCustomValidity(validityMap[i]);
          }
        }
      }
    });
  };

  validityInput(titleInput);

  var validityInputPrice = function () {
    onTypeAndPriceChange();
    validityInput(priceInput);
  };

  var addFormListeners = function () {
    adFormRoomsNumber.addEventListener('change', setRatioRoomsAndCapacity);
    adFormCapacity.addEventListener('change', setRatioRoomsAndCapacity);
    typeSelect.addEventListener('change', onTypeAndPriceChange);
    timeinSelect.addEventListener('change', onTimeinInputChange);
    timeoutSelect.addEventListener('change', onTimeoutInputChange);
    priceInput.addEventListener('change', validityInputPrice);
    adForm.addEventListener('submit', formSubmitHandler);
  };

  var removeFormListeners = function () {
    adFormRoomsNumber.removeEventListener('change', setRatioRoomsAndCapacity);
    adFormCapacity.removeEventListener('change', setRatioRoomsAndCapacity);
    typeSelect.removeEventListener('change', onTypeAndPriceChange);
    timeinSelect.removeEventListener('change', onTimeinInputChange);
    timeoutSelect.removeEventListener('change', onTimeoutInputChange);
    priceInput.removeEventListener('change', validityInputPrice);
    adForm.removeEventListener('submit', formSubmitHandler);
  };

  var disableForm = function () {
    switchItemsState(mapFilters, true);
    switchItemsState(adFormElements, true);
    switchItemsState(adFormFieldsets, true);
    adForm.classList.add('ad-form--disabled');
    removeFormListeners();
  };

  var enableForm = function () {
    switchItemsState(mapFilters, false);
    switchItemsState(adFormElements, false);
    switchItemsState(adFormFieldsets, false);
    adForm.classList.remove('ad-form--disabled');
    addFormListeners();
  };

  var toggleForm = function (isActive) {
    disableForm();
    if (isActive) {
      enableForm();
    }
  };

  var formSubmitSuccessHandler = function () {
    window.success.createSuccessMessage();
    disableForm();
    window.map.map.classList.add('map--faded');
    window.utils.removeElements('.map__pin[type=button]');
    window.utils.removeElements('.map__card');
    mapFilters.reset();
    adForm.reset();
    window.filter.deactivateFilter();
    window.map.mapPinMainStartPosition();
  };

  var formSubmitErrorHandler = function (errorMessage) {
    window.error.createErrorMessage(errorMessage);
  };

  var formSubmitHandler = function (evt) {
    evt.preventDefault();
    var data = new FormData(adForm);
    window.backend.upload(formSubmitSuccessHandler, formSubmitErrorHandler, data);
  };

  window.form = {
    adForm: adForm,
    toggleForm: toggleForm
  };
})();
