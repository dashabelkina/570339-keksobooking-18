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

  var updateFilter = window.debounce(function (evt) {
    window.utils.removeElements('.map__pin[type=button]');
    var target = evt.target;
    filter[target.dataset.filterType] = target.value;
    window.cards.renderPins(filter);
  });

  var updateFilterFeatures = window.debounce(function (evt) {
    window.utils.removeElements('.map__pin[type=button]');
    var target = evt.target;
    filter.features = target.checked ?
      filter.features.concat(target.value) :
      filter.features.filter(function (element) {
        return element !== target.value;
      });
    window.cards.renderPins(filter);
  });

  var filterType = function (element) {
    return filter.type === 'any' || element.offer.type === filter.type;
  };

  var filterPrice = function (element) {
    return filter.price === 'any' ||
      filter.price === 'low' && element.offer.price < price.min ||
      filter.price === 'middle' && element.offer.price < price.max && element.offer.price >= price.min ||
      filter.price === 'high' && element.offer.price >= price.max;
  };

  var filterRooms = function (element) {
    return filter.rooms === 'any' || element.offer.rooms === +filter.rooms;
  };

  var filterGuests = function (element) {
    return filter.guests === 'any' || element.offer.guests === +filter.guests;
  };

  var filterFeatures = function (element) {
    return filter.features.every(function (item) {
      return element.offer.features.includes(item);
    });
  };

  var filterAds = function (data) {
    return data.filter(filterType).filter(filterPrice).filter(filterRooms).filter(filterGuests).filter(filterFeatures);
  };

  var changeForm = function (evt) {
    if (evt.target.tagName === 'SELECT') {
      updateFilter(evt);
    }
    if (evt.target.tagName === 'INPUT') {
      updateFilterFeatures(evt);
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
