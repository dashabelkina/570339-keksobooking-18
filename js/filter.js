'use strict';
(function () {
  var filter = {
    type: 'any',
    price: 'any',
    rooms: 'any',
    guests: 'any',
    features: [],
  };

  var fieldHousingType = document.querySelector('#housing-type');
  var fieldHousingPrice = document.querySelector('#housing-price');
  var fieldHousingRooms = document.querySelector('#housing-rooms');
  var fieldHousingGuests = document.querySelector('#housing-guests');
  var fieldFeatures = document.querySelector('#housing-features');
  // Отрисовка меток с учетом фильтра
  var updateFilter = window.debounce(function (e) {
    window.cards.removeItems('.map__pin[type=button]');
    var target = e.target;
    filter[target.dataset.name] = target.value;
    window.cards.renderPins(filter);
  });
  // Отрисовка меток с учетом фильтра удобств
  var updateFilterFeatures = window.debounce(function (e) {
    window.cards.removeItems('.map__pin[type=button]');
    var target = e.target;
    filter.features = target.checked ?
      filter.features.concat(target.value) :
      filter.features.filter(function (el) {
        return el !== target.value;
      });
    window.cards.renderPins(filter);
  });
  // Условия фильтрации по типу жилья
  var filterType = function (el) {
    return filter.type === 'any' || el.offer.type === filter.type;
  };
  // Условия фильтрации по цене
  var filterPrice = function (el) {
    return filter.price === 'any' ||
      filter.price === 'low' && el.offer.price < 10000 ||
      filter.price === 'middle' && el.offer.price < 50000 && el.offer.price >= 10000 ||
      filter.price === 'high' && el.offer.price >= 50000;
  };
  // Условия фильтрации по числу комнат
  var filterRooms = function (el) {
    return filter.rooms === 'any' || el.offer.rooms === +filter.rooms;
  };
  // Условия фильтрации по числу гостей
  var filterGuests = function (el) {
    return filter.guests === 'any' || el.offer.guests === +filter.guests;
  };
  // Фильтрация по удобствам
  var filterFeatures = function (el) {
    return filter.features.every(function (item) {
      return el.offer.features.includes(item);
    });
  };
  // Фильтрация доступных объявлений по заданным условиям
  var filterAds = function (data) {
    return data.filter(filterType).filter(filterPrice).filter(filterRooms).filter(filterGuests).filter(filterFeatures);
  };

  // Подписываемся на события изменения фильтра
  fieldHousingType.addEventListener('change', updateFilter);
  fieldHousingPrice.addEventListener('change', updateFilter);
  fieldHousingRooms.addEventListener('change', updateFilter);
  fieldHousingGuests.addEventListener('change', updateFilter);
  fieldFeatures.addEventListener('change', updateFilterFeatures);

  var deactivateFilter = function () {
    fieldHousingType.removeEventListener('change', updateFilter);
    fieldHousingPrice.removeEventListener('change', updateFilter);
    fieldHousingRooms.removeEventListener('change', updateFilter);
    fieldHousingGuests.removeEventListener('change', updateFilter);
    fieldFeatures.removeEventListener('change', updateFilterFeatures);
  };

  window.filter = {
    filterAds: filterAds,
    deactivateFilter: deactivateFilter
  };
})();
