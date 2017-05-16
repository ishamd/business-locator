let results = [];
let cityName = '';
let cityPosition = {};

function fetchData() {

  $(document).ready(function() {
    console.log('Doc is ready');

    let placesKey = 'AIzaSyCpTvE8KrIFGMdXXPHmIDzMKIzZ3xav9JQ';
    let mapsKey = 'AIzaSyDoThcP6tdQR8VR3xcjnZbjzTomgZD3B2w';
    let corsProxy = 'http://galvanize-cors-proxy.herokuapp.com/';
    let location = '39.747704,-104.990607'
    let radius = 500;
    let type = 'establishment';
    let keyword = 'brewery';
    let name = 'brew';

    let request = `${corsProxy}https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&name=${name}&radius=${radius}&type=${type}&keyword=${keyword}&key=${placesKey}`

    let places_$xhr = $.getJSON(request);

    places_$xhr.done(function(data) {
      if (places_$xhr.status !== 200) {
        return;
      }

      for (let i = 0; i < data.results.length; i++) {
        let $results_pane = $('#results-pane');
        let name = data.results[i]['name'];
        let position = data.results[i]['geometry']['location'];
        // console.log(position);
        let result = {
          'name': name,
          'position': {
            lat: position.lat,
            lng: position.lng
          }
        }
        results.push(result)
        // console.log(result);
        $results_pane.append(`<p>${name}</p>`);

      }

      let $body = $('body');

      let script = '<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDoThcP6tdQR8VR3xcjnZbjzTomgZD3B2w&callback=initMap"></script>'

      $body.append(script);

    });

    places_$xhr.fail(function(err) {
      console.log(err);
    });

  });

}

function initMap() {

  var uluru = {
    lat: 39.747704,
    lng: -104.990607
  };
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: uluru
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
    // console.log(results)
    marker.setMap(map);
  }
  console.log(results)
}

// This is an Init function which will fire when the page loads.
(function init() {
  fetchData();
})();
