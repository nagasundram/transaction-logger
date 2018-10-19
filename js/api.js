$(function() {
  $(document).ready(function() {
    getFromRubyAPi(0);
    $('th').on('click', function(e) {
      var sortBy = $(e.target).data('sort');
      getFromRubyAPi(sortBy)
    })
  })
})

function getFromRubyAPi(sortBy) {
  $.ajax({
    url: RUBY_API_ENDPOINT + "?sort_by=" + sortBy,
    type: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    success: function(result) {
      $('#apiTable').html(result.html)
    }
  });
}