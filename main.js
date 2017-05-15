function fetchData() {

  $(document).ready(function() {
    console.log('Doc is ready');

    let placesKey = 'AIzaSyCpTvE8KrIFGMdXXPHmIDzMKIzZ3xav9JQ';
    let mapsKey = 'AIzaSyDoThcP6tdQR8VR3xcjnZbjzTomgZD3B2w';
    let corsProxy = 'http://galvanize-cors-proxy.herokuapp.com/';
    let denver = '39.747704,-104.990607'

    let request = corsProxy +  'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + denver + '&radius=500&type=restaurant&keyword=brewery&key=' + placesKey;

    let $xhr = $.getJSON(request);

    console.log($xhr);

    $xhr.done(function(data) {
      if ($xhr.status !== 200) {
        return;
      }
      console.log(data.results);

      for (let i = 0; i < data.results.length; i++) {
        let $results_pane = $('#results-pane');
        let name = data.results[i]['name'];
        $results_pane.append(`<p>${name}</p>`);
      }

    });

    $xhr.fail(function(err) {
      console.log(err);
    });

  });

}

// This is an Init function which will fire when the page loads.
(function init() {
  fetchData();
})();


// function myMap() {
//   var mapCanvas = document.getElementById("map");
//   var mapOptions = {
//       center: new google.maps.LatLng(51.5, -0.2),
//       zoom: 10
//   };
//   var map = new google.maps.Map(mapCanvas, mapOptions);
// }
// myMap();
