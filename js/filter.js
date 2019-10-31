'use strict';
(function () {
  var filter = {
    type: 'any',
    price: 'any',
    rooms: 'any',
    guests: 'any',
    features: [],
  };

  var price = {
    min: 10000,
    max: 50000
  };

  var mapFilter = document.querySelector('.map__filters');
  // Отрисовка меток с учетом фильтра
  var updateFilter = window.debounce(function (e) {
    window.utils.removeElements('.map__pin[type=button]');
    var target = e.target;
    filter[target.dataset.filterType] = target.value;
    window.cards.renderPins(filter);
  });
  // Отрисовка меток с учетом фильтра удобств
  var updateFilterFeatures = window.debounce(function (e) {
    window.utils.removeElements('.map__pin[type=button]');
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
      filter.price === 'low' && el.offer.price < price.min ||
      filter.price === 'middle' && el.offer.price < price.max && el.offer.price >= price.min ||
      filter.price === 'high' && el.offer.price >= price.max;
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
  var changeForm = function (e) {
    if (e.target.tagName === 'SELECT') {
      updateFilter(e);
    }
    if (e.target.tagName === 'INPUT') {
      updateFilterFeatures(e);
    }
  };

  mapFilter.addEventListener('change', changeForm);

  var deactivateFilter = function () {
    mapFilter.removeEventListener('change', changeForm);
  };

  window.filter = {
    filterAds: filterAds,
    deactivateFilter: deactivateFilter
  };
})();
