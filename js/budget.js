$(function() {
  $(document).ready(function() {
    $("#budgetTgr").on("click", function(e) {
      $("#addTransaction").show();
      $("#expensesMap").show();
      $("#listTgr, #incomeTgr").show();
      $("#form_card, #suggestions, #incomeContainer").hide();
      $("#map").hide();
      $("#list").hide();
      $("#budgetTgr").hide();
      $("#budget-container").show();
      $("#loading").show();
      $("#summaryArea").removeClass("show-summary");
      $("#today").removeClass("show-today");
      getAndShowBudget();
    });
    $("#balanceSwitch").on("click", function(e) {
      var bswitch = $(this),
        budgetBars = $("#budget").find(".progress"),
        planned,
        rightEnd;
      $.each(budgetBars, function(index, bar) {
        planned = $(
          $(bar)
            .children()
            .children()[0]
        );
        rightEnd = $(
          $(bar)
            .children()
            .children()[1]
        );
        rightEnd.text(parseFloat(planned.text()) - parseFloat(rightEnd.text()));
      });
      if (bswitch.html() == "Spent") {
        bswitch.html("Balance");
      } else {
        bswitch.html("Spent");
      }
    });
  });
});

function getAndShowBudget() {
  var budgetDiv = $("#budget");
  budgetDiv.empty();
  for (var i = 0; i < 13; i++) {
    var used = 0,
      percentage = 0,
      cat = "---------",
      intPer = parseInt(Math.random(100) * 100),
      color = 'darkgray';
    var catDiv = $("<div></div>")
        .text(cat + ": ")
        .attr("class", "white-text col s3")
        .attr("style", "margin-top: 8px"),
      perDiv = $("<div></div>")
        .text("--%")
        .attr("class", "white-text col s3")
        .attr("style", "margin-top: 8px"),
      prog = $("<div></div>")
        .attr("class", "determinate " + color)
        .attr("style", "width: " + intPer + "%"),
      limitDiv = $("<div></div>")
        .attr("class", "col s6")
        .attr("style", "text-align: left")
      usedDiv = $("<div></div>")
        .attr("class", "col s6")
        .attr("style", "text-align: right")
      limitRow = $("<div></div>")
        .attr("class", "row")
        .attr("style", "position: relative; z-index: 9;")
        .append(limitDiv)
        .append(usedDiv),
      progressCon = $("<div></div>").attr("class", "progress gray col s6"),
      progressDiv = progressCon.append(limitRow).append(prog),
      pieDiv = $("<span>")
        .attr("id", "pie" + i)
        .addClass("pie"),
      perPieDiv = perDiv.prepend(pieDiv),
      rowDiv = $("<div></div>")
        .attr("class", "row")
        .append(catDiv)
        .append(perPieDiv)
        .append(progressDiv);
    budgetDiv.append(rowDiv);
    $("#budget-container").show();
    var randomPie = parseInt(Math.random(100) * 100);
    $("#pie" + i).sparkline([randomPie, 100 - randomPie], {
      type: "pie",
      sliceColors: [color, "#000"],
      offset: -90
    });
  }
  budgetDiv.addClass('flash');
  $.ajax({
    url:
      "https://script.google.com/macros/s/AKfycbxb2XVYjTfM9CYNEvlpOHmj5QIR_-t3utN4gBMLwf1WLUNhPIs/exec",
    type: "GET",
    success: function(result) {
      var budgets = result.budgets;
      $("#loading").hide();
      $("#budget-container").hide();
      budgetDiv.removeClass('flash');
      budgetDiv.empty();
      budgets.forEach(function(budget, index) {
        console.log(budget[0])
        var used = budget[1] - budget[2],
          percentage = ((used / budget[1]) * 100).toFixed(2),
          cat = budget[0],
          intPer = parseInt(percentage),
          greenCat = ["Chit", "Mutual Fund", "Home", "Savings"],
          color;
        if (greenCat.includes(cat)) {
          color = intPer <= 50 ? "red" : intPer <= 80 ? "orange" : "green";
        } else {
          color = intPer <= 50 ? "green" : intPer <= 80 ? "orange" : "red";
        }
        var catDiv = $("<div></div>")
            .text(cat + ": ")
            .attr("class", "white-text col s3")
            .attr("style", "margin-top: 8px"),
          perDiv = $("<div></div>")
            .text(intPer + "%")
            .attr("class", "white-text col s3")
            .attr("style", "margin-top: 8px"),
          prog = $("<div></div>")
            .attr("class", "determinate " + color)
            .attr("style", "width: " + intPer + "%"),
          limitDiv = $("<div></div>")
            .attr("class", "col s6")
            .attr("style", "text-align: left")
            .text(budget[1]),
          usedDiv = $("<div></div>")
            .attr("class", "col s6")
            .attr("style", "text-align: right")
            .text(used),
          limitRow = $("<div></div>")
            .attr("class", "row")
            .attr("style", "position: relative; z-index: 9;")
            .append(limitDiv)
            .append(usedDiv),
          progressCon = $("<div></div>").attr("class", "progress white col s6"),
          progressDiv = progressCon.append(limitRow).append(prog),
          pieDiv = $("<span>")
            .attr("id", "pie" + index)
            .addClass("pie"),
          perPieDiv = perDiv.prepend(pieDiv),
          rowDiv = $("<div></div>")
            .attr("class", "row")
            .append(catDiv)
            .append(perPieDiv)
            .append(progressDiv);
        budgetDiv.append(rowDiv);
        $("#budget-container").show();
        $("#pie" + index).sparkline([percentage, 100 - percentage], {
          type: "pie",
          sliceColors: [color, "#000"],
          offset: -90
        });
      });
    }
  });
}
