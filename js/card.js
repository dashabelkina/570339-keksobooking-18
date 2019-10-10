/* eslint-disable no-undef */
'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var ESC_KEYCODE = 27;

  var wordsRoom = [' комната', ' комнаты', ' комнат'];
  var wordsGuest = [' гостя', ' гостей', ' гостей'];
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var map = document.querySelector('.map');
  var mapFilter = map.querySelector('.map__filters-container');
  var mapPins = document.querySelector('.map__pins');

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
      hideMapCards();
      var mapCard = getOfferCard(pin);
      mapCard.classList.remove('hidden');
      pinElement.classList.add('map__pin--active');
      window.form.setAddress(pinLocationX + ', ' + pinLocationY);
    };
    // Открытие карточки по клику
    pinElement.addEventListener('click', onMapCardClick);

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
  window.addEventListener('keyup', function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      hideMapCards();
    }
  });

  var renderPins = function (data) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < window.data.length; i++) {
      fragment.appendChild(generatePin(data[i]));
    }
    mapPins.appendChild(fragment);
  };

  var featureTemplate = '<li class="popup__feature popup__feature--{{x}}"></li>';
  var photoTemplate = '<img src="{{x}}" class="popup__photo" width="45" height="40" alt="Фотография жилья">';

  var getStringCapacity = function (rooms, guests) {
    var string = rooms + ' ' + getDeclensionWord(rooms, wordsRoom) + ' для ' + guests + ' ' + getDeclensionWord(guests, wordsGuest);
    return string;
  };

  var getOfferCard = function (offerCards) {
    var cardElement = document.querySelector('[data-id="' + offerCards.offer.id + '"]');
    if (cardElement) {
      return cardElement;
    } // Проверяем есть ли элемент в DOMе

    var cardFragment = document.createDocumentFragment();
    cardElement = cardTemplate.cloneNode(true);

    cardElement.dataset.id = offerCards.offer.id; // Добавляем dataset.id чтобы потом найти нужную карточку
    cardElement.classList.add('hidden'); // Сразу добавляем класс hidden, иначе не корректно срабатывает функция открытия карточки
    cardElement.querySelector('.popup__title').textContent = offerCards.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = offerCards.offer.address;
    cardElement.querySelector('.popup__text--price').innerHTML = offerCards.offer.price + '&#x20bd;<span>/ночь</span>';
    cardElement.querySelector('.popup__type').textContent = offerCards.offer.typeName;
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

  window.cards = {
    renderPins: renderPins
  };
})();
