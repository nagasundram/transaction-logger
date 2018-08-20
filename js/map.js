$(function() {
  $(document).ready(function() {
    init();
    function init() {
      $("#loading").show();
      $("form_card").hide();
      getMap();
    }
    $('#addTransaction').on('click', function(e) {
      $('#addTransaction').hide();
      $('#expensesMap').show();
      $("#form_card").show().removeClass('hide');
      $("#map").hide();
    })

    $('#expensesMap').on('click', function(e) {
      $("#loading").show();
      getMap();
    })

    //Geolocation Detecting
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setPosition);
    } else {
      alert("Geo location is not supported by this browser.");
    }

    function setPosition(position) {
      $("#location").trigger('focus');
      $("#location").val(position.coords.latitude + "," + position.coords.longitude);
      $("#amount").trigger('focus');
    }
  })
})

function getMap() {
  $.ajax({
    url: CHART_URL + "?isMap=true",
    type: 'GET',
    success: function(result) {
      $("#loading").hide();
      $("#form_card").hide();
      $("#expensesMap").hide();
      $("#map").show();
      $("#addTransaction").show();

      var expenses = result.expenses,
        locations = [];
      expenses.forEach(function(expense, index) {
        var date = new Date(expense[0]).toDateString() + ' ' + new Date(expense[0]).toLocaleTimeString()
        locations.push(['<div>' + date + '</div><hr><div>' + expense[1] + '<span class="new badge" style="background: ' + MARKER_COLORS[expense[3]] + '" data-badge-caption="₹ ' + expense[2] + '">' + expense[3] + ' </span>', expense[6].split(',')[0], expense[6].split(',')[1], index + 1])
      })
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        styles: NIGHT_THEME,
        backgroundColor: '#37474f',
        zoomControl: false,
        streetViewControl: false,
        rotateControl: false,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        center: new google.maps.LatLng(locations[0][1], locations[0][2]),
      });
      var infowindow = new google.maps.InfoWindow();

      var marker, i;
      window.setTimeout(function() {
        for (i = 0; i < locations.length; i++) {
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map,
            animation: google.maps.Animation.DROP,
            zIndex: locations[i][3],
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 5,
              strokeColor: MARKER_COLORS[expenses[i][3]],
              fillOpacity: 0.5,
              anchor: new google.maps.Point(0, 0),
              fillColor: MARKER_COLORS[expenses[i][3]],
              strokeWeight: 1,
              strokeOpacity: 0.8,
            },
          });
          $("#mapClose").show();
          google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
            return function() {
              infowindow.setContent(locations[i][0]);
              infowindow.open(map, marker);
            }
          })(marker, i));
        }
      }, 500)
    }
  });
}