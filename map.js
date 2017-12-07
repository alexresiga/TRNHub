var directionsService;
var directionsDisplay;

function initMap() {
    var uluru = {lat: 55.894424, lng: -3.685716};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: uluru
    });
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, stations) {
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = [];

    directionsDisplay = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,
        preserveViewport: true,
        polylineOptions: {strokeColor: '#20395F'}
    });

    directionsService.route({
        origin: {lat: parseFloat(stations[0]['latitude']), lng: parseFloat(stations[0]['longitude'])},
        destination: {
            lat: parseFloat(stations[stations.length - 1]['latitude']),
            lng: parseFloat(stations[stations.length - 1]['longitude'])
        },
        travelMode: google.maps.TravelMode.TRANSIT,
        transitOptions: {
            modes: ['RAIL']
        }
    }, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });

    map.setZoom(15);
}

function calculate_route_new(directionsService, directionsDisplay, stations) {
    directionsService = new google.maps.DirectionsService;

    if (polyline !== undefined)
        polyline.setMap(null);

    var request = {
        origin: {lat: parseFloat(stations[0]['latitude']), lng: parseFloat(stations[0]['longitude'])},
        destination: {
            lat: parseFloat(stations[stations.length - 1]['latitude']),
            lng: parseFloat(stations[stations.length - 1]['longitude'])
        },
        travelMode: google.maps.TravelMode.TRANSIT,
        transitOptions: {
            modes: ['RAIL']
        }
    };

    var polyline = new google.maps.Polyline({
        path: [],
        strokeColor: '#20395F',
        strokeWeight: 3
    });

    directionsService.route(request, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            var bounds = new google.maps.LatLngBounds();
            var route = response.routes[0];
            var startLocation = {};
            var endLocation = {};

            var path = response.routes[0].overview_path;
            var legs = response.routes[0].legs;
            for (var i = 0; i < legs.length; i++) {
                endLocation.latlng = legs[i].end_location;
                endLocation.address = legs[i].end_address;
                var steps = legs[i].steps;
                for (j = 0; j < steps.length; j++) {
                    var nextSegment = steps[j].path;
                    for (var k = 0; k < nextSegment.length; k++) {
                        polyline.getPath().push(nextSegment[k]);
                        bounds.extend(nextSegment[k]);
                    }
                }
            }

            polyline.setMap(map);
            map.fitBounds(bounds);
            map.setZoom(15);
        }
    });
}
