'use strict';

var OFFERS_COUNT = 8;
var OFFERS_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var CHECKINS = ['12:00', '13:00', '14:00'];
var CHECKOUTS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var MIN_LOCATION_Y = 130;
var MAX_LOCATION_Y = 630;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var PIN_PEAK_HEIGHT = 20;
var PHOTOS_AMOUNT = 3;
var OFFER_TYPES = {
  FLAT: 'Квартира',
  BUNGALO: 'Бунгало',
  HOUSE: 'Дом',
  PALACE: 'Дворец',
};
var OFFER_PRICE = {
  'bungalo': 0,
  'flat': 1000,
  'house': 5000,
  'palace': 10000
};
var ENTER_KEYCODE = 13;
var ESC_KEYCODE = 27;
var wordsRoom = [' комната', ' комнаты', ' комнат'];

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

var getPhotos = function () {
  var photos = [];
  var randomPhotos = getRandomNumberInRange(1, PHOTOS_AMOUNT);
  for (var i = 1; i <= randomPhotos; i++) {
    photos.push('http://o0.github.io/assets/images/tokyo/hotel' + i + '.jpg');
  }
  return photos;
};

var getMockOffers = function () {
  var mocks = [];
  for (var i = 0; i < OFFERS_COUNT; i++) {
    var avatar = 'img/avatars/user0' + (i + 1) + '.png';
    var title = OFFERS_TITLES[getRandomNumberInRange(0, OFFERS_TITLES.length)];
    var price = getRandomNumberInRange(100, 100000);
    var type = OFFER_TYPES[getRandomNumberInRange(0, OFFER_TYPES.length)];
    var rooms = getRandomNumberInRange(1, 15);
    var guests = getRandomNumberInRange(1, 30);
    var checkin = CHECKINS[getRandomNumberInRange(0, CHECKINS.length)];
    var checkout = CHECKOUTS[getRandomNumberInRange(0, CHECKOUTS.length)];
    var features = shuffleArray(FEATURES);
    var photos = getPhotos(PHOTOS_AMOUNT);
    var locationX = getRandomNumberInRange(0, map.clientWidth);
    var locationY = getRandomNumberInRange(MIN_LOCATION_Y, MAX_LOCATION_Y);

    mocks.push({
      author: {
        avatar: avatar,
      },
      offer: {
        title: title,
        address: locationX + ', ' + locationY,
        price: price,
        type: type,
        rooms: rooms,
        guests: guests,
        checkin: checkin,
        checkout: checkout,
        features: features,
        description: 'Описание',
        photos: photos
      },
      location: {
        x: locationX,
        y: locationY
      }
    });
  }
  return mocks;
};

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var generatePin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);
  var pinImage = pinElement.querySelector('img');
  var pinLocationX = pin.location.x;
  var pinLocationY = pin.location.y;
  pinElement.style = 'left:' + (pinLocationX - PIN_WIDTH / 2) + 'px; top:' + (pinLocationY - PIN_HEIGHT) + 'px';
  pinImage.src = pin.author.avatar;
  pinImage.alt = pin.offer.title;
  // Открытие карточки объявления
  var onMapCardClick = function () {
    var mapCard = getOfferCard(pin);
    hideMapCards(pin.offer.title);
    mapCard.classList.toggle('hidden');
  };
  // Открытие карточки по клику
  pinElement.addEventListener('click', onMapCardClick);

  return pinElement;
};
// Функция закрытия карточки. Находим не скрытое окно и добавляем класс hidden
var hideMapCards = function (title) {
  document.querySelectorAll('.map__card:not(.hidden)').forEach(function (element) {
    if (!title || element.dataset.id !== title) {
      element.classList.add('hidden');
    }
  });
};
// Закрываем окно по нажатию клавиши Esc
window.addEventListener('keyup', function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    hideMapCards();
  }
});

var mapPins = document.querySelector('.map__pins');

var renderPins = function () {
  var fragment = document.createDocumentFragment();
  var mock = getMockOffers();
  for (var i = 0; i < mock.length; i++) {
    fragment.appendChild(generatePin(mock[i]));
  }
  mapPins.appendChild(fragment);
};

var map = document.querySelector('.map');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var mapFilter = map.querySelector('.map__filters-container');

var getDeclensionWordRoom = function (n, words) {
  return words[(n % 100 > 4 && n % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][Math.min(n % 10, 5)]];
};

var getDeclensionWordGuest = function (n) {
  return (n === 1) ? ' гостя' : ' гостей';
};

var featureTemplate = '<li class="popup__feature popup__feature--{{x}}"></li>';
var photoTemplate = '<img src="{{x}}" class="popup__photo" width="45" height="40" alt="Фотография жилья">';

var getTemplate = function (data, tpl) {
  var result = '';
  for (var i = 0; i < data.length; i++) {
    result += tpl.replace('{{x}}', data[i]);
  }
  return result;
};

var getStringCapacity = function (rooms, guests) {
  var string = rooms + ' ' + getDeclensionWordRoom(rooms, wordsRoom) + ' для ' + guests + ' ' + getDeclensionWordGuest(guests);
  return string;
};

var getOfferCard = function (offerCards) {
  var cardElement = document.querySelector('[data-id="' + offerCards.offer.title + '"]');
  if (cardElement) {
    return cardElement;
  } // Проверяем есть ли элемент в DOMе

  var cardFragment = document.createDocumentFragment();
  cardElement = cardTemplate.cloneNode(true);

  cardElement.dataset.id = offerCards.offer.title; // Добавляем dataset.id чтобы потом найти нужную карточку
  cardElement.classList.add('hidden'); // Сразу добавляем класс hidden, иначе не корректно срабатывает функция открытия карточки
  cardElement.querySelector('.popup__title').textContent = offerCards.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = offerCards.offer.address;
  cardElement.querySelector('.popup__text--price').innerHTML = offerCards.offer.price + '&#x20bd;<span>/ночь</span>';
  cardElement.querySelector('.popup__type').textContent = OFFER_TYPES[offerCards.offer.type];
  cardElement.querySelector('.popup__text--capacity').textContent = getStringCapacity(offerCards.offer.rooms, offerCards.offer.guests);
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offerCards.offer.checkin + ', выезд до ' + offerCards.offer.checkout;
  cardElement.querySelector('.popup__features').innerHTML = getTemplate(offerCards.offer.features, featureTemplate);
  cardElement.querySelector('.popup__description').textContent = offerCards.offer.description;
  cardElement.querySelector('.popup__photos').innerHTML = getTemplate(offerCards.offer.photos, photoTemplate);
  cardElement.querySelector('.popup__avatar').setAttribute('src', offerCards.author.avatar);

  cardFragment.appendChild(cardElement);
  map.insertBefore(cardFragment, mapFilter);
  // Закрываем карточку при клике по иконке
  cardElement.querySelector('.popup__close').addEventListener('click', hideMapCards);
  return cardElement;
};

var objList = getMockOffers(OFFERS_COUNT);
var adForm = document.querySelector('.ad-form');
var address = adForm.querySelector('#address');
var mapFilters = document.querySelector('.map__filters');
var adFormElements = adForm.querySelectorAll('.ad-form__element');
var mapPinMain = document.querySelector('.map__pin--main');
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
// Координаты пина
var pinMainX = Math.round(parseInt(mapPinMain.style.left, 10) + PIN_WIDTH / 2);
var pinMainY = Math.round(parseInt(mapPinMain.style.top, 10) + PIN_HEIGHT);
var pinDeactivateMainY = Math.round(parseInt(mapPinMain.style.top, 10) + (PIN_HEIGHT - PIN_PEAK_HEIGHT) / 2);
var getCoordinatesPinMain = function () {
  return pinMainX + ', ' + pinMainY;
};
var getCoordinatesPinMainPeak = function () {
  return pinMainX + ', ' + pinDeactivateMainY;
};
// Активное состояние страницы
var activatePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  adFormFieldsets.forEach(function (item) {
    item.disabled = false;
  });
  switchItemsState(mapFilters, false);
  switchItemsState(adFormElements, false);
  renderPins(objList);
  address.value = getCoordinatesPinMain();
};
// Неактивное состояние страницы
var deactivatePage = function () {
  map.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');
  adFormFieldsets.forEach(function (item) {
    item.disabled = true;
  });
  switchItemsState(mapFilters, true);
  switchItemsState(adFormElements, true);
  address.value = getCoordinatesPinMainPeak();
};
deactivatePage();
// Перевод страницы в активное состояние при клике, срабатывает один раз
mapPinMain.addEventListener('mouseup', function () {
  activatePage();
}, {once: true});
// Перевод страницы в активное состояние при нажатии Enter
mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    activatePage();
  }
});
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
