'use strict';
(function () {
  var filter = {
    type: 'any'
  };
  // Отрисовка меток с учетом фильтра
  var updateFilter = function (evt) {
    var target = evt.target;
    filter[target.name] = target.value;
    window.cards.renderPins(filter);
  };
  // Условия фильтрации по типу жилья
  var filterType = function (el) {
    return filter.type === 'any' || el.offer.type === filter.type;
  };
  // Фильтрация доступных объявлений по заданным условиям
  var apply = function (data) {
    return data.filter(filterType);
  };
  // Подписываемся на событие изменения фильтра
  document.querySelectorAll('.map__filters select').forEach(function (el) {
    el.addEventListener('change', updateFilter);
  });

  window.filter = {
    apply: apply
  };

})();
