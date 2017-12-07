var location_marker;
var info_window;

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function mark_stations(client_id) {
    $.getJSON('https://wittos.azure-api.net/projectswift/Client/' + client_id + '?subscription-key=cad8f40544d94efea09bcd5a2237dbc5', function (json) {
        var train_id = json['train_id'];
        $.getJSON('https://wittos.azure-api.net/projectswift/train/' + train_id + '?subscription-key=cad8f40544d94efea09bcd5a2237dbc5', function (json) {
            var stations = [];
            for (var i = 0; i < json['route'].length; ++i) {
                stations.push(json['route'][i]);

                if (i === 0)
                    $('#container').append('<button id="' + "station" + (i + 1) + '" type="button"><img class="dot" src="logo.png"></button>\n');
                else
                    $('#container').append('<button id="' + "station" + (i + 1) + '" type="button"><img class="dot" src="logo.png"></button>\n');

                var latt = parseFloat(json['route'][i]['latitude']);
                var longg = parseFloat(json['route'][i]['longitude']);

                var icon = {
                    path: "M27.648-41.399q0-3.816-2.7-6.516t-6.516-2.7-6.516 2.7-2.7 6.516 2.7 6.516 6.516 2.7 6.516-2.7 2.7-6.516zm9.216 0q0 3.924-1.188 6.444l-13.104 27.864q-.576 1.188-1.71 1.872t-2.43.684-2.43-.684-1.674-1.872l-13.14-27.864q-1.188-2.52-1.188-6.444 0-7.632 5.4-13.032t13.032-5.4 13.032 5",
                    fillColor: '#217ED7',
                    fillOpacity: 1,
                    strokeWeight: 0,
                    scale: 0.55
                };

                var marker = new google.maps.Marker({
                    position: {lat: latt, lng: longg},
                    map: map,
                    icon: icon,
                    title: json['route'][i]['station_name']
                });

                marker.station = json['route'][i];

                marker.addListener('click', function () {
                    get_pois(this.station);
                });

                marker.addListener('click', function () {
                    if (info_window !== undefined)
                        info_window.close();

                    info_window = new google.maps.InfoWindow({
                        content: this.title
                    });

                    info_window.open(map, this);
                });
            }

            $('#container').append('<span class="stretch"></span>');
            calculate_route_new(directionsService, directionsDisplay, stations);
        });
    });
}

function get_route(client_id) {
    $.getJSON('https://wittos.azure-api.net/projectswift/Client/' + client_id + '?subscription-key=cad8f40544d94efea09bcd5a2237dbc5', function (json) {
        var next_station_code = json['next_station_code'];
        var train_id = json['train_id'];

        $.getJSON('https://wittos.azure-api.net/projectswift/train/' + train_id + '?subscription-key=cad8f40544d94efea09bcd5a2237dbc5', function (json) {
            for (var i = 0; i < json['route'].length; ++i) {
                if (json['route'][i]['station_code'] === next_station_code)
                    get_pois(json['route'][i]);
            }

            var lat = parseFloat(json['latitude']);
            var long = parseFloat(json['longitude']);

            if (location_marker !== undefined)
                location_marker.setMap(null);

            var icon = {
                url: "train.png",
                scaledSize: new google.maps.Size(32, 32),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 0)
            };

            var train = {
                path: "M39.168-64.439q6.66 0 11.394 3.366t4.734 8.154v32.256q0 4.68-4.518 7.992t-10.998 3.492l7.668 7.272q.576.54.288 1.26t-1.08.72h-38.016q-.792 0-1.08-.72t.288-1.26l7.668-7.272q-6.48-.18-10.998-3.492t-4.518-7.992v-32.256q0-4.788 4.734-8.154t11.394-3.366h23.04zm-11.52 48.384q2.88 0 4.896-2.016t2.016-4.896-2.016-4.896-4.896-2.016-4.896 2.016-2.016 4.896 2.016 4.896 4.896 2.016zm20.736-20.736v-18.432h-41.472v18.432h41.472z",
                fillColor: '#57c264',
                fillOpacity: 1,
                strokeWeight: 0,
                scale: 0.45
            };

            if (json['latitude'] !== undefined && json['latitude'] !== null && json['latitude'] !== '') {
                location_marker = new google.maps.Marker({
                    position: {lat: lat, lng: long},
                    map: map,
                    icon: train,
                    zIndex: 99999999
                });

                map.panTo(location_marker.getPosition());
            }
        });
    });
}


function get_pois(station_json) {
    var station_code = station_json['station_code'];
    $.getJSON('https://wittos.azure-api.net/projectswift/poi/' + station_code + '?subscription-key=cad8f40544d94efea09bcd5a2237dbc5', function (json) {
        $('#mainzone').empty();
        var pois = [];
        for (var i = 0; i < json['resources'].length; ++i)
            pois.push(json['resources'][i]);

        pois.sort(compare_event_times);

        for (i = 0; i < pois.length; ++i) {
            //$('#mainzone').append('<div class="card" style="width:30%!important; height:300px; margin: 15px;"><div class="content text-center" style="overflow: auto; height:95%;"><div id="titleC">'+pois[i]['title']+'</div><hr style="width:100%"><div id="contentC">'+pois[i]['content']+'</div><div id="website"><a href="'+pois[i]['website']+'" style="text-decoration:none!important" target="_blank"><i class="fa fa-ticket ticket fa-3x"></i><br>GET TICKET</a></div></div></div>');

            var title = pois[i]['title'];
            var content = pois[i]['content'];
            var image = pois[i]['image'];
            var datetime = pois[i]['performance_date'] + '/' + pois[i]['performance_time'];
            var gmaps = 'http://maps.google.com/maps?q=loc:' + pois[i]['latitude'] + ',' + pois[i]['longitude'];
            var venue = pois[i]['performance_place'];
            var station = station_json['station_name'];
            var price = pois[i]['ticket_summary'];
            var website = pois[i]['website'];
            var discount = pois[i]['discount'] !== '' ? '<div id="special_offer" style="color:red"><i class="fa fa-map-marker map-marker" style="color:white"></i>SPECIAL OFFER</div>' : '';
            

            $('#mainzone').append('<div class="text-center" style="background-color:rgb(241, 244, 245);width:100%!important;margin-top:10px">                    <div class="card" style="max-width:500px;padding:5px;">                        <div class="content text-center" style="padding:5px!important">                            <div id="titleC" style="font-size:1.3em;font-weight:bold;vertical-align:middle;text-align:left;margin-bottom:5px;">' + title + '</div>                            <div class="content" style="white-space:nowrap;padding:4px!important;text-align:left;">                                <div class="content text-center " id="imgC" style="display:inline-block; vertical-align:top;position:relative;padding:0!important;margin-right:3px;"><img src="' + image + '" style="max-width:100px;max-height:130px;" alt=""></div>                                <div class="content text-center" style="font-size:0.68em!important;text-align:left;display:inline-block;vertical-align:top;position:relative;padding:0!important;font-size:0.8em;"><i class="fa fa-calendar calendar"></i>  Date &amp; Time: ' + datetime + '<br><a href="' + gmaps + '" target="_blank" style="text-decoration: none"><i class="fa fa-location-arrow location-arrow"></i>  Location: ' + venue + '</a> <br><i class="fa fa-map-marker map-marker"></i>  Nearest station:' + station + '<br>'+discount+'</div>                            </div>                            <a href="' + website + '" style="text-decoration:none!important;color:black" target="_blank"><div class="btn btn-warning content text-center" id="website" style="margin:5px;color:white;padding-top:7px;padding-bottom:7px;"><i id="ticket" class="fa fa-ticket ticket" style="color:white;"></i> BUY TICKETS £' + price + '</div></a>                            <div id="contentC" style="text-align:left; margin-left:5px"> ' + content + ' </div>                    </div>            </div></div>');
        }
    });
}

function compare_event_times(event1, event2) {
    var date1 = event1['performance_date'], date2 = event2['performance_date'];
    var time1 = event1['performance_time'], time2 = event2['performance_time'];

    var y1 = parseInt(date1.slice(0, 4)), y2 = parseInt(date2.slice(0, 4));
    if (y1 === y2) {
        var mo1 = parseInt(date1.slice(5, 7)), mo2 = parseInt(date2.slice(5, 7));
        if (mo1 === mo2) {
            var d1 = parseInt(date1.slice(8, 10)), d2 = parseInt(date2.slice(8, 10));
            if (d1 === d2) {
                var h1 = parseInt(time1.slice(0, 2)), h2 = parseInt(time2.slice(0, 2));
                if (h1 === h2) {
                    var m1 = parseInt(time1.slice(3, 5)), m2 = parseInt(time2.slice(3, 5));
                    return (m1 < m2 ? -1 : 1);
                }
                else return (h1 < h2 ? -1 : 1);
            }
            else return (d1 < d2 ? -1 : 1);
        }
        else return (mo1 < mo2 ? -1 : 1);
    }
    else return (y1 < y2 ? -1 : 1);
}

function get_short_date(date) {
    var month = parseInt(date.slice(5, 7));
    var day = parseInt(date.slice(8, 10));

    var today = new Date();
    var cur_month = today.getMonth(), cur_day = today.getDay();

}


function parseQueryString(url) {
    var urlParams = {};
    url.replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function ($0, $1, $2, $3) {
            urlParams[$1] = $3;
        }
    );

    return urlParams;
}

$(document).ready(function () {
    var url = location.search;
    var params = parseQueryString(url);

    mark_stations(params['client_id']);
    get_route(params['client_id']);

    setInterval(function () {
        get_route(params['client_id']);
    }, 60000);
});
