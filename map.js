var directionsService;
var directionsDisplay;

function initMap() {
    var uluru = {lat: 55.894424, lng: -3.685716};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: uluru,
        styles: [
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#444444"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#d2d2d2"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 45
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#46bcec"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            }
        ]
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
}
    
