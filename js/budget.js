$(function() {
  $(document).ready(function() {
    $('#budgetTgr').on('click', function(e) {
      $('#addTransaction').show();
      $('#expensesMap').show();
      $('#listTgr').show();
      $("#form_card, #suggestions").hide();
      $("#map").hide();
      $("#list").hide()
      $("#budgetTgr").hide();
      $("#budget").show();
      $("#loading").show();
      $('#summaryArea').removeClass('show-summary');
      $('#today').removeClass('show-today');
      getAndShowBudget();
    });
  });
});

function getAndShowBudget() {
  $.ajax({
    url: BUDGET_URL,
    type: 'GET',
    success: function(result) {
      var budgets = result.budgets,
        budgetDiv = $('#budget');
      $('#loading').hide();
      budgets.forEach(function(budget, index) {
        var used = budget[1] - budget[2],
          percentage = ((used / budget[1]) * 100).toFixed(2),
          cat = budget[0],
          intPer = parseInt(percentage),
          greenCat = ['Chit', 'Mutual Fund', 'Home'],
          color;
          if (greenCat.includes(cat)){
            color = (intPer <= 50) ? 'red' : (intPer <= 80) ? 'orange' : 'green';
          } else {
            color = (intPer <= 50) ? 'green' : (intPer <= 80) ? 'orange' : 'red';
          }
          var catDiv = $("<div></div>").text(cat + ': ').attr('class', 'white-text col s3'),
          perDiv = $("<div></div>").text(intPer + '%').attr('class', 'white-text col s3'),
          prog = $("<div></div>").attr('class', 'determinate ' + color).attr('style', 'width: ' + intPer + '%'),
          progressCon = $("<div></div>").attr('class', 'progress white col s6'),
          progressDiv = progressCon.append(prog),
          rowDiv = $("<div></div>").attr('class', 'row').append(catDiv).append(perDiv).append(progressDiv);
        budgetDiv.append(rowDiv);
      });
    }
  });
};