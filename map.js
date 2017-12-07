var directionsService;
var directionsDisplay;

function initMap() {
    var uluru = {lat: 55.894424, lng: -3.685716};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: uluru
    });

    // get route from A to B
    //calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, stations) {
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = [];

    directionsDisplay = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,
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
    
