'use strict';
(function () {
  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';
  var URL_UPLOAD = 'https://js.dump.academy/keksobooking';
  var TIMEOUT = 10000;
  var ErrorText = {
    BAD_REQUEST: 'Неверный запрос.',
    ERROR_FORBIDDEN: 'Доступ запрещён.',
    ERROR_NOT_FOUND: 'Данные по запросу не найдены.',
    ERROR_SERVIS_UNAVAILABLE: 'Сервис временно недоступен.',
    ERROR_SERVER: 'Ошибка соединения.',
    ERROR_TIMEOUT: 'Сервер долго не отвечает.'
  };
  var createXhr = function (method, url, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    // Подписываемся на события 'load', 'error' и 'timeout'
    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          onSuccess(xhr.response);
          break;
        case 400:
          onError(ErrorText.BAD_REQUEST);
          break;
        case 403:
          onError(ErrorText.ERROR_FORBIDDEN);
          break;
        case 404:
          onError(ErrorText.ERROR_NOT_FOUND);
          break;
        case 503:
          onError(ErrorText.ERROR_SERVIS_UNAVAILABLE);
          break;
        default:
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError(ErrorText.ERROR_SERVER);
    });
    xhr.addEventListener('timeout', function () {
      onError(ErrorText.ERROR_TIMEOUT);
    });
    xhr.timeout = TIMEOUT; // Устанавливаем время соединения
    xhr.open(method, url); // Открываем соединение
    return xhr;
  };

  var load = function (onSuccess, onError) {
    createXhr('GET', URL_LOAD, onSuccess, onError).send(); // Делаем запрос и принимаем данные с сервера
  };

  var upload = function (onSuccess, onError, data) {
    createXhr('POST', URL_UPLOAD, onSuccess, onError).send(data); // Загружаем данные на сервер. data – объект с данными, которые необходимо отправить
  };

  window.backend = {
    load: load,
    upload: upload
  };
})();
