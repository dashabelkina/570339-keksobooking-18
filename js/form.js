'use strict';
(function () {

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
    switch (true) {
      case +rooms === 100 && +capacity !== 0:
        adFormCapacity.setCustomValidity('Этот вариант не для гостей');
        break;
      case +capacity === 0 && +rooms !== 100:
        adFormRoomsNumber.setCustomValidity('Можно выбрать только 100 комнат');
        break;
      case +rooms < +capacity && +capacity !== 0:
        adFormRoomsNumber.setCustomValidity('В тесноте, в духоте и на всех в обиде. Выберете больше комнат');
        break;
      default:
        adFormCapacity.setCustomValidity('');
        adFormRoomsNumber.setCustomValidity('');
    }
  };

  adFormRoomsNumber.addEventListener('change', setRatioRoomsAndCapacity);
  adFormCapacity.addEventListener('change', setRatioRoomsAndCapacity);

  // Поле «Тип жилья» влияет на минимальное значение поля «Цена за ночь»
  var onTypeAndPriceChange = function () {
    var priceValue = OFFER_PRICE[typeSelect.value];
    priceInput.min = priceValue;
    priceInput.placeholder = priceValue;
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

  priceInput.addEventListener('change', function () {
    onTypeAndPriceChange();
    validityInput(priceInput);
  });

  var disableForm = function () {
    switchItemsState(mapFilters, true);
    switchItemsState(adFormElements, true);
    switchItemsState(adFormFieldsets, true);
    adForm.classList.add('ad-form--disabled');
  };

  var enableForm = function () {
    switchItemsState(mapFilters, false);
    switchItemsState(adFormElements, false);
    switchItemsState(adFormFieldsets, false);
    adForm.classList.remove('ad-form--disabled');
  };

  var toggleForm = function (isActive) {
    disableForm();
    if (isActive) {
      enableForm();
    }
  };
  // Действие при успешной отправке формы
  var formSubmitSuccessHandler = function () {
    window.success.getSuccessMessage();
    disableForm();
    window.map.map.classList.add('map--faded');
    window.cards.removePins();
    adForm.reset();
    window.map.mapPinMainStartPosition();
  };
  // Сообщение об ошибке при отправке данных
  var formSubmitErrorHandler = function (errorMessage) {
    window.error.getErrorMessage(errorMessage);
  };

  var formSubmitHandler = function (evt) {
    evt.preventDefault(); // Отменяем действие формы по умолчанию
    var data = new FormData(adForm); // Данные, которые будем передавать
    window.backend.upload(formSubmitSuccessHandler, formSubmitErrorHandler, data);
  };
  // Обработчик отправки формы
  adForm.addEventListener('submit', formSubmitHandler);

  window.form = {
    adForm: adForm,
    toggleForm: toggleForm
  };
})();
