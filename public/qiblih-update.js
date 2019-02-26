/*

qiblih-update.js

Using Google maps API v3

Authors: William Cooley, Kate Diver
Date: 23 Feb 2019

Based on work done by Hamid Zarrabi-Zadeh
Source: http://eQibla.com
License: Creative Commons Attribution 3.0
         http://creativecommons.org/licenses/by/3.0
Modified for: http://qiblih.com/

*/

var Qibla = {

	// constants: translations go here
	addressBarMsg: 'Enter your address',

	// icons used in the map
	kabaIcon:  {image: 'https://qiblih.com/images/ftr-star.png',  width: 17, height: 17},
	homeRIcon: {image: 'https://qiblih.com/images/rmarker.png', width: 15, height: 20},
	homeLIcon: {image: 'https://qiblih.com/images/lmarker.png', width: 15, height: 20},

	// Qiblih coordinates
	kabaLat: 32.943529,
	kabaLng: 35.091834,
	homeLat: 42.074481,
	homeLng: -87.684267,
	zoom: 14,

	// constructor
	init: function() {
		console.log('initialising..');
	},

	// destructor
	unload: function() {
		console.log('unload');
	}
}



//-------------------------- Public Methods --------------------------


// start displaying qibla on map
Qibla.startMap = function() {
	this.home = new google.maps.LatLng(this.homeLat, this.homeLng);
	this.kaba = new google.maps.LatLng(this.kabaLat, this.kabaLng);
	this.initMap();

}

//--------------------------- Initializer -----------------------------


// initialize the map
Qibla.initMap = function() {

	this.map = new google.maps.Map(
		document.getElementById('QMap'), {
		center: this.home,
		zoom: this.zoom,
		mapTypeId: google.maps.MapTypeId.TERRAIN	
	});

	// Try HTML5 geolocation - user must allow browser to detect their location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            
            this.map.setCenter(pos);
        });
    }


}


//-------------------------- Misc Functions -----------------------

Qibla.init();



