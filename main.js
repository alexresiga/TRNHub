var sub_key = "d6dc566f2a46403b864c10236aece6b8"
var get_activated_trains_url = "https://wittos.azure-api.net/projectswift/trains"
var get_train_details_url = "https://wittos.azure-api.net/projectswift/train/"

function get_activated_trains() {
	$.getJSON('https://wittos.azure-api.net/projectswift/trains?subscription-key=d6dc566f2a46403b864c10236aece6b8', function(data) {
		console.log(data)
	});
}

function get_train_details(train_id, func) {
	$.getJSON('https://wittos.azure-api.net/projectswift/train/'+train_id+'?subscription-key=d6dc566f2a46403b864c10236aece6b8', function(data) {
		func(data);
	});
}

function get_train_online_clients(train_id, profile) {
	$.getJSON('https://wittos.azure-api.net/projectswift/train/'+train_id+'/'+profile+'?subscription-key=d6dc566f2a46403b864c10236aece6b8', function(data) {
		
	});
}

function get_client_details(client_id, func) {
	$.getJSON('https://wittos.azure-api.net/projectswift/Client/'+client_id+'?subscription-key=d6dc566f2a46403b864c10236aece6b8', function(data) {
		func(data);
	});
}

function get_station_poi(station_code, func) {
	$.getJSON('https://wittos.azure-api.net/projectswift/poi/'+station_code+'?subscription-key=d6dc566f2a46403b864c10236aece6b8', function(data) {
		func(data);
	});
}

function mark_stations(json) {
    for (var i = 0; i < json['route'].length; ++i) {
        var latt = parseFloat(json['route'][i]['latitude']);
        var longg = parseFloat(json['route'][i]['longitude']);


        var icon = {
		    url: "logo.png", // url
		    scaledSize: new google.maps.Size(16, 16), // scaled size
		    origin: new google.maps.Point(0,0), // origin
		    anchor: new google.maps.Point(0, 0) // anchor
		};

        var marker = new google.maps.Marker({
            position: {lat: latt, lng: longg},
            map: map,
            icon: icon
        });

        if (i==0 || i==5) {
	        var infowindow = new google.maps.InfoWindow({
	    		content: json['route'][i]['station_name']
	  		});
    		
    		infowindow.open(map, marker);
    	}
    }
}
function get_route(client_id) {
	get_client_details(client_id, function(json) {
		var next_station_code = json['next_station_code'];
		get_train_details(json['train_id'], function(json) {
			var station_index = 0;
			console.log(json);
			route = json['route'];
			for(var i=1;i<7;++i) {
				if (next_station_code==json['route'][i-1]['station_code'])
					station_index = i-1;
				$('#station'+i).attr('tooltip', json['route'][i-1]['station_name']+'\u000aArrival Time: '+json['route'][i-1]['scheduled_arrival_time'] +'\u000aDeparture Time: '+json['route'][i-1]['scheduled_departure_time']);
				$('#station'+i).attr('name', json['route'][i-1]['station_code']);
			}

			for(var i=0;i<station_index;++i) {
				$('#station'+(i+1)).attr('style', 'opacity: 0.65');
			}

			console.log(station_index);

			var last_departure = json['route'][station_index-1]['scheduled_departure_time'];
			var departure_hours = parseInt(last_departure.slice(0, 2));
			var departure_minutes = parseInt(last_departure.slice(3, 5));
			var departure_seconds = parseInt(last_departure.slice(6, 8));
			
			console.log(departure_hours);
			console.log(departure_minutes);
			console.log(departure_seconds);

			var d = new Date()
			var hours = (((d.getHours()-2)%24)+24)%24;
			var minutes = d.getMinutes();
			var seconds = d.getSeconds();

			console.log(hours);
			console.log(minutes);
			console.log(seconds);

			var time_since_departure = (hours*3600+minutes*60+seconds) - (departure_hours*3600+departure_minutes*60+departure_seconds);

			var next_arrival = json['route'][station_index]['scheduled_arrival_time'];
			var arrival_hours = parseInt(next_arrival.slice(0, 2));
			var arrival_minutes = parseInt(next_arrival.slice(3, 5));
			var arrival_seconds = parseInt(next_arrival.slice(6, 8));
			var time_between_stations = (arrival_hours*3600+arrival_minutes*60+arrival_seconds) - (departure_hours*3600+departure_minutes*60+departure_seconds);

			console.log(time_since_departure);
			

			console.log('------------------');
			console.log(time_since_departure);
			console.log(time_between_stations);

			var pval = (100*1.0/5*(station_index-1));
			console.log(pval);

			pval = Math.max(pval, pval + (time_since_departure/time_between_stations*1.0/5)*100);
			console.log(pval);

			$('#pbar').attr('style', 'width: ' + pval + '%');
		});
	});
}


function get_pois(element) {
	station_code = $(element).attr('name');
	get_station_poi(station_code, function(json) {
		console.log(json);
		$('#mainzone').empty();
		for(var i=0;i<json['resources'].length;++i) {
			//$('#mainzone').append('<div class="card" style="width:30%!important; height:300px; margin: 15px;"><div class="content text-center" style="overflow: auto; height:95%;"><div id="titleC">'+json['resources'][i]['title']+'</div><hr style="width:100%"><div id="contentC">'+json['resources'][i]['content']+'</div><div id="website"><a href="'+json['resources'][i]['website']+'" style="text-decoration:none!important" target="_blank"><i class="fa fa-ticket ticket fa-3x"></i><br>GET TICKET</a></div></div></div>');
			$('#mainzone').append('<div class="card" style="width:32%!important; height:400px; margin: 5px;"> <div class="content text-center" style="height:300px" ><div id="titleC" style="font-size:0.7vw;font-weight:bold">'+json['resources'][i]['title']+'<hr style="width:100%"></div> <div id="contentC" style="overflow: auto!important; height:95%;position:relative">'+json['resources'][i]['content']+'</div><div id="website"> <a href="'+json['resources'][i]['website']+'" style="text-decoration:none!important" target=_blank> <i class="fa fa-ticket ticket fa-3x"></i> <br> GET TICKET</a>  </div></div></div>');
		}
	});
}

$(document).ready(function () {
	console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA");
	get_train_details(1085, mark_stations);
	get_route('EC1B5C484747C8AE6607431A920E57468496C318BCF3245EC8034D53ACBBB6AC');
	setInterval(function(){get_route('EC1B5C484747C8AE6607431A920E57468496C318BCF3245EC8034D53ACBBB6AC');}, 7500);
});