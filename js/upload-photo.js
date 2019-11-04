'use strict';
(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var photoStyle = {
    width: '70',
    height: '70',
    borderRadius: '5px'
  };
  var avatarFileChooser = document.querySelector('.ad-form-header__upload input[type=file]');// fileChooser — компонент, который выбирает изображение
  var avatarPreview = document.querySelector('.ad-form-header__preview img');// preview — картинка куда мы будем выставлять загруженное изображение
  var photoFileChooser = document.querySelector('.ad-form__upload input[type=file]');
  var photoPreview = document.querySelector('.ad-form__photo');
  var photoContainer = document.querySelector('.ad-form__photo-container');

  var uploadPhotos = function (evt) {
    var target = evt.target;
    var file = target.files[0];// получаем файл
    var fileName = file.name.toLowerCase();// приводим имя файла к нижнему регистру, чтобы убедиться, что он является картинкой

    var matches = FILE_TYPES.some(function (it) { // принимаем на вход только картинки. Если имя файла заканчивается на it (расширение) – значит это изображение
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();// После того как файл выбран, его надо прочитать

      reader.addEventListener('load', function () {
        if (evt.target === avatarFileChooser) {
          avatarPreview.src = reader.result;// когда объект reader прочитает содержимое файла, записываем результат загрузки в путь файла
        }
        if (evt.target === photoFileChooser) { // создаем фотографию жилья
          var image = document.createElement('img');
          var newImage = document.createElement('div');
          newImage.className = 'ad-form__photo';
          newImage.classList.add('ad-form__photo--upload');
          image.src = reader.result;
          image.width = photoStyle.width;
          image.height = photoStyle.height;
          image.style.borderRadius = photoStyle.borderRadius;
          newImage.appendChild(image);
          photoContainer.insertBefore(newImage, photoPreview);
        }
      });

      reader.readAsDataURL(file);
    }
  };

  avatarFileChooser.addEventListener('change', uploadPhotos);
  photoFileChooser.addEventListener('change', uploadPhotos);

  var deactivatePhotos = function () {
    avatarFileChooser.removeEventListener('change', uploadPhotos);
    photoFileChooser.removeEventListener('change', uploadPhotos);
  };

  window.uploadPhotos = {
    deactivatePhotos: deactivatePhotos
  };
})();

