$(function() {
  $(document).ready(function() {
    $('select').formSelect();
    $('.fixed-action-btn').floatingActionButton();
 $('.modal').modal();
    var elems = document.querySelectorAll('.tap-target');
    var instances = M.TapTarget.init(elems, {});

    $("#loading").hide();
    $("#miscSubCatCon").hide();

    $('#category').on('change', function() {
      var subCat = $("#subCategory");
      subCat.length = 1;
      if (this.selectedIndex < 1) return;
      if (this.value == 'Misc.') {
        $("#miscSubCatCon").show();
        $("#subCatCon").hide();
      } else {
        $("#miscSubCatCon").hide();
        $("#subCatCon").show();
        for (var subCategory in CATEGORIES[this.value]) {
          subCat.append(new Option(subCategory, subCategory));
        }
        subCat.formSelect();
      }
    });

    function write_action(amt, cat, subCat, source, comments, location) {
      var data = [subCat, amt, source, cat, comments, location].join('|||');
      $("#loading").show();
      $.ajax({
        url: WRITE_URL + data,
        type: 'GET',
        success: function(result) {
          $("#loading").hide();
          $("#transForm").trigger("reset");
          M.toast({ html: 'Transaction Logged', classes: "blue-grey" });
          $('#sb').trigger('click');
        }
      });
    }

    $('#transForm').on('submit', function(e) {
      e.preventDefault();
      var amt = $('#amount').val(),
        cat = $('#category').val(),
        subCat = $('#subCategory').val(),
        source = $('#source').val(),
        location = $('#location').val(),
        comments = $('#comments').val();
      if (cat == "Misc.") {
        subCat = $('#miscSubCategory').val();
      }
      write_action(amt, cat, subCat, source, comments, location);
    });

    $('#sb').on('click', function() {
      $("#loading").show();
      $.ajax({
        url: READ_URL,
        type: 'GET',
        success: function(result) {
          var htmlResult = [];
          $.each(result.split(','), function(index, data) {
            var obj = data.split(": "),
              key = obj[0],
              value = obj[1];
            switch (key) {
              case 'Cash':
                htmlResult += "<div class='chip'><img src='images/rupee.png' alt=" + key + "/> " + value + "</div><br/>";
                break;
              case 'ICICI':
                htmlResult += "<div class='chip'><img src='images/icici.png' alt=" + key + "/> " + value + "</div><br/>";
                break;
              case 'HDFC':
                htmlResult += "<div class='chip'><img src='images/hdfc.png' alt=" + key + "/> " + value + "</div><br/>";
                break;
              case 'Zeta':
                htmlResult += "<div class='chip'><img src='images/zeta.png' alt=" + key + "/> " + value + "</div><br/>";
                break;
              case 'paytm':
                htmlResult += "<div class='chip'><img src='images/paytm.jpg' alt=" + key + "/> " + value + "</div><br/>";
                break;
              case 'ICICI Credit':
                htmlResult += "<div class='chip red'><img src='images/icici.png' alt=" + key + "/> " + value + "</div><br/>";
                break;
              case 'HDFC Credit':
                htmlResult += "<div class='chip red'><img src='images/hdfc.png' alt=" + key + "/> " + value + "</div><br/>";
                break;
            }
          });
          $("#loading").hide();
          $("#showBalDetail").html(htmlResult);
          var elem = $("#tap-target"),
            instance = M.TapTarget.getInstance(elem);
          instance.open();
        }
      });
    })
  });
});