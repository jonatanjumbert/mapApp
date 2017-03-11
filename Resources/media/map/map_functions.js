google.maps.event.addDomListener(window, 'load', initialize_map);

var Ti = window.parent.Ti;
var infowindow;
var map = null;
var markers = null;
var marcadores = new Array();
var coordenadas = null;
var markerImHere = null;
var routePath = null;

// Mostramos el mapa de Barcelona cuando cargue la webview
var center = {
	latitude : 41.3950361,
	longitude : 2.1768218,
	zoom : 13
};

// Control de mensajes Titanium-Webview
Ti.App.addEventListener("app:fromTitanium", function(e) {
	Ti.API.info('Message received on webview: ' + e.message);

	switch(e.message) {
		case 'show_route' :
			// Dibujamos una ruta con los puntos recibidos
			addLine(e.route);
			break;
		case 'user_coords' :
			coordenadas = e.coordenadas;
			imHere(); // Pintamos la posición del usuario
			break;
		case 'remove_markers' :
			Ti.API.info('Borrando los marcadores...');
			deleteMarkers();
			
			Ti.API.info('Mostrando ' + e.markers.length + ' marcadores...');
			markers = e.markers;
	    	showMarkers();
	    	
			break;
		case 'show_markers' :
		default :
			deleteMarkers();
			
			Ti.API.info('Mostrando ' + e.markers.length + ' marcadores...');
	    	markers = e.markers;
	    	showMarkers();
			break;
    }
});

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
    	infowindow.close();
  	});
	
	var map_canvas = document.getElementById('map-canvas');
	map_canvas.setAttribute('style', 'height: ' + window.innerHeight + 'px');

	Ti.App.fireEvent('app:fromWebView', { 
		message: 'map_loaded'   
	});
}

function deleteMarkers() {
	for(var i = 0, total = marcadores.length; i < total; i++) {
		marcadores[i].setMap(null);
	}
	
	// Si hay una ruta también la borramos del mapa.
	if(routePath) {
		removeLine();
	}
}

/**
 * Pinta en el mapa la posición actual del usuario...
 */
function imHere() {
	if(markerImHere != null) {
		markerImHere.setMap(null);
	}
	
	markerImHere = new google.maps.Marker({
    	position: new google.maps.LatLng(
  			coordenadas.latitude, 
  			coordenadas.longitude
  		),
  		map : map,
    	icon: 'you-are-here.png',
	});
}

/**
 * Posiciona en el mapa el listado de marcadores
 * @param {Object} markers
 */
function showMarkers() {	
	for(var i = 0, total = markers.length; i < total; i++) {
		var marker = new google.maps.Marker({
	    	position: new google.maps.LatLng(
	  			markers[i].latitude, 
	  			markers[i].longitude
	  		),
	  		map : map,
	    	icon: 'marker.png',
	    	markerId : i
		});
		
		// Initialize an info window for showing marker's data
		infowindow = new google.maps.InfoWindow();
		
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.close();
			
			var markerId = (typeof(this.markerId) !== "undefined") ? this.markerId : 0;
			var content = '<strong>' + markers[markerId].title + '</strong><br />';
			
			if(typeof(markers[markerId].subtitle !== "undefined")) {
				content += '<i>(' + markers[markerId].subtitle + ')</i><br />';
			}
			
			if(typeof(markers[markerId].link !== "undefined")) {
				content += '<br /><a href="' + markers[markerId].link + '">' + markers[markerId].link + '</a>';
			}
			
			// XXX TODO estaría bien mostrar el Llevame aqui solo si tenemos señal de GPS... y en el idioma actual del dispositivo
			content += "<br /><br /><p style=\"text-align:center\"><a href=\"#\" onclick=\"Ti.App.fireEvent('app:fromWebView', { message: 'find_route', markerId : '" + markerId + "'});\">¡Llévame aquí!</a></p>";

			infowindow.setContent(content);
	    	infowindow.open(map, this);
	  	});
	  	
	  	marcadores.push(marker);
	}
	
	// Avisamos a Titanium que los marcadores ya han sido cargados...
	Ti.App.fireEvent('app:fromWebView', { 
		message: 'markers_loaded'   
	});
}

/**
 * Pinta la ruta de puntos pasada por parametro sobre el mapa.
 * @param {Object} points
 */
function addLine(points) {
	if(routePath) {
		removeLine();
	}

	routePath = new google.maps.Polyline({
		path: points,
		strokeColor: 'blue',
		strokeOpacity: 1.0,
		strokeWeight: 5
	});

	routePath.setMap(map);
}

function removeLine() {
	routePath.setMap(null);
}