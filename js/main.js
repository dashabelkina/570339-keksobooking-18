'use strict';

var OFFERS_COUNT = 8;
var OFFERS_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKINS = ['12:00', '13:00', '14:00'];
var CHECKOUTS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var MIN_LOCATION_Y = 130;
var MAX_LOCATION_Y = 630;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var PHOTOS_AMOUNT = 10;

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

var getPhotos = function (arr) {
  var photos = [];
  for (var i = 1; i <= arr.length; i++) {
    photos.push('http://o0.github.io/assets/images/tokyo/hotel' + i + '.jpg');
  }
  return photos;
};

var userPhotos = getPhotos(PHOTOS_AMOUNT);

var getMockOffer = function () {
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
    var photos = shuffleArray(userPhotos);
    var locationX = getRandomNumberInRange(0, map.clientWidth);
    var locationY = getRandomNumberInRange(MIN_LOCATION_Y, MAX_LOCATION_Y);

    mocks.push({
      author: {
        avatar: avatar,
      },
      offer: {
        title: title,
        address: 'locationX, locationY',
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
  return pinElement;
};

var renderPins = function () {
  var mapPins = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  var mock = getMockOffer();
  for (var i = 0; i < mock.length; i++) {
    fragment.appendChild(generatePin(mock[i]));
  }
  mapPins.appendChild(fragment);
};

var map = document.querySelector('.map');
map.classList.remove('map--faded');

renderPins();
