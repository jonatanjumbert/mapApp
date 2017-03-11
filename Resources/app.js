Ti.App.MapApp = {
	customMarkers : 'customMarkers',
	colors : {
		'white' : '#fff',
		'gray' : '#eee',
		'black' : '#000',
		'textField' : '#336699',
		'lightBlue' : '467FFC',
	},
	removeMarkers : false,
	debugEnabled : false
};

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Ti.UI.setBackgroundColor(Ti.App.MapApp.colors.white); 

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

var TabMap = require('/views/screens/tab1');
var tabMap = new TabMap();

var TabMarker = require('/views/screens/tab2');
var tabMarker = new TabMarker();

tabGroup.addTab(tabMap);
tabGroup.addTab(tabMarker); 

Ti.App.MapAppTabgroup = tabGroup;

tabGroup.open();

/**
 * Control de mensajes entre Titanium y la WebView
 */
Ti.App.addEventListener("app:fromWebView", function(e) {
	debugAppData('Message received on App: ' + e.message);
	
	switch(e.message) {
		case 'markers_loaded' :
			// Una vez refrescados los marcadores se lo notificamos al usuario..
			
			break;
		case 'find_route' :
			// Dada la posición inicial del usuario, le mostramos una ruta para llegar al destino elegido
			var markerId = parseInt(e.markerId, 10);
			debugAppData("Id del marcador de destino: " + markerId);
			debugAppData("Posicion actual: " + Ti.App.MapAppUserPosition);
			var traceRoute = require('/views/components/traceRoute').getObj;
			traceRoute.findRoute({
				currentPosition : Ti.App.MapAppUserPosition,
				goTo : markerId
			});

			break;
		case 'map_loaded' :
		default :
			// Cuando la webview avisa de que el mapa esta cargado... le enviamos los marcadores.
			Ti.App.fireEvent('app:fromTitanium', {
		   		message: 'show_markers', 
		   		markers: tabMap.markers
		   	});
			break;
	}
});

/**
 * Función que encapsula las llamadas a Ti.API.info para activar/desactivar los mensajes
 * segun si estamos en modo debug o no.
 * @param {Object} message
 */
function debugAppData(message) {
	if(Ti.App.MapApp.debugEnabled) {
		Ti.API.info(message);
	}	
}
