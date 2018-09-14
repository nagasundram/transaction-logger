$(function() {
  $(document).ready(function() {
    $('#listTgr').on('click', function(e) {
      $('#addTransaction').show();
      $('#expensesMap').show();
      $('#listTgr').hide();
      $("#form_card, #suggestions").hide();
      $("#map").hide();
      $("#list").show()
      $("#loading").show();
      $('#filter-slide').sidenav();
      getList();
    });
  })
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
      expenses.reverse().forEach(function(expense, index) {
        var date = moment(expense[0]).format("DD-MM-YYYY HH:mm"),
          bill;
        if (expense[8].length > 0) {
          if (expense[8].includes('app.box')) {
            bill = expense[8].length > 0 ? '<span class="right"><a target="_blank" href="' + expense[8] + '"><i class="tiny material-icons">receipt</i></a></span>' : '';
          } else {
            bill = expense[8].length > 0 ? '<span class="right"><a class="billImgLink" href="javascript:;" data-imgurl="' + expense[8] + '"><i class="tiny material-icons">receipt</i></a></span>' : '';
          }
        }
        var id,
          sourceColor = expense[3].includes('Credit') ? 'red-text' : 'green-text';
        if (moment(expense[0]).format("DD-MM-YYYY") == moment().format("DD-MM-YYYY")) {
          id = $('<a></a>').append("<i class='tiny material-icons timline-id'>info</i>").attr('class', 'expId').attr('data-id', expense[9]);
        }
        var time = $("<time></time>").text(date),
          source = $("<span></span>").text(expense[3]).attr('class', 'right ' + sourceColor),
          firstp = $("<p></p>").append(time).append(source),
          subCat = $("<span></span>").text(expense[1]),
          amount = $("<span></span>").append('<strong>₹ ' + expense[2] + '</strong>').attr('class', 'right'),
          secodp = $("<p></p>").append(subCat).append(amount),
          info = $("<span></span>").text(expense[5]).attr('class', 'info-txt'),
          thirdp = $("<p></p>").append(id).append(info).append(bill).attr('style', 'min-height: 20px;'),
          lidiv = $("<div></div>").append(firstp).append(secodp).append('<hr>').append(thirdp);
        var li;
        if (index <= 3) {
          li = $("<li></li>").html(lidiv).attr('data-after', CAT_ICONS_IOS[expense[4]]).attr('class', 'in-view ' + expense[3].replace(' ', ''));
        } else {
          li = $("<li></li>").html(lidiv).attr('data-after', CAT_ICONS_IOS[expense[4]]).attr('class', expense[3].replace(' ', ''));
        }
        $('#list .timeline ul').append(li);
      })
      imageLinkActionListener();
      expIdActionListener();
      timlineAnimation();
    }
  });
}

function imageLinkActionListener() {
  var imageLinks = $(".billImgLink");
  imageLinks.each(function() {
    imageLink = $(this);
    imageLink.on('click', function(event) {
      var imgurl = $(event.target).parent().data('imgurl');
      $('#imgDownloadLink').attr('href', imgurl);
      $('#imageModal').show().css('background-image', "url(" + imgurl + ")");
    })
  })
}

function expIdActionListener() {
  var expIds = $(".expId");
  expIds.each(function() {
    expID = $(this);
    expID.on('click', function(event) {
      var id = $(event.target).parent().data('id'),
        idDiv = $('<div class="watermark"></div>').append('<p class="water-text">' + id + '</p>')
      $.ajax({
        url: ACTION_URL + "?id=" + id + "&actionName=SHOW",
        type: 'GET',
        success: function(result) {
          $('#actionModal').modal();
          var infoDiv = $('<div></div>').attr('id', 'expense').attr('data-id', id).append(idDiv).append('<hr>' + result.split(',').join('<br><hr>') + '<hr>').attr('style', 'padding: 0px 6px 0 6px;');
          $('#actionModal').modal('open').find('.modal-content').empty().append(infoDiv)
          $('#actionModal').find('.modal-delete').attr('onclick', 'deleteExp(' + id + ')')
        }
      });
    })
  })
}

function deleteExp(id) {
  var ok = confirm("Want to remove? \n" + id);
  if (ok) {
    $.ajax({
      url: ACTION_URL + "?id=" + id + "&actionName=DESTROY",
      type: 'GET',
      success: function(result) {
        alert(result)
        $('#actionModal').modal('close');
        $('#list .timeline ul').empty();
        $('#listTgr').trigger('click');
      }
    });
  }
}

function timlineAnimation() {
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