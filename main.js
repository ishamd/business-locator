let placesKey = 'AIzaSyCpTvE8KrIFGMdXXPHmIDzMKIzZ3xav9JQ';
let mapsKey = 'AIzaSyDoThcP6tdQR8VR3xcjnZbjzTomgZD3B2w';
let corsProxy = 'http://galvanize-cors-proxy.herokuapp.com/';
let results = [];
let address = 'Austin';
let addressLat;
let addressLng;
let cityPosition = {};
let coords = `${addressLat},${addressLng}`;
let radius = 5000;
let type = 'establishment';
let keyword = 'brewery';
// let name = 'brew';

// Store location input to global variable
let $button = $('button');
let $location_input = $('#location-input');
$button.click(function(event) {
  event.preventDefault();
  address = $location_input.val();
  fetchData();
})

// change dropdown-menu to display selection
$(".dropdown-menu li a").click(function() {
  $(this).parents(".dropdown").find('#choice').html($(this).text() + ' <span class="caret"></span>');
  $(this).parents(".dropdown").find('#choice').val($(this).data('value'));

  if ($(this).text() === 'Breweries') {
    keyword = 'brewery';
    // name = 'brewery';
    fetchData();
  };

  if ($(this).text() === 'Wineries') {
    keyword = 'winery';
    // name = 'wine';
    fetchData();
  };

  if ($(this).text() === 'Distilleries') {
    keyword = 'distillery';
    // name = 'distillery';
    fetchData();
  };

});


function fetchData() {

  $(document).ready(function() {
    console.log('Doc is ready');

    // make geocodeAPI request
    let geoRequest = `${corsProxy}https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyDoThcP6tdQR8VR3xcjnZbjzTomgZD3B2w`

    let geo_$xhr = $.getJSON(geoRequest);

    geo_$xhr.done(function(obj) {
      if (geo_$xhr.status !== 200) {
        return;
      }

      addressLat = obj.results[0].geometry.location.lat;
      addressLng = obj.results[0].geometry.location.lng;
      coords = `${addressLat},${addressLng}`;

      // make API request to google places
      let nearbyRequest = `${corsProxy}https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coords}&radius=${radius}&keyword=${keyword}&key=${placesKey}`
      console.log(nearbyRequest);

      let places_$xhr = $.getJSON(nearbyRequest);

      places_$xhr.done(function(data) {
        if (places_$xhr.status !== 200) {
          return;
        }

        console.log(data.results);

        results = [];
        let $results_pane = $('#results-pane');
        let $accordion = $('#accordion');
        $accordion.empty();

        for (let i = 0; i < data.results.length; i++) {
          // let $results_pane = $('#results-pane');
          let place_id = data.results[i]['place_id'];
          let id = data.results[i]['id'];
          let name = data.results[i]['name'];
          let position = data.results[i]['geometry']['location'];
          let result = {
            'place_id': place_id,
            'id': id,
            'name': name,
            'position': {
              lat: position.lat,
              lng: position.lng
            }
          }
          results.push(result)
          console.log(results);
          // $results_pane.append(`<p>${name}</p>`);
          $accordion.append(createAccordion(name, id, i));
        }

        // append empty google map to page
        let $body = $('body');
        let script = '<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDoThcP6tdQR8VR3xcjnZbjzTomgZD3B2w&callback=initMap"></script>'
        $body.append(script);

      });

      places_$xhr.fail(function(err) {
        console.log(err);
      });

    });

    geo_$xhr.fail(function(err) {
      console.log(err);
    });

  });

};

function createAccordion(name, info, num) {
  let $panel = $('<div>', {"class": "panel panel-default"});
  let $panel_heading = $('<div>', {id: "heading"+num, "class": "panel-heading", "role": "tab"});
  let $h4 = $('<h4>', {"class": "panel-title"});
  let $anchor = $('<a>', {"role": "button", "data-toggle": "collapse", "data-parent": "#accordion", "href": "#collapse"+num, "aria-expanded": "false", "aria-controls": "collapse"+num});
  $anchor.text(name);
  let $panel_collapse = $('<div>', {id: "collapse"+num, "class": "panel-collapse collapse", "role": "tabpanel", "aria-labelledby": "heading"+num});
  let $panel_body = $('<div>', {"class": "panel-body"});
  $panel_body.text(info);

  $h4.append($anchor);
  $panel_heading.append($h4);
  $panel.append($panel_heading);
  $panel_collapse.append($panel_body);
  $panel.append($panel_collapse);

  return $panel;
}



// initialize the map and drop markers on the page
function initMap() {

  var center = {
    lat: addressLat,
    lng: addressLng
  };
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: center
  });
  // // original marker set from google docs:
  // var marker = new google.maps.Marker({
  //   position: uluru,
  //   map: map
  // });

  for (let j = 0; j < results.length; j++) {
    let marker = new google.maps.Marker({
      position: new google.maps.LatLng({
        lat: results[j].position.lat,
        lng: results[j].position.lng
      }),
    });
    marker.setMap(map);
  }
}

// This is an Init function which will fire when the page loads.
(function init() {
  fetchData();
})();
