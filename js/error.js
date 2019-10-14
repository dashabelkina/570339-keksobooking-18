'use strict';
(function () {

  var getErrorMessage = function (errorMessage) {
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorElement = errorTemplate.cloneNode(true);
    var main = document.querySelector('main');
    var errorBtn = errorElement.querySelector('.error__button');

    var onErrorEscDown = function (evt) {
      window.cards.onEscDown(evt, closeError);
    };

    var closeError = function () {
      main.removeChild(errorElement);
      errorBtn.removeEventListener('click', closeError);
      document.removeEventListener('click', closeError);
      document.removeEventListener('keydown', onErrorEscDown);
    };

    errorBtn.addEventListener('click', closeError);
    document.addEventListener('click', closeError);
    document.addEventListener('keydown', onErrorEscDown);

    errorElement.querySelector('.error__message').textContent = errorMessage;
    main.appendChild(errorElement);
  };

  window.error = {
    getErrorMessage: getErrorMessage
  };
})();
