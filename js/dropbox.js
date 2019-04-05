var $uploadCrop;
$(function() {
  $(document).ready(function() {
    $uploadCrop = $('#cropper').croppie({
      viewport: {
        width: 310,
        height: 550,
        type: 'squere'
      },
      quality: 0,
      enableZoom: true,
      showZoomer: false,
      enforceBoundary: true,
      enableExif: true,
      enableOrientation: true,
      enableResize: true,
      boundary: {
        width: 310,
        height: 550
      }
    });
    $('#filePreview, #fileError, #uploading, #billContainer, #imageModal, .crop').hide();
    $('#billImgUrl').val('');
    $('#dbFile').on('change', function(event) {
      uploadAndGetLink(event);
    });
    $('#amount').on('keyup', function() {
      if ($(this).val() >= 20) {
        $('#billContainer').show();
      } else {
        $('#billContainer').hide();
      }
    });
    $('#modalClose').on('click', function() {
      $('#imgDownloadLink').attr('href', '#!');
      $('#imageModal').hide().css('background-image', '').css('opacity', 0);
    })
    $('#rotate').on('click', function() {
      $uploadCrop.croppie('rotate', -90);
    });
  });
});

var uploadAndGetLink = function(event) {
  const dbx = new Dropbox.Dropbox({
    accessToken: DB_TOKEN
  });
  // var ok = confirm("Proceed to crop the image?");
  var ok = false;
  if (ok) {
    $(".crop").show();
    $('#form_card, #suggestions').hide();
    readFile(event.target);

    $('#uploadCropped').on('click', function(ev) {
      $uploadCrop.croppie('result', {
        type: 'base64',
        quality: 0.8,
        format: 'png'
      }).then(function(resp) {
        // popupResult({ src: resp });
        $('.crop').hide();
        $('#form_card, #suggestions').show();
        $('#filePreview').hide();
        $('#uploading').show();
        $('.submit-btn').attr('disabled', true);
        var file_name = $('#amount').val() + '-' + moment().format("DD-MM-YYYY_HH-mm") + '.' + 'png',
          imageData = _base64ToArrayBuffer(resp);
        res = dbx.filesUpload({ path: '/Bills/' + moment().format("DD-MM-YYYY") + "/" + file_name, contents: imageData })
          .then(function(response) {
            dbx.sharingCreateSharedLinkWithSettings({ path: response.path_display })
              .then(function(response) {
                $('#filePreview').show().attr('src', response.url + '&raw=1');
                $('#billImgUrl').val(response.url + '%26raw=1');
                $('#uploading').hide();
                $('.submit-btn').attr('disabled', false);
              })
              .catch(function(error) {
                $('#fileError').show();
                console.log(error);
              });
          })
          .catch(function(error) {
            $('#fileError').show();
            console.error(error);
          });


      });
    });

    function popupResult(result) {
      var html;
      if (result.html) {
        html = result.html;
      }
      if (result.src) {
        html = '<img src="' + result.src + '" />';
      }
      $("#result").html(html);
    }

    function readFile(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
          $uploadCrop.croppie('bind', {
            url: e.target.result
          });
          $('#cropper').addClass('ready');
        }
        reader.readAsDataURL(input.files[0]);
      } else {
        alert("Sorry - you're browser doesn't support the FileReader API");
      }
    }
  } else {
    var file = event.target.files[0],
      filePath = $("#dbFile").val(),
      file_ext = filePath.substr(filePath.lastIndexOf('.') + 1, filePath.length);
    file_name = $('#amount').val() + '-' + moment().format("DD-MM-YYYY_HH-mm") + '.' + file_ext;
    $('#filePreview').hide();
    $('#uploading').show();
    $('.submit-btn').attr('disabled', true);
    res = dbx.filesUpload({ path: '/Bills/' + moment().format("DD-MM-YYYY") + "/" + file_name, contents: file })
      .then(function(response) {
        dbx.sharingCreateSharedLinkWithSettings({ path: response.path_display })
          .then(function(response) {
            $('#filePreview').show().attr('src', response.url + '&raw=1');
            $('#billImgUrl').val(response.url + '%26raw=1');
            $('#uploading').hide();
            $('.submit-btn').attr('disabled', false);
          })
          .catch(function(error) {
            $('#fileError').show();
            console.log(error);
          });
      })
      .catch(function(error) {
        $('#fileError').show();
        console.error(error);
      });
  }

}

function _base64ToArrayBuffer(base64) {
  base64 = base64.split('data:image/png;base64,').join('');
  var binary_string = window.atob(base64),
    len = binary_string.length,
    bytes = new Uint8Array(len),
    i;

  for (i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}
