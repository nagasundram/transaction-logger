$(function() {
  $(document).ready(function() {
    $('#filePreview, #fileError, #uploading, #billContainer').hide();
    $('#billImgUrl').val('');
    $('#dbFile').on('change', function(event) {
      uploadAndGetLink(event);
    });
    $('#amount').on('keyup', function() {
      console.log($(this).val())
      if ($(this).val() >= 20) {
        $('#billContainer').show();
      } else {
        $('#billContainer').hide();
      }
    });
  });
});

var uploadAndGetLink = function(event) {
  const dbx = new Dropbox.Dropbox({
    accessToken: DB_TOKEN
  });
  var file = event.target.files[0],
    filePath = $("#dbFile").val(),
    file_ext = filePath.substr(filePath.lastIndexOf('.')+1,filePath.length);
    file_name = $('#amount').val() + '-' + moment().format("DD-MM-YYYY_HH-mm") + '.' + file_ext;
    $('#filePreview').hide();
    $('#uploading').show();
    $('.submit-btn').attr('disabled', true);
  res = dbx.filesUpload({ path: '/Bills/' + file_name, contents: file })
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