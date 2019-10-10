'use strict';
(function () {

  var OFFER_PRICE = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  var adForm = document.querySelector('.ad-form');
  var address = adForm.querySelector('#address');
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

  // Функция для смены состояния элементов
  var switchItemsState = function (arr, state) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].disabled = state;
    }
  };

  // Проверка соответствия количества гостей с количеством комнат
  var setRatioRoomsAndCapacity = function () {
    var rooms = adFormRoomsNumber.value;
    var capacity = adFormCapacity.value;
    if (rooms < capacity) {
      adFormCapacity.setCustomValidity('В тесноте, в духоте и на всех в обиде. Выберете больше комнат');
    } else if (rooms >= capacity) {
      adFormCapacity.setCustomValidity('');
    }
  };

  adFormRoomsNumber.addEventListener('change', function () {
    setRatioRoomsAndCapacity();
  });

  adFormCapacity.addEventListener('change', function () {
    setRatioRoomsAndCapacity();
  });

  // Поле «Тип жилья» влияет на минимальное значение поля «Цена за ночь»
  var onTypeAndPriceChange = function () {
    priceInput.min = OFFER_PRICE[typeSelect.value];
    priceInput.placeholder = OFFER_PRICE[typeSelect.value];
  };

  typeSelect.addEventListener('change', onTypeAndPriceChange);
  // Поля «Время заезда» и «Время выезда» синхронизированы
  var setParTime = function (input, value) {
    input.value = value;
  };
  var onTimeoutInputChange = function () {
    setParTime(timeinSelect, timeoutSelect.value);
  };
  var onTimeinInputChange = function () {
    setParTime(timeoutSelect, timeinSelect.value);
  };

  timeinSelect.addEventListener('change', onTimeinInputChange);
  timeoutSelect.addEventListener('change', onTimeoutInputChange);
  // Валидация формы
  // Заголовок объявления и цена за ночь
  var validityMap = {
    tooShort: 'Заголовок должен состоять минимум из 30 символов',
    tooLong: 'Заголовок не должен превышать 100 символов',
    valueMissing: 'Обязательное поле'
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
  validityInput(priceInput);

  var disableForm = function (pinCoords) {
    switchItemsState(mapFilters, true);
    switchItemsState(adFormElements, true);
    adForm.classList.add('ad-form--disabled');
    adFormFieldsets.forEach(function (item) {
      item.disabled = true;
    });
    address.value = pinCoords;
  };

  var enableForm = function (pinCoords) {
    switchItemsState(mapFilters, false);
    switchItemsState(adFormElements, false);
    adForm.classList.remove('ad-form--disabled');
    adFormFieldsets.forEach(function (item) {
      item.disabled = false;
    });
    address.value = pinCoords;
  };

  var setPinAddress = function (coords) {
    address.value = coords;
  };

  window.form = {
    disable: disableForm,
    enable: enableForm,
    setAddress: setPinAddress
  };

})();
