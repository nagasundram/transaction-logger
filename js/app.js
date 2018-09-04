$(function() {
  $(document).ready(function() {
    $('select').formSelect();
    $('#float-container').floatingActionButton();
    $('.modal').modal();
    $('#addTransaction').hide();
    $('#list').hide();
    var elems = document.querySelectorAll('.tap-target');
    var instances = M.TapTarget.init(elems, {});

    $("#loading").hide();
    $("#miscSubCatCon").hide();
    $('#float-container').on('click', function(){
      M.FloatingActionButton.getInstance($('#float-container')).destroy();
      $('#float-container').floatingActionButton();
      M.FloatingActionButton.getInstance($('#float-container')).open();
    })

    $('#category').on('change', function() {
      var subCat = $("#subCategory");
      $("#subCategory option").remove();
      subCat.append(new Option('Select', ''));
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
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(setPosition);
          } else {
            alert("Geo location is not supported by this browser.");
          }
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
                htmlResult += "<div onclick=getChartData('" + key.replace(' ', '|') + "'); class='chip'><img src='images/rupee.png' alt=" + key + "/> " + value + "</div><br/>";
                break;
              case 'ICICI':
                htmlResult += "<div onclick=getChartData('" + key.replace(' ', '|') + "'); class='chip'><img src='images/icici.png' alt=" + key + "/> " + value + "</div><br/>";
                break;
              case 'HDFC':
                htmlResult += "<div onclick=getChartData('" + key.replace(' ', '|') + "'); class='chip'><img src='images/hdfc.png' alt=" + key + "/> " + value + "</div><br/>";
                break;
              case 'Zeta':
                htmlResult += "<div onclick=getChartData('" + key.replace(' ', '|') + "'); class='chip'><img src='images/zeta.png' alt=" + key + "/> " + value + "</div><br/>";
                break;
              case 'Paytm':
                htmlResult += "<div onclick=getChartData('" + key.replace(' ', '|') + "'); class='chip'><img src='images/paytm.jpg' alt=" + key + "/> " + value + "</div><br/>";
                break;
              case 'ICICI Credit':
                htmlResult += "<div onclick=getChartData('" + key.replace(' ', '|') + "'); class='chip red'><img src='images/icici.png' alt=" + key + "/> " + value + "</div><br/>";
                break;
              case 'HDFC Credit':
                htmlResult += "<div onclick=getChartData('" + key.replace(' ', '|') + "'); class='chip red'><img src='images/hdfc.png' alt=" + key + "/> " + value + "</div><br/>";
                break;
            }
          });
          $("#loading").hide();
          $("#showBalDetail").html(htmlResult);
          $('.tap-target-content').css("cssText", "left: 160px !important;");
          var elem = $("#tap-target"),
            instance = M.TapTarget.getInstance(elem);
          instance.open();
        }
      });
    })
  });
});

//Google Api request for get chart data
function getChartData(key) {
  $("#loading").show();
  key = key.replace('|', ' ');
  $.ajax({
    url: CHART_URL + "?cat=" + key,
    type: 'GET',
    success: function(result) {
      google.charts.setOnLoadCallback(drawChart(result, key));
    }
  });
}

function setPosition(position) {
  $("#location").trigger('focus');
  $("#location").val(position.coords.latitude + "," + position.coords.longitude);
  $("#amount").trigger('focus');
}
//Google Charts
function drawChart(result, cat) {
  var rawData = result.expenses,
    newArr = []
  rawData.forEach(function(element) {
    var key = Object.keys(element)[0],
      value = Object.values(element)[0];

    if (newArr[key] == undefined)
      newArr[key] = 0;
    newArr[key] += value;
  });
  var rows = []
  for (var i in newArr) {
    rows.push([i, newArr[i]])
  }
  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Topping');
  data.addColumn('number', 'Slices');
  data.addRows(rows);

  // Set chart options
  var options = {
    'title': cat + ' ₹' + result.totalExpense.toFixed(2),
    'width': 400,
    'height': 300,
    'backgroundColor': { fill: 'transparent' },
    'opacity': 0,
    'is3D': true,
    'legend': 'none',
    'sliceVisibilityThreshold': 0
  };

  var elem = $("#tap-target"),
    instance = M.TapTarget.getInstance(elem);
  instance.open();
  $("#loading").hide();
  var chart = new google.visualization.PieChart(document.getElementById('showBalDetail'));
  chart.draw(data, options);
  $('.tap-target-content').css("cssText", "left: 42px !important;");
}

function visibilityHandler() {
  var hash = '#bg';
  if (document.hidden && !window.location.hash) {
    window.history.replaceState(null, null, window.location + hash);
      alert(1);
  } else if (!document.hidden && window.location.hash == hash) {
      alert(2);
    var l = '' + window.location;
    window.history.replaceState(null, null, l.substr(0, l.length - hash.length));
  }
};
document.addEventListener('visibilitychange', visibilityHandler, false);
visibilityHandler();