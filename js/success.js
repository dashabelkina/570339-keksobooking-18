'use strict';
(function () {

  var getSuccessMessage = function () {
    var successTemplate = document.querySelector('#success').content.querySelector('.success');
    var successElement = successTemplate.cloneNode(true);
    var main = document.querySelector('main');

    var onSuccessEscDown = function (evt) {
      window.cards.onEscDown(evt, closeSuccess);
    };

    var closeSuccess = function () {
      main.removeChild(successElement);
      document.removeEventListener('click', closeSuccess);
      document.removeEventListener('keydown', onSuccessEscDown);
    };

    document.addEventListener('click', closeSuccess);
    document.addEventListener('keydown', onSuccessEscDown);

    main.appendChild(successElement);
  };

  window.success = {
    getSuccessMessage: getSuccessMessage
  };
})();
