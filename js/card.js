'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var ESC_KEYCODE = 27;
  var PINS_COUNT = 5;
  var wordsRoom = [' комната', ' комнаты', ' комнат'];
  var wordsGuest = [' гостя', ' гостей', ' гостей'];
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var mapFilter = document.querySelector('.map__filters-container');
  var mapPins = document.querySelector('.map__pins');
  // Данные, которые мы получаем с сервера
  var pinsData;

  var setData = function (data) {
    pinsData = data;
  };

  var generatePin = function (pin) {
    var pinElement = pinTemplate.cloneNode(true);
    var pinImage = pinElement.querySelector('img');
    var pinLocationX = pin.location.x;
    var pinLocationY = pin.location.y;
    pinElement.style = 'left:' + (pinLocationX - PIN_WIDTH / 2) + 'px; top:' + (pinLocationY - PIN_HEIGHT) + 'px';
    pinImage.src = pin.author.avatar;
    pinImage.alt = pin.offer.title;
    // Открытие карточки объявления
    var onPinItemClick = function () {
      var mapCardRemovable = window.map.map.querySelector('.map__card');
      if (mapCardRemovable) {
        mapCardRemovable.remove();
      }
      getOfferCard(pin);
    };
    pinElement.addEventListener('click', onPinItemClick);
    return pinElement;
  };
  // Функция закрытия карточки
  var hideMapCards = function () {
    var pin = document.querySelector('.map__pin--active');
    var card = document.querySelector('.map__card:not(.hidden)');
    if (card) {
      card.classList.add('hidden');
    }
    if (pin) {
      pin.classList.remove('map__pin--active');
    }
  };
  // Закрываем окно по нажатию клавиши Esc
  document.addEventListener('keyup', function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      hideMapCards();
    }
  });
  // Если применен фильтр – фильтруем объявления, иначе возвращаем все доступные, но не больше пяти в обоих случаях.
  var renderPins = function (filter) {
    removeItems('.map__card');
    var data = filter ? window.filter.filterAds(pinsData) : pinsData;
    var fragment = document.createDocumentFragment();
    var min = Math.min(data.length, PINS_COUNT);
    for (var i = 0; i < min; i++) {
      fragment.appendChild(generatePin(data[i]));
    }
    mapPins.appendChild(fragment);
  };
  // Функция удаления карточек и меток
  var removeItems = function (selector) {
    var item = document.querySelectorAll(selector);
    item.forEach(function (it) {
      it.remove();
    });
  };

  var featureTemplate = '<li class="popup__feature popup__feature--{{x}}"></li>';
  var photoTemplate = '<img src="{{x}}" class="popup__photo" width="45" height="40" alt="Фотография жилья">';

  var getStringCapacity = function (rooms, guests) {
    var string = rooms + ' ' + window.utils.getDeclensionWord(rooms, wordsRoom) + ' для ' + guests + ' ' + window.utils.getDeclensionWord(guests, wordsGuest);
    return string;
  };
  var onEscDown = function (evt, func) {
    if (evt.keyCode === ESC_KEYCODE) {
      func();
    }
  };
  var getOfferCard = function (offerCards) {
    var cardFragment = document.createDocumentFragment();
    var cardElement = cardTemplate.cloneNode(true);

    cardElement.querySelector('.popup__title').textContent = offerCards.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = offerCards.offer.address;
    cardElement.querySelector('.popup__text--price').innerHTML = offerCards.offer.price + '&#x20bd;<span>/ночь</span>';
    cardElement.querySelector('.popup__type').textContent = offerCards.offer.typeName;
    cardElement.querySelector('.popup__text--capacity').textContent = getStringCapacity(offerCards.offer.rooms, offerCards.offer.guests);
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offerCards.offer.checkin + ', выезд до ' + offerCards.offer.checkout;
    cardElement.querySelector('.popup__features').innerHTML = window.utils.getTemplate(offerCards.offer.features, featureTemplate);
    cardElement.querySelector('.popup__description').textContent = offerCards.offer.description;
    cardElement.querySelector('.popup__photos').innerHTML = window.utils.getTemplate(offerCards.offer.photos, photoTemplate);
    cardElement.querySelector('.popup__avatar').setAttribute('src', offerCards.author.avatar);

    cardFragment.appendChild(cardElement);
    window.map.map.insertBefore(cardFragment, mapFilter);

    var closeCardBtn = cardElement.querySelector('.popup__close');
    var closeCard = function () {
      cardElement.remove();
      closeCardBtn.removeEventListener('click', onCloseCardClick);
      document.removeEventListener('keydown', onCardEscDown);
    };
    var onCloseCardClick = function () {
      closeCard();
    };
    closeCardBtn.addEventListener('click', onCloseCardClick);
    var onCardEscDown = function (evt) {
      onEscDown(evt, closeCard);
    };
    document.addEventListener('keydown', onCardEscDown);

    return cardElement;
  };

  window.cards = {
    setData: setData,
    renderPins: renderPins,
    onEscDown: onEscDown,
    removeItems: removeItems
  };
})();
