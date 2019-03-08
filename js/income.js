$(function() {
  $(document).ready(function() {
    $("#incomeContainer").hide();
    $("#incomeTgr").on("click", function(e) {
      $("#incomeContainer, #addTransaction, #budgetTgr, #expensesMap").show();
      $(
        "#incomeTgr, #budget-container, #form_card, #suggestions, #map, #list"
      ).hide();
    });

    $("#incomeForm").on("submit", function(e) {
      $(".i-submit-btn").attr("disabled", true);
      var selectIds = ["#iSource"],
        errFlag = 0;
      $(".select-error").hide();
      for (i in selectIds) {
        if ($(selectIds[i]).val() == "") {
          errFlag = 1;
          $(selectIds[i])
            .parent()
            .parent()
            .find(".select-error")
            .show();
        }
      }
      if (errFlag) {
        $(".i-submit-btn").attr("disabled", false);
        return false;
      }
      e.preventDefault();
      var amt = $("#iAmount").val(),
        source = $("#iSource").val(),
        cmt = $("#iComments").val();
      update_action(amt, source, cmt);
    });

    function update_action(amt, source, cmt) {
      $("#loading").show();
      $.ajax({
        url: SOURCE_URL + "?cell=" + source + "&nVal=" + amt + "&nNote=" + cmt,
        type: "GET",
        success: function(result) {
          $("#loading").hide();
          $("#incomeForm").trigger("reset");
          $(".source-help, #incomeContainer").hide();
          $(".submit-btn").attr("disabled", false);
          M.toast({ html: "Income Updated", classes: "light-green" });
          $("#sb, #addTransaction").trigger("click");
          storeBalanceLocally();
        }
      });
    }

    function storeBalanceLocally() {
      $.ajax({
        url: READ_URL,
        type: "GET",
        success: function(result) {
          var htmlResult = [];
          $.each(result.split(","), function(index, data) {
            var obj = data.split(": "),
              key = obj[0],
              value = obj[1];
            localStorage.setItem(key, value);
          });
        }
      });
    }
  });
});
