function getPlaces() {
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
    	
	var customMarkers = Ti.App.Properties.getString(Ti.App.MapApp.customMarkers, "");
	if(customMarkers != "") {
		customMarkers = JSON.parse(customMarkers);
	} else {
		customMarkers = new Array();
	}
	
	for(var i = 0, total = customMarkers.length; i < total; i++) {
		places.push(customMarkers[i]);
	}
	
	return places;
};

exports.get = getPlaces;