google.maps.event.addDomListener(window, 'load', initialize_map);

var map = null;
var infowindow;
var marcadoresGoogleMaps = new Array();
var places = [
	{
		title : 'La Sagrada Familia',
		subtitle : 'Carrer de la Marina 266-270',
		link : 'http://www.sagradafamilia.cat',
		latitude: 41.404095,
		longitude: 2.174582 
	},
	{
		title: "Zoo de Barcelona",
		subtitle: "Parc de la Ciutadella",
		link: "http://www.zoobarcelona.cat/",
		latitude: 41.3883324, 
		longitude: 2.1862068	
	}
];

// Mostramos el mapa de Barcelona cuando cargue la webview
var center = {
	latitude : 41.3964218,
	longitude : 2.1584996,
	zoom : 13
};

function initialize_map() {
	var mapOptions = {
    	zoom: center.zoom,
    	center: new google.maps.LatLng(center.latitude, center.longitude),
    	zoomControl: true,
		mapTypeControl: false,
		scaleControl: false,
		streetViewControl: false,
		rotateControl: false
	};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	
	// Close the info window when clicking on th map
	map.addListener('click', function(event) {
    	return false;
  	});
	
	var map_canvas = document.getElementById('map-canvas');
	map_canvas.setAttribute('style', 'height: ' + window.innerHeight + 'px');
		
	showMarkers();
}

function getRandom(min, max) {
	return Math.random() * (max - min) + min;
}

function addMarker() {
	removeMarkers();
	
	var newPlace = {
		title : 'Titulo nuevo lugar... ',
		subtitle : '',
		link : 'http://www.google.es',
		latitude : getRandom(41.35, 42),
		longitude : getRandom(2.10, 2.20)
	};
	
	console.debug(newPlace);
	
	marcadoresGoogleMaps.push(newPlace);
	
	console.debug(marcadoresGoogleMaps);
	
	showMarkers();
}

function removeMarkers() {
	console.debug(marcadoresGoogleMaps);
	for(var i = 0; i < marcadoresGoogleMaps.length; i++) {
		marcadoresGoogleMaps[i].setMap(null);
		console.debug(marcadoresGoogleMaps[i]);
	}
}

/**
 * Posiciona en el mapa el listado de marcadores
 * @param {Object} markers
 */
function showMarkers() {	
	for(var i = 0, total = places.length; i < total; i++) {
		var marker = new google.maps.Marker({
	    	position: new google.maps.LatLng(
	  			places[i].latitude, 
	  			places[i].longitude
	  		),
	  		map : map,
	    	icon: 'marker.png',
	    	markerId : i
		});
		
		marcadoresGoogleMaps.push(marker);
		
		infowindow = new google.maps.InfoWindow();
		
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.close();
			
			var markerId = (typeof(this.markerId) !== "undefined") ? this.markerId : 0;

			var content = '<strong>' + marcadoresGoogleMaps[markerId].title + '</strong><br />';
			
			if(typeof(marcadoresGoogleMaps[markerId].subtitle !== "undefined")) {
				content += '<i>(' + marcadoresGoogleMaps[markerId].subtitle + ')</i><br />';
			}
			
			if(typeof(marcadoresGoogleMaps[markerId].link !== "undefined")) {
				content += '<a href="' + marcadoresGoogleMaps[markerId].link + '">' + marcadoresGoogleMaps[markerId].link + '</a>';
			}
	
			infowindow.setContent(content);
	    	infowindow.open(map, this);
	  	});
	  	
	  	
	}
}