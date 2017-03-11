/**
 * Calcula una ruta de puntos entre la posicion inicial del usuario y el destino.
 * Algoritmo de cálculo de ruta por Aitor Alsina
 *
 * @author Jonatan Jumbert
 */
var TraceRoute = {
	findRoute : function(args) {
		if(typeof(args.currentPosition) !== "undefined" && typeof (args.goTo) !== "undefined") {
			var places = require('/data/places').get();

			if ( typeof (places[args.goTo] !== "undefined")) {
				// API de rutas de Google: https://developers.google.com/maps/documentation/directions
				var url = "http://maps.googleapis.com/maps/api/directions/json?origin=" + args.currentPosition.latitude + "," + args.currentPosition.longitude + "&destination=" + places[args.goTo].latitude + "," + places[args.goTo].longitude + "&sensor=true";

				var xhr = Titanium.Network.createHTTPClient();
				xhr.open('GET', url);
				debugAppData('URL: ' + url);

				xhr.onload = function() {
					var xml = this.responseText;
					var points = [];

					// Obtenemos todas las posiciones de la ruta
					var position = JSON.parse(this.responseText).routes[0].legs[0].steps;
					if(position[0] != null) {
						points.push({
							lat : position[0].start_location.lat,
							lng : position[0].start_location.lng,
						});

						// Here we use the for loop to collect all the steps and push it to the array and use this array to form the route in android.
						for (var i = 0; i < position.length; i++) {
							points.push({
								lat : position[i].end_location.lat,
								lng : position[i].end_location.lng,
							});
						}
					} else {
						debugAppData('No se ha encontrado ninguna ruta');
					}

					if(points) {
						// Si hemos encontrado una ruta válida, notificamos a la webview para que la pinte.
						Ti.App.fireEvent('app:fromTitanium', {
					   		message: 'show_route', 
					   		route: points
					   	});
					   	debugAppData(points);
					}
				};

				// Enviamos la petición al API de google
				xhr.send();
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
};
exports.getObj = TraceRoute;