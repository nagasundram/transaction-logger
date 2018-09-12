$(function() {
  $(document).ready(function() {
    var day = moment().day(),
      hour = moment().hour()
    key = (day == 0 || day == 6) ? 'WE' + hour : hour;
    $('#suggestions').empty();
    if (TIMELY_SUGGESTIONS[key]) {
      TIMELY_SUGGESTIONS[key].forEach(function(item) {
        var text = SUGGESTIONS[item][3],
          color = SUGGESTIONS[item][4],
          btn = $("<button></button>").attr('class', 'btn-floating btn-small ' + color).text(text).attr('onClick', 'fillSuggestion("' + item + '");');
        $('#suggestions').append(btn);
      })
    }
  })
})

function fillSuggestion(key) {
  $('#source option[value="' + SUGGESTIONS[key][0] + '"]').prop('selected', true)
  $('#source').formSelect('destroy').formSelect().change();

  $('#category option[value="' + SUGGESTIONS[key][1] + '"]').prop('selected', true)
  $('#category').formSelect('destroy').formSelect().change();

  $('#subCategory option[value="' + SUGGESTIONS[key][2] + '"]').prop('selected', true)
  $('#subCategory').formSelect('destroy').formSelect().change();

  $('#comments').val(SUGGESTIONS[key][5]).trigger('focus');
  $('#amount').trigger('focus')
};