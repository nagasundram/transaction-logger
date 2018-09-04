$(function() {
  $(document).ready(function() {
    $('#listTgr').on('click', function(e) {
      $('#addTransaction').show();
      $('#expensesMap').show();
      $('#listTgr').hide();
      $("#form_card").hide();
      $("#map").hide();
      $("#list").show()
      $("#loading").show();
      getList();
    })
  });
})

function getList() {
  M.FloatingActionButton.getInstance($('#float-container')).close();
  $('#float-container').floatingActionButton();
  $('#list .timeline ul').empty();
  $.ajax({
    url: CHART_URL + "?isMap=true",
    type: 'GET',
    success: function(result) {
      $("#loading").hide();
      var expenses = result.expenses;
      expenses.forEach(function(expense, index) {
        var date = moment(expense[0]).format("DD-MM-YYYY HH:mm"),
          bill = expense[8].length > 0 ? '<span class="right"><a target="_blank" href="' + expense[8] + '"><i class="tiny material-icons">receipt</i></a></span>' : '',
          sourceColor = expense[3].includes('Credit')? 'red-text' : 'green-text';
        var time = $("<time></time>").text(date),
          source = $("<span></span>").text(expense[3]).attr('class', 'right ' + sourceColor),
          firstp = $("<p></p>").append(time).append(source),
          subCat = $("<span></span>").text(expense[1]),
          amount = $("<span></span>").append('<strong>₹ ' + expense[2] + '</strong>').attr('class', 'right'),
          secodp = $("<p></p>").append(subCat).append(amount),
          info = $("<span></span>").text(expense[5]).attr('class', 'info-txt'),
          thirdp = $("<p></p>").append(info).append(bill).attr('style', 'min-height: 20px;'),
          lidiv = $("<div></div>").append(firstp).append(secodp).append('<hr>').append(thirdp);
          var li;
          if(index <= 3){
            li = $("<li></li>").html(lidiv).attr('data-after', CAT_ICONS[expense[4]]).attr('class', 'in-view ' + expense[3].replace(' ', ''));
          } else {
            li = $("<li></li>").html(lidiv).attr('data-after', CAT_ICONS[expense[4]]).attr('class', expense[3].replace(' ', ''));
          }
        $('#list .timeline ul').append(li);
      })
      timlineAnimation();
    }
  });
}


function timlineAnimation() {

  'use strict';

  // define variables
  var items = document.querySelectorAll(".timeline li");

  // check if an element is in viewport
  // http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
  function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function callbackFunc() {
    for (var i = 0; i < items.length; i++) {
      if (isElementInViewport(items[i])) {
        items[i].classList.add("in-view");
      }
    }
  }

  // listen for events
  window.addEventListener("load", callbackFunc);
  window.addEventListener("resize", callbackFunc);
  window.addEventListener("scroll", callbackFunc);

};