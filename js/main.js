'use strict';

var totalNumber = 8;
var mockAvatar = ['img/avatars/user01.png', 'img/avatars/user02.png', 'img/avatars/user03.png', 'img/avatars/user04.png', 'img/avatars/user05.png', 'img/avatars/user06.png', 'img/avatars/user07.png', 'img/avatars/user08.png'];
var mockTitle = ['Заголовок01', 'Заголовок02', 'Заголовок03', 'Заголовок04', 'Заголовок05', 'Заголовок06', 'Заголовок07', 'Заголовок08'];
var mockType = ['palace', 'flat', 'house', 'bungalo'];
var mockCheckin = ['12:00', '13:00', '14:00'];
var mockCheckout = ['12:00', '13:00', '14:00'];
var mockFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var mockDescription = ['Описание01', 'Описание02', 'Описание03', 'Описание04', 'Описание05', 'Описание06', 'Описание07', 'Описание08'];
var mockPhotos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var minLocationX = 0;
var minLocationY = 130;
var maxLocationX = 1200;
var maxLocationY = 630;
var pinWidth = 50;
var pinHeight = 70;

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
  return array;
};

var getMock = function () {
  var mock = [];
  for (var i = 0; i < totalNumber; i++) {
    var title = mockTitle[getRandomNumberInRange(0, mockTitle.length)];
    var price = getRandomNumberInRange(100, 100000);
    var type = mockType[getRandomNumberInRange(0, mockType.length)];
    var rooms = getRandomNumberInRange(1, 15);
    var guests = getRandomNumberInRange(1, 30);
    var checkin = mockCheckin[getRandomNumberInRange(0, mockCheckin.length)];
    var checkout = mockCheckin[getRandomNumberInRange(0, mockCheckout.length)];
    var features = shuffleArray(mockFeatures).slice(0, getRandomNumberInRange(0, mockFeatures.length));
    var description = mockDescription[getRandomNumberInRange(0, mockDescription.length)];
    var photos = shuffleArray(mockPhotos).slice(0, getRandomNumberInRange(0, mockPhotos.length));
    var locationX = getRandomNumberInRange(minLocationX + pinWidth, maxLocationX) - pinWidth;
    var locationY = getRandomNumberInRange(minLocationY - pinHeight, maxLocationY - pinHeight);

    mock.push({
      author: {
        avatar: mockAvatar[i],
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
        description: description,
        photos: photos
      },
      location: {
        x: locationX,
        y: locationY
      }
    });
  }
  return mock;
};

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var generatePin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);
  var pinImage = pinElement.querySelector('img');
  var pinLocationX = pin.location.x;
  var pinLocationY = pin.location.y;
  pinElement.style = 'left:' + pinLocationX + 'px; top:' + pinLocationY + 'px';
  pinImage.src = pin.author.avatar;
  pinImage.alt = pin.offer.title;
  return pinElement;
};

var renderPins = function () {
  var fragment = document.createDocumentFragment();
  var mock = getMock(totalNumber);
  for (var i = 0; i < totalNumber; i++) {
    fragment.appendChild(generatePin(mock[i]));
  }
  var mapPins = document.querySelector('.map__pins');
  mapPins.appendChild(fragment);
};

var map = document.querySelector('.map');
map.classList.remove('map--faded');

renderPins();
