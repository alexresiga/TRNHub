var location_marker;
var info_window;

function mark_stations(client_id) {
    $.getJSON('https://wittos.azure-api.net/projectswift/Client/'+client_id+'?subscription-key=d6dc566f2a46403b864c10236aece6b8', function(json) {
       var train_id = json['train_id'] ;
        $.getJSON('https://wittos.azure-api.net/projectswift/train/' + train_id + '?subscription-key=d6dc566f2a46403b864c10236aece6b8', function (json) {
            for (var i = 0; i < json['route'].length; ++i) {
                if (i===0)
                    $('#container').append('<button id="' + "station"+(i+1) + '" type="button"><img class="dot" src="logo.png"></button>\n');
                else
                    $('#container').append('<button id="' + "station"+(i+1) + '" type="button"><img class="dot" src="logo.png"></button>\n');

                var latt = parseFloat(json['route'][i]['latitude']);
                var longg = parseFloat(json['route'][i]['longitude']);


                var icon = {
                    url: "logo.png",
                    scaledSize: new google.maps.Size(32, 32),
                    origin: new google.maps.Point(0,0),
                    anchor: new google.maps.Point(0, 0)
                };

                var marker = new google.maps.Marker({
                    position: {lat: latt, lng: longg},
                    map: map,
                    icon: icon,
                    title: json['route'][i]['station_name']
                });

                marker.station_code = json['route'][i]['station_code'];

                marker.addListener('click', function () {
                    get_pois(this.station_code);
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

            $('#container').append('<span class="stretch"></span>')
        });
    });
}
function get_route(client_id) {
    $.getJSON('https://wittos.azure-api.net/projectswift/Client/'+client_id+'?subscription-key=d6dc566f2a46403b864c10236aece6b8', function(json) {
        var next_station_code = json['next_station_code'];
        get_pois(next_station_code);
        var train_id = json['train_id'];

        $.getJSON('https://wittos.azure-api.net/projectswift/train/'+train_id+'?subscription-key=d6dc566f2a46403b864c10236aece6b8', function(json) {
            var lat = parseFloat(json['latitude']);
            var long = parseFloat(json['longitude']);

            if (location_marker !== undefined)
                location_marker.setMap(null);

            var icon = {
                url: "train.png",
                scaledSize: new google.maps.Size(32, 32),
                origin: new google.maps.Point(0,0),
                anchor: new google.maps.Point(0, 0)
            };

            location_marker = new google.maps.Marker({
                position: {lat: lat, lng: long},
                map: map,
                icon: icon,
                zIndex:-99999999
            });

            map.panTo(location_marker.getPosition());

            var station_index = 0;
            for(i=0;i<json['route'].length;++i) {
                if (next_station_code===json['route'][i]['station_code'])
                    station_index = i;
            }

            if(next_station_code === '')
            {
                for(var i=0;i<json['route'].length;++i) {
                    $('#station' + (i + 1)).attr('style', 'opacity: 0.65');
                }
                return;
            }

            for(i=0;i<station_index;++i) {
                $('#station'+(i+1)).attr('style', 'opacity: 0.65');
            }

            var last_departure = json['route'][station_index-1]['scheduled_departure_time'];
            var departure_hours = parseInt(last_departure.slice(0, 2));
            var departure_minutes = parseInt(last_departure.slice(3, 5));
            var departure_seconds = parseInt(last_departure.slice(6, 8));


            var d = new Date();
            var hours = (((d.getHours()-2)%24)+24)%24;
            var minutes = d.getMinutes();
            var seconds = d.getSeconds();


            var time_since_departure = (hours*3600+minutes*60+seconds) - (departure_hours*3600+departure_minutes*60+departure_seconds);

            var next_arrival = json['route'][station_index]['scheduled_arrival_time'];
            var arrival_hours = parseInt(next_arrival.slice(0, 2));
            var arrival_minutes = parseInt(next_arrival.slice(3, 5));
            var arrival_seconds = parseInt(next_arrival.slice(6, 8));
            var time_between_stations = (arrival_hours*3600+arrival_minutes*60+arrival_seconds) - (departure_hours*3600+departure_minutes*60+departure_seconds);

            var pval = (100/5*(station_index-1));
            pval = Math.max(pval, pval + (time_since_departure/time_between_stations/5)*100);

            $('#pbar').attr('style', 'width: ' + pval + '%');
        });
    });
}


function get_pois(station_code) {
    $.getJSON('https://wittos.azure-api.net/projectswift/poi/'+station_code+'?subscription-key=d6dc566f2a46403b864c10236aece6b8', function(json) {
        $('#mainzone').empty();
        for(var i=0;i<json['resources'].length;++i) {
            //$('#mainzone').append('<div class="card" style="width:30%!important; height:300px; margin: 15px;"><div class="content text-center" style="overflow: auto; height:95%;"><div id="titleC">'+json['resources'][i]['title']+'</div><hr style="width:100%"><div id="contentC">'+json['resources'][i]['content']+'</div><div id="website"><a href="'+json['resources'][i]['website']+'" style="text-decoration:none!important" target="_blank"><i class="fa fa-ticket ticket fa-3x"></i><br>GET TICKET</a></div></div></div>');

            var cardString = "";
            cardString += '<div class="card" style="width:100%!important;margin-left:0px!important;margin-right:0px!important;margin-bottom: 5px;"> <div class="content text-center"  ><div id="titleC" style="font-size:1.5em;font-weight:bold">';
            cardString += json['resources'][i]['title'];
            cardString += '<hr style="width:100%"></div> <div id="imgC"><img src="'
            cardString += json['resources'][i]['image'];
            cardString += '" style="max-width:150px;max-height:150px;" alt=""></div><br><div id="contentC" style="text-align:left">';
            cardString += json['resources'][i]['content'];
            cardString += '</div><div class="content text-center" style="white-space:nowrap;padding:0!important"><div class="content text-center" id="location" style="display:inline-block; vertical-align:top;position:relative;"> <a href="https://www.google.co.uk/maps/@';
            cardString += json['resources'][i]['latitude']+',';
            cardString += json['resources'][i]['longitude']+',15z';
            cardString += '" target="_blank" style="text-decoration: none"><i class="fa fa-map-marker map-marker fa-3x"></i> <br>LOCATION <br> </a> </div> <div class="content text-center" id="calendar" style="display:inline-block; vertical-align:top;position:relative;"><i class="fa fa-calendar calendar fa-3x"></i> <br> DATE & TIME<br>';
            cardString += json['resources'][i]['performance_date'] + '<br>';
            cardString += json['resources'][i]['performance_time'];
            cardString += '</div><div class="content text-center" id="website" style="display:inline-block; vertical-align:top;position:relative;"> <a href="';
            cardString += json['resources'][i]['website'];
            cardString += '" style="text-decoration:none!important" target=_blank> <i class="fa fa-ticket ticket fa-3x"></i> <br> GET TICKETS <br>'
            cardString += '£' + json['resources'][i]['ticket_summary'];
            cardString += ' </a></div></div></div></div>';

            $('#mainzone').append(cardString);
        }
    });
}

function parseQueryString(url) {
    var urlParams = {};
    url.replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function($0, $1, $2, $3) {
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
    setInterval(function(){get_route(params['client_id']);}, 30000);
});
