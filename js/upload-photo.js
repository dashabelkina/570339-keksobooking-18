'use strict';
(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var photoStyle = {
    avatarSrc: 'img/muffin-grey.svg',
    width: '70',
    height: '70',
    borderRadius: '5px'
  };
  var avatarFileChooser = document.querySelector('.ad-form-header__upload input[type=file]');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var photoFileChooser = document.querySelector('.ad-form__upload input[type=file]');
  var photoPreview = document.querySelector('.ad-form__photo');
  var photoContainer = document.querySelector('.ad-form__photo-container');

  var uploadPhotos = function (evt) {
    var target = evt.target;
    var file = target.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        if (evt.target === avatarFileChooser) {
          avatarPreview.src = reader.result;
        }
        if (evt.target === photoFileChooser) {
          var image = document.createElement('img');
          var imgWrapper = document.createElement('div');
          imgWrapper.className = 'ad-form__photo';
          imgWrapper.classList.add('ad-form__photo--upload');
          image.src = reader.result;
          image.width = photoStyle.width;
          image.height = photoStyle.height;
          image.style.borderRadius = photoStyle.borderRadius;
          imgWrapper.appendChild(image);
          photoContainer.insertBefore(imgWrapper, photoPreview);
        }
      });

      reader.readAsDataURL(file);
    }
  };

  var removePhotos = function () {
    avatarPreview.src = photoStyle.avatarSrc;
    avatarPreview.width = photoStyle.width;
    avatarPreview.height = photoStyle.height;
    window.utils.removeElements('.ad-form__photo img');
  };

  avatarFileChooser.addEventListener('change', uploadPhotos);
  photoFileChooser.addEventListener('change', uploadPhotos);

  var deactivatePhotos = function () {
    avatarFileChooser.removeEventListener('change', uploadPhotos);
    photoFileChooser.removeEventListener('change', uploadPhotos);
  };

  window.uploadPhotos = {
    deactivatePhotos: deactivatePhotos,
    removePhotos: removePhotos
  };
})();

