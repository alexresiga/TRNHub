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

                var icon ={
                    path: "M27.648-41.399q0-3.816-2.7-6.516t-6.516-2.7-6.516 2.7-2.7 6.516 2.7 6.516 6.516 2.7 6.516-2.7 2.7-6.516zm9.216 0q0 3.924-1.188 6.444l-13.104 27.864q-.576 1.188-1.71 1.872t-2.43.684-2.43-.684-1.674-1.872l-13.14-27.864q-1.188-2.52-1.188-6.444 0-7.632 5.4-13.032t13.032-5.4 13.032 5",
                    fillColor: '#217ED7',
                    fillOpacity: 1,
                    strokeWeight: 0,
                    scale: 0.55,
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
                        content: "<div style='text-align:center'><p>"+this.title+"<br>Select station for event listing</p></div>"
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
            
            var train = {
                path: "M39.168-64.439q6.66 0 11.394 3.366t4.734 8.154v32.256q0 4.68-4.518 7.992t-10.998 3.492l7.668 7.272q.576.54.288 1.26t-1.08.72h-38.016q-.792 0-1.08-.72t.288-1.26l7.668-7.272q-6.48-.18-10.998-3.492t-4.518-7.992v-32.256q0-4.788 4.734-8.154t11.394-3.366h23.04zm-11.52 48.384q2.88 0 4.896-2.016t2.016-4.896-2.016-4.896-4.896-2.016-4.896 2.016-2.016 4.896 2.016 4.896 4.896 2.016zm20.736-20.736v-18.432h-41.472v18.432h41.472z",
                fillColor: '#57c264',
                fillOpacity: 1,
                strokeWeight: 0,
                scale: 0.45
            }

            location_marker = new google.maps.Marker({
                position: {lat: lat, lng: long},
                map: map,
                icon: train,
                zIndex: 99999999
            });

            map.panTo(location_marker.getPosition());
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
            cardString += '" target="_blank" style="text-decoration: none"><i class="fa fa-location-arrow location-arrow fa-3x"></i> <br>LOCATION <br> </a> </div> <div class="content text-center" id="calendar" style="display:inline-block; vertical-align:top;position:relative;"><i class="fa fa-calendar calendar fa-3x"></i> <br> DATE & TIME<br>';
            cardString += json['resources'][i]['performance_date'] + '<br>';
            cardString += json['resources'][i]['performance_time'];
            cardString += '</div><div class="content text-center" id="website" style="display:inline-block; vertical-align:top;position:relative;"> <a href="';
            cardString += json['resources'][i]['website'];
            cardString += '" style="text-decoration:none!important" target=_blank> <i class="fa fa-ticket ticket fa-3x"></i> <br> BUY TICKETS <br>'
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
