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
      console.log(data.results);

      for (let i = 0; i < data.results.length; i++) {
        let $results_pane = $('#results-pane');
        let name = data.results[i]['name'];
        $results_pane.append(`<p>${name}</p>`);
      }

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
    zoom: 12,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
  console.log(marker)
}

// This is an Init function which will fire when the page loads.
(function init() {
  fetchData();
})();
