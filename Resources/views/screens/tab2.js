function Tab2() {
    this.box = null;

    this.window = null;
    this.tab = null;
    var self = this;
    
    // Para guardar el marker con los datos introducidos
    this.title = null;
    this.subTitle = null;
    this.link = null;
    this.latitude = null;
    this.longitude = null;
    
    this.buildTab = function() {
		this.window = Titanium.UI.createWindow({  
	    	title: L('TAB2_TITLE'),
	    	backgroundColor: Ti.App.MapApp.colors.white
		});
	
		this.tab = Titanium.UI.createTab({  
		    icon: '/media/marker.png',
		    title: L('TAB2_TITLE'),
		    window: this.window
		});
    };
    
    this.buildContent = function() {
    	var box = Ti.UI.createView({
            layout: 'vertical'
        });
        
    	var textFieldTitle = Ti.UI.createTextField({
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			color: Ti.App.MapApp.colors.textField,
			hintText: L('TAB2_ADD_TITLE'),
			top: 10, left: 10, right: 10, height: 40
		});
		this.title = textFieldTitle;
		
		var textFieldSubTitle = Ti.UI.createTextField({
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			color: Ti.App.MapApp.colors.textField,
			hintText: L('TAB2_ADD_SUBTITLE'),
			top: 10, left: 10, right: 10, height: 40
		});
		this.subtitle = textFieldSubTitle;
		
		var textFieldLink = Ti.UI.createTextField({
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			color: Ti.App.MapApp.colors.textField,
			hintText: L('TAB2_ADD_LINK'),
			top: 10, left: 10, right: 10, height: 40
		});
		this.link = textFieldLink;
		
		var textFieldLatitude = Ti.UI.createTextField({
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			color: Ti.App.MapApp.colors.textField,
			hintText: L('TAB2_ADD_LATITUDE'),
			top: 10, left: 10, right: 10, height: 40
		});
		this.latitude = textFieldLatitude;
		
		var textFieldLongitude = Ti.UI.createTextField({
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			color: Ti.App.MapApp.colors.textField,
			hintText: L('TAB2_ADD_LONGITUDE'),
			top: 10, left: 10, right: 10, height: 40
		});
		this.longitude = textFieldLongitude;
		
		var submitButton = Ti.UI.createButton({
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			color : Ti.App.MapApp.colors.white,
			title : L('TAB2_ADD'),
			backgroundColor : Ti.App.MapApp.colors.lightBlue,
			top: 20, left: 10, right: 10, height: 40
		});
		
		submitButton.addEventListener('click', function(e) {
			self.saveMarker();
		});
				
		box.add(textFieldTitle);
		box.add(textFieldSubTitle);
		box.add(textFieldLink);
		box.add(textFieldLatitude);
		box.add(textFieldLongitude);
		box.add(submitButton);

        this.box = box;
        this.window.add(this.box);
    };
    
    this.saveMarker = function() {
    	var ActivityIndicator = require('/views/components/activityindicator').getObj;
    	var CustomDialog = require('/views/components/dialogs').getObj;
    	
		var actIndicator = ActivityIndicator.create({
			message: L('TAB2_SAVING_MSG'),
			color: Ti.App.MapApp.colors.lightBlue
		});
		this.box.add(actIndicator);
    	
		var title = this.title.getValue();
		var subTitle = this.subtitle.getValue();
		var link = this.link.getValue();
		var latitude = this.latitude.getValue();
		var longitude = this.longitude.getValue();
		
		// Comprobamos que ha completado los campos obligatorios...
		var error = false;
		if(title == "") {
			CustomDialog.error({message : L("TAB2_TITLE_MANDATORY")});
			error = true;
		} else {
			if(subTitle == "") {
				CustomDialog.error({message : L("TAB2_SUBTITLE_MANDATORY")});
				error = true;
			} else {
				if(latitude == "") {
					CustomDialog.error({message : L("TAB2_LATITUDE_MANDATORY")});
					error = true;
				} else {
					if(longitude == "") {
						CustomDialog.error({message : L("TAB2_LONGITUDE_MANDATORY")});
						error = true;
					}
				}
			}
		}
		// XXX podria haber muchas otras validaciones pero con esas creo que se entiende...
		
		// Guardamos los datos...
		if(!error) {
			actIndicator.show(); // Mostramos un indicador de actividad mientras procesamos los datos...
			
			var customMarkers = Ti.App.Properties.getString(Ti.App.MapApp.customMarkers, "");
			if(customMarkers != "") {
				customMarkers = JSON.parse(customMarkers);
			} else {
				customMarkers = new Array();
			}
			
			var currentMarker = {
				title : title,
				subtitle : subTitle,
				link : link,
				latitude : latitude,
				longitude : longitude
			};
			
			customMarkers.push(currentMarker);
			Ti.App.Properties.setString(Ti.App.MapApp.customMarkers, JSON.stringify(customMarkers));
			
			// Notificamos a la webview de la tab1, que tenemos nuevos marcadores...
			Ti.App.fireEvent('app:fromTitanium', {
		   		message: 'show_markers', 
		   		markers: require('/data/places').get()
		   	});
		   	
		   	// Habilitamos boton de borrar marcadores
			if(!Ti.App.MapApp.removeMarkers) {
		   		Ti.App.MapApp.removeMarkers = true;
				Ti.App.MapAppRemoveButton.show();
			}
			
			actIndicator.hide();
			
			// If OK... alert 2 botones... añadir otro, o ver el mapa.
			CustomDialog.info({buttons: [
				this.title,
				this.subtitle,
				this.link,
				this.latitude,
				this.longitude
			]});
		}
    };
    
    this.buildTab();
    this.buildContent();
    
    return this.tab;
}

module.exports = Tab2;