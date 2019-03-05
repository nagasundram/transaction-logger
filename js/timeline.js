$(function() {
  $(document).ready(function() {
    $("#listTgr").on("click", function(e) {
      $("#addTransaction, #budgetTgr, #expensesMap, #list, #loading").show();
      $("#budget-container, #listTgr, #form_card, #suggestions, #map").hide();
      $("#filter-slide").sidenav({ draggable: false });
      $("#expDate").datepicker();
      $("#summaryArea").removeClass("show-summary");
      $("#today").removeClass("show-today");
      $("#expDate").datepicker({
        onOpen: function() {
          var instance = M.Datepicker.getInstance($(".datepicker"));
          instance.options.minDate = new Date(moment().startOf("month"));
          instance.options.maxDate = new Date(moment().endOf("day"));
          instance.options.autoClose = true;
        },
        onDraw: function() {
          var instance = M.Datepicker.getInstance($(".datepicker"));
          instance.options.minDate = new Date(moment().startOf("month"));
          instance.options.maxDate = new Date(moment().endOf("day"));
          instance.options.autoClose = true;
        }
      });
      var subCatsHash = Object.values(CATEGORIES),
        dataHash = {};
      subCatsHash.forEach(function(hash, index) {
        $.extend(dataHash, hash);
      });
      $.map(dataHash, function(value, key) {
        return (dataHash[key] = null);
      });
      $("#searchQuery").autocomplete({
        data: dataHash
      });
      var amountSlider = document.getElementById("amount-slider");
      if (!amountSlider.noUiSlider) {
        noUiSlider.create(amountSlider, {
          start: [0, 20000],
          connect: true,
          step: 1,
          orientation: "horizontal",
          range: {
            min: 0,
            max: 20000
          }
        });
      }
      var skipValues = [
        document.getElementById("amountRangeLower"),
        document.getElementById("amountRangeUpper")
      ];
      amountSlider.noUiSlider.on("update", function(values, handle) {
        skipValues[handle].value = values[handle];
      });
      $(".rangeInput").on("change", function() {
        var lower = $("#amountRangeLower").val(),
          upper = $("#amountRangeUpper").val();
        amountSlider.noUiSlider.set([lower, upper]);
      });
      $(".rangeInput").on("focus", function(e) {
        document.getElementById(e.target.id).setSelectionRange(0, 99);
      });
      getList();
    });

    $("#applyFilter").on("click", function(e) {
      $("#filterBtn")
        .children()
        .addClass("green-text");
      applyFilter();
    });

    $("#resetFilter").on("click", function(e) {
      resetFilter();
    });

    $("#filterBtn").on("click", function(e) {
      $("#filter-slide").sidenav("open");
    });

    $("#monthTitle").on("click", function(e) {
      var monthsModal = $("<div>")
          .addClass("modal open")
          .attr("id", "monthsModal"),
        modalContent = $("<div>").addClass("modal-content"),
        monthCount = 0,
        maxPastMonth = "May 2018",
        mnthModalClose = $("<a>")
          .attr("id", "mnthModalClose")
          .html("&times;");
      modalContent.append(mnthModalClose);
      month = moment().format("MMMM YYYY");
      while (month != maxPastMonth) {
        var pastMonth = $("<div>")
          .append(month)
          .addClass("past-months");
        if ($(".mn-yr")[0].innerText == month) {
          pastMonth.addClass("teal-text");
        }
        modalContent.append(pastMonth);
        monthCount++;
        month = moment()
          .subtract(monthCount, "months")
          .format("MMMM YYYY");
      }
      monthsModal.append(modalContent);
      $("#list").append(monthsModal);
      monthsActionListener();
    });
  });
});

function getList(
  monthSheetName = moment().format("MMMM YYYY"),
  closeMonthModal = false
) {
  M.FloatingActionButton.getInstance($("#float-container")).close();
  $("#float-container").floatingActionButton();
  $("#list .timeline ul").empty();
  $("#filterBtn").hide();
  $("#loading").show();
  for (var i = 0; i < 5; i++) {
    var date = "---------- --:--",
      sourceColor = "green-text";
    var time = $("<time></time>").text(date),
      source = $("<span></span>")
        .text("----")
        .attr("class", "source right " + sourceColor),
      firstp = $("<p></p>")
        .append(time)
        .append(source),
      subCat = $("<span></span>")
        .text("----------")
        .attr("class", "sub-cat"),
      amount = $("<span></span>")
        .append("<strong>₹ </strong>")
        .append('<strong class="display-amount">' + "---" + "</strong>")
        .attr("class", "right"),
      secodp = $("<p></p>")
        .append(subCat)
        .append(amount),
      info = $("<span></span>")
        .text("-------- ---")
        .attr("class", "info-txt"),
      thirdp = $("<p></p>")
        .append(info)
        .attr("style", "min-height: 20px;"),
      lidiv = $("<div></div>")
        .append(firstp)
        .append(secodp)
        .append("<hr>")
        .append(thirdp);
    var li;
    if (i <= 5) {
      li = $("<li></li>")
        .html(lidiv)
        .attr("data-after", "")
        .attr("class", "in-view ");
    }
    $("#list .timeline ul").append(li);
  }
  $("#list .timeline ul").addClass('flash')
  $.ajax({
    url: CHART_URL + "?isMap=true&sheet=" + monthSheetName,
    type: "GET",
    success: function(result) {
      $("#loading").hide();
      $("#list .timeline ul").empty().removeClass('flash');
      var monthTitle = $("#monthTitle"),
        mnYr = $("<div></div>")
          .addClass("mn-yr")
          .html(monthSheetName);
      monthTitle
        .html("")
        .show()
        .append(mnYr);
      if (closeMonthModal) {
        $("#monthsModal").remove();
      }
      var expenses = result.expenses;
      expenses.reverse().forEach(function(expense, index) {
        var date = moment(expense[0]).format("DD-MM-YYYY HH:mm"),
          bill;
        if (expense[8].length > 0) {
          if (expense[8].includes("app.box")) {
            bill =
              expense[8].length > 0
                ? '<span class="right"><a target="_blank" href="' +
                  expense[8] +
                  '"><i class="tiny material-icons">receipt</i></a></span>'
                : "";
          } else {
            bill =
              expense[8].length > 0
                ? '<span class="right"><a class="billImgLink" href="javascript:;" data-imgurl="' +
                  expense[8] +
                  '"><i class="tiny material-icons">receipt</i></a></span>'
                : "";
          }
        }
        var id,
          sourceColor = expense[3].includes("Credit")
            ? "red-text"
            : "green-text";
        if (
          moment(expense[0]).format("DD-MM-YYYY") ==
          moment().format("DD-MM-YYYY")
        ) {
          id = $("<a></a>")
            .append("<i class='tiny material-icons timline-id'>info</i>")
            .attr("class", "expId")
            .attr("data-id", expense[9]);
        }
        var time = $("<time></time>").text(date),
          source = $("<span></span>")
            .text(expense[3])
            .attr("class", "source right " + sourceColor),
          firstp = $("<p></p>")
            .append(time)
            .append(source),
          subCat = $("<span></span>")
            .text(expense[1])
            .attr("class", "sub-cat"),
          amount = $("<span></span>")
            .append("<strong>₹ </strong>")
            .append(
              '<strong class="display-amount">' + expense[2] + "</strong>"
            )
            .attr("class", "right"),
          secodp = $("<p></p>")
            .append(subCat)
            .append(amount),
          info = $("<span></span>")
            .text(expense[5])
            .attr("class", "info-txt"),
          thirdp = $("<p></p>")
            .append(id)
            .append(info)
            .append(bill)
            .attr("style", "min-height: 20px;"),
          lidiv = $("<div></div>")
            .append(firstp)
            .append(secodp)
            .append("<hr>")
            .append(thirdp);
        var li;
        if (index <= 5) {
          li = $("<li></li>")
            .html(lidiv)
            .attr("data-after", CAT_ICONS_IOS[expense[4]])
            .attr("class", "in-view " + expense[3].replace(" ", ""));
        } else {
          li = $("<li></li>")
            .html(lidiv)
            .attr("data-after", CAT_ICONS_IOS[expense[4]])
            .attr("class", expense[3].replace(" ", ""));
        }
        $("#list .timeline ul").append(li);
      });
      $("#filterBtn").show();
      resetFilter();
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
    imageLink.on("click", function(event) {
      var imgurl = $(event.target)
        .parent()
        .data("imgurl");
      $("#imgDownloadLink").attr("href", imgurl);
      $("#imageModal")
        .show()
        .css("background-image", "url(" + imgurl + ")")
        .css("opacity", 1);
    });
  });
}

function expIdActionListener() {
  var expIds = $(".expId");
  expIds.each(function() {
    expID = $(this);
    expID.on("click", function(event) {
      var id = $(event.target)
          .parent()
          .data("id"),
        idDiv = $('<div class="watermark"></div>').append(
          '<p class="water-text">' + id + "</p>"
        );
      $.ajax({
        url: ACTION_URL + "?id=" + id + "&actionName=SHOW",
        type: "GET",
        success: function(result) {
          $("#actionModal").modal();
          var infoDiv = $("<div></div>")
            .attr("id", "expense")
            .attr("data-id", id)
            .append(idDiv)
            .append("<hr>" + result.split(",").join("<br><hr>") + "<hr>")
            .attr("style", "padding: 0px 6px 0 6px;");
          $("#actionModal")
            .modal("open")
            .find(".modal-content")
            .empty()
            .append(infoDiv);
          $("#actionModal")
            .find(".modal-delete")
            .attr("onclick", "deleteExp(" + id + ")");
          $("#actionModal")
            .find(".modal-edit")
            .attr(
              "onclick",
              "editExp(" + id + "," + JSON.stringify(result) + ")"
            );
        }
      });
    });
  });
}

function monthsActionListener() {
  var pastMonths = $(".past-months");
  pastMonths.each(function() {
    pastMonth = $(this);
    pastMonth.on("click", function(event) {
      var monthSheetName = event.target.innerText;
      $(pastMonths.filter(".teal-text")[0]).removeClass("teal-text");
      $(event.target).addClass("teal-text");
      getList(monthSheetName, true);
      $("#monthsModal").remove();
    });
  });
  $("#mnthModalClose").on("click", function() {
    $("#monthsModal").remove();
  });
}

function deleteExp(id) {
  var ok = confirm("Want to remove? \n" + id);
  if (ok) {
    $.ajax({
      url: ACTION_URL + "?id=" + id + "&actionName=DESTROY",
      type: "GET",
      success: function(result) {
        alert(result);
        $("#actionModal").modal("close");
        $("#list .timeline ul").empty();
        $("#listTgr").trigger("click");
      }
    });
  }
}

function editExp(id, values) {
  var ok = confirm("Want to update? \n" + id + "\n" + values.split(","));
  if (ok) {
    $("#actionModal").modal("close");
    $("#addTransaction, #budget-container, #map, #list, #list").hide();
    $("#expensesMap, #budgetTgr, #form_card, #suggestions, #listTgr").show();
    $("#form_card, #suggestions").removeClass("hide");
    var formData = values.split(",");
    $("#amount")
      .val(formData[2])
      .trigger("focus");
    $('#source option[value="' + formData[3] + '"]').prop("selected", true);
    $("#source")
      .formSelect("destroy")
      .formSelect()
      .change();
    $('#category option[value="' + formData[4] + '"]').prop("selected", true);
    $("#category")
      .formSelect("destroy")
      .formSelect()
      .change();
    $('#subCategory option[value="' + formData[1] + '"]').prop(
      "selected",
      true
    );
    $("#subCategory")
      .formSelect("destroy")
      .formSelect()
      .change();
    $("#comments")
      .val(formData[5])
      .trigger("focus");
    $("#transForm")
      .data("form-type", "update")
      .data("row-id", id);
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
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
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

  //total animation
  $("#todayTotal").on("click", function() {
    splitToday(this);
  });
}

function resetFilter() {
  $("#filterBtn")
    .children()
    .removeClass("green-text");
  $("#searchQuery, #expDate").val("");
  $("input:checkbox:checked").each(function() {
    $(this).prop("checked", false);
  });
  document.getElementById("amount-slider").noUiSlider.set([0, 20000]);
  applyFilter();
}

function applyFilter() {
  var query = $("#searchQuery")
      .val()
      .toUpperCase(),
    categories = new Array(),
    sources = new Array(),
    isCurrentMonth = $(".mn-yr")[0].innerText == moment().format("MMMM YYYY");
  queryDate = moment($("#expDate").val()).format("DD-MM-YYYY");
  var amountRangeLower = parseInt($("#amountRangeLower").val()),
    amountRangeUpper = parseInt($("#amountRangeUpper").val());
  $("input:checkbox:checked").each(function() {
    $(this).attr("name") == "source"
      ? sources.push($(this).val())
      : categories.push($(this).val());
  });
  if (categories.length == 0) {
    $("input:checkbox[name='category']").each(function() {
      categories.push($(this).val());
    });
    categories.push("Transactions");
  }
  if (sources.length == 0) {
    $("input:checkbox[name='source']").each(function() {
      sources.push($(this).val());
    });
  }

  var ul = $("#list .timeline ul"),
    lis = ul.find("li"),
    total = 0,
    filteredCount = 0,
    todayTot = 0,
    credit = 0,
    debit = 0;
  var filterSource = {
    Cash: [],
    ICICI: [],
    HDFC: [],
    "ICICI Credit": [],
    "HDFC Credit": [],
    Zeta: [],
    Paytm: []
  };
  for (i = 0; i < lis.length; i++) {
    var li = $(lis[i]),
      category = Object.keys(CAT_ICONS_IOS).filter(function(key) {
        return CAT_ICONS_IOS[key] === li.data("after");
      })[0],
      source = li.find(".source").text(),
      subCat = li
        .find(".sub-cat")
        .text()
        .toUpperCase(),
      info = li
        .find(".info-txt")
        .text()
        .toUpperCase(),
      traDate = li
        .find("time")
        .text()
        .slice(0, 10),
      amount = parseFloat(li.find(".display-amount").text()),
      amountInt = parseInt(amount);
    if (source == "Cash" && amountInt < 999 && amount >= 15) {
      filterSource[source].push(amountInt);
    } else if (source != "Cash" && filterSource[source]) {
      filterSource[source].push(amountInt);
    }
    condition = true;
    if (queryDate.length == 10) {
      condition =
        (subCat.includes(query) || info.includes(query)) &&
        categories.includes(category) &&
        sources.includes(source) &&
        traDate.includes(queryDate) &&
        amountInt >= amountRangeLower &&
        amountInt <= amountRangeUpper;
    } else {
      condition =
        (subCat.includes(query) || info.includes(query)) &&
        categories.includes(category) &&
        sources.includes(source) &&
        amountInt >= amountRangeLower &&
        amountInt <= amountRangeUpper;
    }
    if (traDate.includes(moment().format("DD-MM-YYYY"))) {
      todayTot += amount;
      if (source.includes("Credit")) {
        credit += amount;
      } else {
        debit += amount;
      }
    }
    if (condition) {
      filteredCount++;
      total += amount;
      if (filteredCount <= 3) {
        li.show().addClass("in-view");
      } else {
        li.show();
      }
    } else {
      li.hide();
    }
  }
  if (isCurrentMonth) {
    localStorage.setItem("filterSource", JSON.stringify(filterSource));
    $("#today, #filterDatePicker").attr("style", "display: block !important");
  } else {
    $("#today, #filterDatePicker").attr("style", "display: none !important");
  }
  $("#summaryArea").addClass("show-summary");
  $("#total").shuffleText(total.toString(), {
    time: 30,
    maxTime: 2500,
    amount: 5,
    complete: function() {
      $("#today").addClass("show-today");
      $("#todayCredit").val(credit);
      $("#todayDebit").val(debit);
      $("#todayTotal")
        .attr("data-total", "whole")
        .shuffleText("₹ " + todayTot.toString(), {
          time: 30,
          maxTime: 2500,
          amount: 8,
          complete: null
        });
    }
  });
  $("#filter-slide").sidenav("close");
}

function splitToday() {
  var totSpan = $("#todayTotal"),
    debit = $("#todayDebit").val(),
    credit = $("#todayCredit").val();
  total = parseFloat(debit) + parseFloat(credit);
  (split = "₹ " + debit + " + ₹ " + credit),
    (whole = "₹ " + total),
    (htmlDebit = $('<span class="green-text"></span>').text("₹ " + debit)),
    (htmlCredit = $('<span class="red-text"></span>').text("₹ " + credit));

  if (totSpan.attr("data-total") == "whole") {
    $("#todayTotal")
      .attr("data-total", "split")
      .shuffleText(split, {
        time: 300,
        maxTime: 5000,
        amount: 5,
        complete: function() {
          $("#todayTotal")
            .empty()
            .append(htmlDebit)
            .append(" + ")
            .append(htmlCredit);
        }
      });
  } else {
    $("#todayTotal")
      .attr("data-total", "whole")
      .shuffleText(whole, {
        time: 300,
        maxTime: 5000,
        amount: 5,
        complete: null
      });
  }
}
