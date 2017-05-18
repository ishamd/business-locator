const placesKey = 'AIzaSyCpTvE8KrIFGMdXXPHmIDzMKIzZ3xav9JQ';
const mapsKey = 'AIzaSyDoThcP6tdQR8VR3xcjnZbjzTomgZD3B2w';
const corsProxy = 'http://galvanize-cors-proxy.herokuapp.com/';
let map;
let results = [];
let addressLat;
let addressLng;
let coords = `${addressLat},${addressLng}`;
const radius = 5000;
let address = 'Austin';
let keyword = 'brewery';

// Store location input to global variable
const $button = $('button');
const $locationInput = $('#location-input');
$button.click((event) => {
  event.preventDefault();
  address = $locationInput.val();
  fetchData();
});

// change dropdown-menu to display selection
$('.dropdown-menu li a').click(function () {
  $(this).parents('.dropdown').find('#choice').html(`${$(this).text()} <span class="caret"></span>`);
  $(this).parents('.dropdown').find('#choice').val($(this).data('value'));

  if ($(this).text() === 'Breweries') {
    keyword = 'brewery';
    // fetchData();
  }

  if ($(this).text() === 'Wineries') {
    keyword = 'winery';
    // fetchData();
  }

  if ($(this).text() === 'Distilleries') {
    keyword = 'distillery';
    // fetchData();
  }
});


function fetchData() {
  $(document).ready(() => {
    console.log('Doc is ready');

    // make geocodeAPI request to get address lat/lng
    const geoRequest = `${corsProxy}https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${mapsKey}`;

    const geo_$xhr = $.getJSON(geoRequest);

    geo_$xhr.done((object) => {
      if (geo_$xhr.status !== 200) {
        return;
      }

      addressLat = object.results[0].geometry.location.lat;
      addressLng = object.results[0].geometry.location.lng;
      coords = `${addressLat},${addressLng}`;

      // make nearby search request to google places API
      const nearbyRequest = `${corsProxy}https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coords}&radius=${radius}&keyword=${keyword}&key=${placesKey}`;

      const places_$xhr = $.getJSON(nearbyRequest);

      places_$xhr.done((data) => {
        if (places_$xhr.status !== 200) {
          return;
        }

        results = [];

        const $accordion = $('#accordion');
        $accordion.empty();

        for (let i = 0; i < data.results.length; i++) {
          const place_id = data.results[i].place_id;

          const detailsRequest = `${corsProxy}https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&key=AIzaSyCpTvE8KrIFGMdXXPHmIDzMKIzZ3xav9JQ`;

          const details_$xhr = $.getJSON(detailsRequest);

          details_$xhr.done((response) => {
            if (details_$xhr.status !== 200) {
              return;
            }

            const obj = response.result;
            const website = obj.website;
            const rating = obj.rating;
            const phoneNumber = obj.formatted_phone_number;
            const id = obj.id;
            const name = obj.name;
            const vicinity = obj.vicinity;
            const position = obj.geometry.location;
            const result = {
              place_id,
              id,
              name,
              vicinity,
              position: {
                lat: position.lat,
                lng: position.lng,
              },
            };
            results.push(result);
            $accordion.append(createAccordion(name, vicinity, website, phoneNumber, rating, i));
          });


          details_$xhr.fail((err) => {
            console.log(err);
          });
        }

        // append empty google map to page
        const $body = $('body');
        const $api = $('#api');
        $api.remove();
        const script = '<script id="api" async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDoThcP6tdQR8VR3xcjnZbjzTomgZD3B2w&callback=initMap"></script>';
        $body.append(script);
      });

      places_$xhr.fail((err) => {
        console.log(err);
      });
    });

    geo_$xhr.fail((err) => {
      console.log(err);
    });
  });
}


// Creates new bootstrap elements for the results-pane
function createAccordion(name, address, website, phoneNumber, rating, num) {
  const $panel = $('<div>', {
    class: 'panel panel-default',
  });
  const $panel_heading = $('<div>', {
    id: `heading${num}`,
    class: 'panel-heading',
    role: 'tab',
  });
  const $h4 = $('<h4>', {
    class: 'panel-title',
  });
  const $anchor = $('<a>', {
    role: 'button',
    'data-toggle': 'collapse',
    'data-parent': '#accordion',
    href: `#collapse${num}`,
    'aria-expanded': 'false',
    'aria-controls': `collapse${num}`,
  });
  const $panelCollapse = $('<div>', {
    id: `collapse${num}`,
    class: 'panel-collapse collapse',
    role: 'tabpanel',
    'aria-labelledby': `heading${num}`,
  });
  const $panelBody = $('<div>', {
    class: 'panel-body',
  });
  const $rating = $(`<p>Rating: ${rating}</p>`);
  const $website = $(`<a href="${website}" target="_blank">Link to website</a>`);
  const $address = $(`<p>${address}</p>`);
  const $phoneNumber = $(`<p>${phoneNumber}</p>`);

  $anchor.text(name);
  $panelBody.append($rating);
  $panelBody.append($address);
  $panelBody.append($phoneNumber);
  $panelBody.append($website);

  $h4.append($anchor);
  $panel_heading.append($h4);
  $panel.append($panel_heading);
  $panelCollapse.append($panelBody);
  $panel.append($panelCollapse);

  return $panel;
}

// initialize the map and drop markers on the page
function initMap() {
  const center = {
    lat: addressLat,
    lng: addressLng,
  };

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center,
  });
  newMarkers(results);
}

function newMarkers(arr) {
  for (let j = 0; j < arr.length; j++) {
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng({
        lat: arr[j].position.lat,
        lng: arr[j].position.lng,
      }),
      title: arr[j].name,
    });

    const infowindow = new google.maps.InfoWindow({
      content: arr[j].name,
    });

    marker.addListener('click', () => {
      infowindow.open(map, marker);
    });

    marker.setMap(map);
  }
}

// This is an Init function which will fire when the page loads.
(function init() {
  fetchData();
}());
