function fetchData() {

  $(document).ready(function() {
    console.log('Doc is ready');

    let placesKey = 'AIzaSyCpTvE8KrIFGMdXXPHmIDzMKIzZ3xav9JQ';
    let mapsKey = 'AIzaSyDoThcP6tdQR8VR3xcjnZbjzTomgZD3B2w';

    let request = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&type=restaurant&keyword=cruise&key=AIzaSyCpTvE8KrIFGMdXXPHmIDzMKIzZ3xav9JQ';

    let $xhr = $.getJSON(request);

    console.log($xhr);

    $xhr.done(function(data) {
      if ($xhr.status !== 200) {
        return;
      }
      console.log(data);

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
