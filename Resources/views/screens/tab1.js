function Tab1() {
    this.box = null;

    this.window = null;
    this.tab = null;
    this.markers = null;
    this.userPosition = null;
    
    this.buildTab = function() {
		this.window = Titanium.UI.createWindow({  
	    	title: L('TAB1_TITLE'),
	    	backgroundColor: Ti.App.MapApp.colors.white
		});
	
		this.tab = Titanium.UI.createTab({  
		    icon: '/media/map.png',
		    title: L('TAB1_TITLE'),
		    window: this.window
		});
    };
    
    this.buildContent = function() {
		var webview = Ti.UI.createWebView({
			url:'/media/map/map.html',
			willHandleTouches: false
		});

		this.box = webview;
		
		this.markers = require('/data/places').get();
        
		// Añadimos los marcadores a la Tab para pasarselos a la webview (aunque tb podriamos pasarlo como variable global en Ti.App)
 		this.tab.markers = this.markers;

		// Boton de eliminar los marcadores..
		var removeButton = Ti.UI.createButton({
			backgroundImage : '/media/trash.png',
			bottom: 30,
			left: 10,
			zIndex : 1,
			hide : Ti.App.MapApp.removeMarkers
		});
		removeButton.addEventListener('click', function(e) {
			// Dialog de confirmación... en base respuesta del usuario borramos o no los marcadores
			var CustomDialog = require('/views/components/dialogs').getObj;
			CustomDialog.confirm(); // TODO personalizar los mensajes del confirm
			
			// Cuando el usuario confirma la accion de eliminar los markers...
			Ti.App.addEventListener("confirm_delete_markers", function(e) {
				// Borramos las properties...
				Ti.App.Properties.removeProperty(Ti.App.MapApp.customMarkers);
				
				// Notificamos a la webview para que los borre del mapa...
				Ti.App.fireEvent('app:fromTitanium', {
			   		message: 'remove_markers', 
			   		markers: require('/data/places').get()
			   	});
				
				// Escondemos el boton...
				Ti.App.MapApp.removeMarkers = false;
				removeButton.hide();
			});
		});
		Ti.App.MapAppRemoveButton = removeButton;
		this.box.add(removeButton);
		
		if(this.tab.markers.length > 2) {
			Ti.App.MapApp.removeMarkers = true; // Habilitamos el tab de eliminar marcadores
			removeButton.show();
		} else {
			Ti.App.MapApp.removeMarkers = false; // Deshabilitamos el tab de eliminar marcadores
			removeButton.hide();
		}
		
		this.window.add(this.box);
    };
    
    this.getCurrentPosition = function() {
    	if(Ti.Platform.name === 'iPhone OS') {
    		Ti.Geolocation.purpose = 'Get Current Location';
			Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
			Ti.Geolocation.distanceFilter = 10;
			Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
			
			Ti.Geolocation.addEventListener('location', function(e) {
			    if (e.error) { 
			    	Ti.API.error('Error al recuperar los datos del GPS: ' + e.error);
			    } else { 
			    	debugAppData('Mostrando datos de coordenadas');
			    	debugAppData(e.coords);
			    	
			    	// Lanzamos un evento a la webview con las coordenadas del usuario...
			    	Ti.App.fireEvent('app:fromTitanium', {
				   		message: 'user_coords', 
				   		coordenadas: e.coords
				   	});
				   	
				   	Ti.App.MapAppUserPosition = e.coords;
			    }
			});
    	}
    };
    
    this.buildTab();
    this.buildContent();
    this.getCurrentPosition();
    
    return this.tab;
}

module.exports = Tab1;