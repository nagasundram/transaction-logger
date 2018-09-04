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
  $.ajax({
    url: CHART_URL + "?isMap=true",
    type: 'GET',
    success: function(result) {
      $("#loading").hide();
      var expenses = result.expenses;
      html = '';
      expenses.forEach(function(expense, index) {
        console.log(expense)
        // ["2018-09-03T14:22:00.000Z", "Groceries", 211, "HDFC Credit", "Shopping", "🥚 Mop, paste", "12.96056278982475,77.63648218482513", "", "https://app.box.com/s/gqhoblcfxr4yopplq6c8if5gka5dvfpa"]
        var date = new Date(expense[0]).toDateString() + ' ' + new Date(expense[0]).toLocaleTimeString(),
          bill = expense[8].length > 0 ? '<span class="right"><a target="_blank" href="' + expense[8] + '"><i class="tiny material-icons">receipt</i></a></span>' : '',
          sourceColor = expense[3].includes('Credit')? 'red-text' : 'green-text';
        var time = $("<time></time>").text(date.slice(4,-3)),
          source = $("<span></span>").text(expense[3]).attr('class', 'right ' + sourceColor),
          firstp = $("<p></p>").append(time).append(source),
          subCat = $("<span></span>").text(expense[1]),
          amount = $("<span></span>").append('<strong>₹ ' + expense[2] + '</strong>').attr('class', 'right'),
          secodp = $("<p></p>").append(subCat).append(amount),
          thirdp = $("<p></p>").text(expense[5]).attr('class', 'top-fix').append(bill),
          lidiv = $("<div></div>").append(firstp).append(secodp).append('<hr>').append(thirdp);
          var li;
          if(index <= 3){
            li = $("<li class='in-view'></li>").html(lidiv).attr('data-after', CAT_ICONS[expense[4]]);
          } else {
            li = $("<li></li>").html(lidiv).attr('data-after', CAT_ICONS[expense[4]]);
          }
        $('#list .timeline ul').append(li)
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