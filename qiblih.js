//------------------------ Copyright Block ------------------------
/* 

qiblih.js: Find Baha'i Qiblih Direction (ver 0.3)

Based on work done by Hamid Zarrabi-Zadeh
Source: http://eQibla.com
License: Creative Commons Attribution 3.0
         http://creativecommons.org/licenses/by/3.0
Modified for: http://qiblih.com/

ChangeLog:  ver 0.2
            added http://www.magnetic-declination.com/ SOAP lookup
            ver 0.3
            Fixed the magnetic declination calc. It was reversed.


*/
//-----------------------------------------------------------------
// PLEASE DO NOT REMOVE THE ABOVE COPYRIGHT BLOCK.


var Qibla = {

	// constants: translations go here
	addressBarMsg: 'Enter your address',

	consts: { 
		north: 'North',
		south: 'South',
		east:  'East',
		west:  'West',
		cw:    'Clockwise',
		ccw:   'Anti-Clockwise',
		from:  'from',
		to:    'toward'
	},

	//----------------------------------------
	
	// icons used in the map
	kabaIcon:  {image: 'http://qiblih.com/images/ftr-star.png',  width: 17, height: 17},
	homeRIcon: {image: 'http://qiblih.com/images/rmarker.png', width: 15, height: 20},
	homeLIcon: {image: 'http://qiblih.com/images/lmarker.png', width: 15, height: 20},

	// display options
	updateMode: 0,          // 0: update on move, 1: update on click
	directionMode: 3,       // 0: 360 degrees, 1: 180 degrees, 2: 90 degrees, 3: 45 degrees
	directionFormat: 2,     // 0: base, 1: rotation, 2: from-toward
	toggleUnits: true,      // enable toggling distance unit
	lineColor: '#FF0000',   // qibla direction line color
	segmentSize: 200000,    // line segments size in meters
	
	// Qiblih coordinates
	kabaLat: 32.943529,
	kabaLng: 35.091834,

	// default values 
	cookieData: [
		{name: 'homeLat', val: 42.074481},
		{name: 'homeLng', val: -87.684267},
		{name: 'mapZoom', val: 14},
		{name: 'mapType', val: 'm'},  // m: map, k: satellite, h: hybrid, p: terrain, e:earth
		{name: 'distanceUnit', val: 0}  // 0: kilometer, 1: mile
	],

	useCookies: true,      // set to false if you don't want cookies
	expireDays: 180,       // number of days cookies are kept in the browser
	cookiesPath: '/',      // the path to which cookies are sent

	// constructor 
	init: function() {
		this.readCookies();
	},

	// destructor
	unload: function() {
		if (this.map) {
			this.saveCookies();
			GUnload(); 
		}
	}
}



//-------------------------- Public Methods --------------------------


// start displaying qibla on map
Qibla.startMap = function(params) {
	if (!window.GBrowserIsCompatible || !GBrowserIsCompatible())
		return;
	
	params = params || {};
	startLat = 1* (params.lat || this.homeLat);
	startLng = 1* (params.lng || this.homeLng);
	startZoom = 1* (params.zoom || this.mapZoom);
	startType = params.type || this.mapType;

	this.initAddressBar();
	this.home = new GLatLng(startLat, startLng);
	this.kaba = new GLatLng(this.kabaLat, this.kabaLng);

	this.initMap();
	this.setMapType(startType);
	
	if (params.addr)
		this.locateAddress(params.addr, true);
	else
		this.map.setCenter(this.home, startZoom);
	
}

// compute the direction between two points
Qibla.getDirection = function(point1, point2) {
	var lat1 = point1.latRadians();
	var lat2 = point2.latRadians();
	var dLng = point2.lngRadians()- point1.lngRadians();
	var angle = Math.atan2(Math.sin(dLng), Math.cos(lat1)* Math.tan(lat2)- Math.sin(lat1)* Math.cos(dLng));
	return (angle* 180.0)/ Math.PI;
}

// reurn qibla direction for a given location
Qibla.getQiblaDirection = function(location) {
	var qiblaDir = this.getDirection(location, this.kaba);
	if (qiblaDir < 0) 
		qiblaDir += 360;
	return qiblaDir;
}

// toggle distance mode 
Qibla.toggleDistanceUnit = function() {
	this.distanceUnit = 1- this.distanceUnit;  
}

// called when container is resized
Qibla.checkResize = function() {
	if (this.map) {
		this.map.checkResize();
		this.addControls();
		this.map.setCenter(this.home);
	}
}


//--------------------------- Initializer -----------------------------


// initialize the map 
Qibla.initMap = function() {
	this.map = new GMap2($('QMap'));
	this.geocoder = new GClientGeocoder();

	this.map.addMapType(G_PHYSICAL_MAP);
	this.map.addMapType(G_SATELLITE_3D_MAP);
	//this.map.removeMapType(G_SATELLITE_MAP);
	this.map.addControl(new GMenuMapTypeControl());
	this.largeMapControl = new GLargeMapControl();
	this.smallMapControl = new GSmallMapControl();
	this.scaleControl = new GScaleControl();
	this.addControls();
	
	this.kabaMarker = new GMarker(this.kaba, {icon: this.initIcon(this.kabaIcon), clickable: false});
	this.homeRMarker = new GMarker(this.kaba, {icon: this.initIcon(this.homeRIcon), clickable: false});
	this.homeLMarker = new GMarker(this.kaba, {icon: this.initIcon(this.homeLIcon), clickable: false});

	if (this.updateMode == 0) 
		GEvent.addListener(this.map, 'move', function(){ Qibla.setHome() });
	else 
		GEvent.addListener(this.map, 'click', function(marker, point){ Qibla.setHome(point, marker) });
	GEvent.addListener(this.map, 'maptypechanged', function(){ Qibla.redraw() });
}

// init controls
Qibla.addControls = function() {
	var height = this.map.getSize().height;
	if (height > 300) {
		this.map.removeControl(this.smallMapControl);
		this.map.addControl(this.largeMapControl);
		this.map.addControl(this.scaleControl);
	}
	else {
		this.map.removeControl(this.largeMapControl);
		this.map.removeControl(this.scaleControl);
		this.map.addControl(this.smallMapControl);
	}
}

// initialize an icon
Qibla.initIcon = function(iconObj) {
	var icon = new GIcon(null, iconObj.image);
	icon.iconSize = new GSize(iconObj.width, iconObj.height);
	icon.iconAnchor = new GPoint(iconObj.width >> 1, iconObj.height >> 1);
	return icon;
}

// initialize address bar 
Qibla.initAddressBar = function() {
	this.addressObj = $('QAddress');
	if (this.addressObj) {
		this.addressObj.onfocus = function(){ Qibla.focusAddressBar(); };
		this.addressObj.onblur = function(){ Qibla.blurAddressBar(); };
		this.blurAddressBar();
	}
}

// get current map type 
Qibla.getMapType = function() {
	return this.map.getCurrentMapType().getUrlArg();
}

// set current map type 
Qibla.setMapType = function(type) {
	var list = this.map.getMapTypes();
	for (var i in list)
		if (list[i].getUrlArg() == type)
			this.map.setMapType(list[i]);
}

// read cookie data
Qibla.readCookies = function() {
	for (var i in this.cookieData) {
		var w = Cookies.get(this.cookieData[i].name);
		if (w == null) w = this.cookieData[i].val;
		Qibla[this.cookieData[i].name] = w; 
	}
	this.distanceUnit *= 1;
}

// save cookie data
Qibla.saveCookies = function() {
	if (!this.useCookies) return;
	this.mapType = this.getMapType();
	this.homeLat = this.home.lat();
	this.homeLng = this.home.lng();
	this.mapZoom = this.map.getZoom();
	for (var i in this.cookieData)
		Cookies.set(this.cookieData[i].name, Qibla[this.cookieData[i].name], this.expireDays, this.cookiesPath);
}


//------------------------- Drawing Functions -----------------------------


// set home point 
Qibla.setHome = function(point, marker) {
	if (marker) 
		point = marker.getPoint();
	this.home = point || this.map.getCenter();
	this.redraw();
}

// update map 
Qibla.redraw = function() {
	var qiblaDir = this.getQiblaDirection(this.home);
	this.homeMarker = qiblaDir < 180 ? this.homeRMarker : this.homeLMarker;

	this.map.clearOverlays();
	this.homeMarker.setPoint(this.home);
	this.map.addOverlay(this.homeMarker);
	this.map.addOverlay(this.kabaMarker);

	this.drawLines();	
	this.writeData();
	if (window.redraw)
		redraw();
}

// draw direction lines
Qibla.drawLines = function() {
	var is3DMap = this.getMapType() == 'e';
	
	if (this.extension) 
		this.extDraw();
	
	var qiblaSegments = is3DMap ? [this.home, this.kaba] : this.greatCircle(this.home, this.kaba);
	this.map.addOverlay(new GPolyline(qiblaSegments, this.lineColor, 4, 0.8));
	
}


//------------------------- Declination Functions -------------------------

var xmlHttp;

Qibla.showDeclination = function()
{ 
xmlHttp=GetXmlHttpObject();
if (xmlHttp==null)
 {
 alert ("Browser does not support HTTP Request");
 return;
 }
var url="getdeclination.php";
url=url+"?lat="+this.home.lat().toFixed(4)+"&lng="+this.home.lng().toFixed(4);
url=url+"&sid="+Math.random();
xmlHttp.onreadystatechange=this.writeDeclination;
xmlHttp.open("GET",url,true);
xmlHttp.send(null);
}

// write information
Qibla.writeDeclination = function() {
  if (xmlHttp.readyState==4 || xmlHttp.readyState=="complete")
  {
  //alert ("declination"+xmlHttp.responseText);
	var declinationstr = xmlHttp.responseText;
	var declination = Number(declinationstr);
	//alert(typeof declination);
	var qiblaDir = Qibla.getQiblaDirection(Qibla.home);
	var qiblaDirmag = qiblaDir-declination;
	// Check if direction is less than 0 or greater than 360
	if (qiblaDirmag < 0)
	{
  var qiblaDirmagReal = 360 + qiblaDirmag;
  } else{
    if (qiblaDirmag > 360)
    {
    var qiblaDirmagReal = qiblaDirmag - 360;
    } else{
      var qiblaDirmagReal = qiblaDirmag;
      }
    }
  var directionmag = Qibla.formatDirection(qiblaDirmagReal);
	Qibla.write('QDirectionmag', directionmag.degrees);
	Qibla.write('QDirLabelmag', directionmag.label)
	if (this.extension) 
		this.extWrite();
  }
}

function GetXmlHttpObject()
{
var xmlHttp=null;
try
 {
 // Firefox, Opera 8.0+, Safari
 xmlHttp=new XMLHttpRequest();
 }
catch (e)
 {
 //Internet Explorer
 try
  {
  xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
  }
 catch (e)
  {
  xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
 }
return xmlHttp;
}


//------------------------- Display Functions -----------------------------


// fill innerHTML of an element
Qibla.write = function(elementID, html) {
	if ($(elementID))
		$(elementID).innerHTML = html;
}

// write information
Qibla.writeData = function() {
	this.write('QHomeLat', this.home.lat().toFixed(4));
	this.write('QHomeLng', this.home.lng().toFixed(4));

	var qiblaDir = this.getQiblaDirection(this.home);
	var direction = this.formatDirection(qiblaDir);
	
	//var directionmag = this.formatDirection(qiblaDirmag);
	this.write('QDirection', direction.degrees);
	this.write('QDirLabel', direction.label);

	var distance = this.home.distanceFrom(this.kaba); 
	this.write('QDistance', this.formatDistance(distance));

	if (this.extension) 
		this.extWrite();
}

// format direction 
Qibla.formatDirection = function(dir) {
	var sectAngle = [360, 180, 90, 45][this.directionMode];
	var dirNames = [this.consts.north, this.consts.east, this.consts.south, this.consts.west];
	var sectDirs = [ [0], [0], [0, 2], [0, 1, 2, 3] ];

	for (var i = 0; dir > sectAngle; i++)
		dir -= sectAngle;
	dir = (i%2 == 0) ? dir : sectAngle- dir;
	var rotation = (i%2 == 0) ? this.consts.cw : this.consts.ccw;
	var j = parseInt((i+1)/2)% sectDirs[this.directionMode].length;
	var k = sectDirs[this.directionMode][j];
	var dirBase = dirNames[k];

	var label = [dirBase];
	if (this.directionFormat == 1)
		label = [rotation, this.consts.from, dirBase];
	else if (this.directionFormat == 2) { 
		var t = (k + (i%2 == 0 ? 1 : 3))% 4;
		var dirTarget = dirNames[t];
		label = [this.consts.from, dirBase, this.consts.to, dirTarget];
	}
	return {degrees: dir.toFixed(2)+ '&deg;', label: '&nbsp;'+ label.join('&nbsp;')};
}

// format distance 
Qibla.formatDistance = function(dist) {
	var tags = ['km', 'mi'];
	var label = tags[this.distanceUnit]
	if (this.toggleUnits)
		label = '<a href="javascript:Qibla.toggleDistanceUnit(); Qibla.redraw();" '+
				'title="Toggle Distance Unit">'+ label+ '</a>';

	dist = this.distanceUnit ? dist/1609.344 : dist/1000;
	var precision = Math.max(0, 2- parseInt(Math.log(dist)/ Math.log(10)));
	return dist.toFixed(precision)+ '&nbsp;'+ label;
}


//-------------------------- Geocoding Functions -----------------------


// locate address
Qibla.locateAddress = function(address, hideInfo) {
	address = address || this.addressObj.value;
	if (address == '' || address == this.addressBarMsg) {
		alert(this.addressBarMsg);
		return;
	}
	this.geocoder.getLocations(address, function(resp){ Qibla.showAddressOnMap(resp, hideInfo) });
}

// show address on map
Qibla.showAddressOnMap = function(response, hideInfo) {
	if (!response || response.Status.code != 200) {
		if (!this.map.isLoaded())
			this.map.setCenter(this.home, 1*this.mapZoom);
		else
			alert('Address not found');
	}
	else {
		var place = response.Placemark[0];
		this.home = new GLatLng(place.Point.coordinates[1], place.Point.coordinates[0]);
		var zoom = 4+ parseInt(1.5* place.AddressDetails.Accuracy);
		zoom = Math.min(zoom, this.map.getCurrentMapType().getMaximumResolution());
		this.map.setCenter(this.home, zoom);
		this.redraw();
		if (!hideInfo && this.getMapType() != 'e' && place.address != '' && this.map.getSize().height > 340)
			this.map.openInfoWindowHtml(this.home, '<h4>Address:</h4><p>'+ place.address+ '</p>');
	}
}


//-------------------------- Cartesian Point -----------------------

// From: Long Distance Measure Google Maplet
// By: Martin Brock

function CartesianPoint(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
}

CartesianPoint.prototype.sum = function(point) {
	return new CartesianPoint(this.x + point.x, this.y + point.y, this.z + point.z);
}

CartesianPoint.prototype.difference = function(point) {
	return new CartesianPoint(this.x - point.x, this.y - point.y, this.z - point.z);
}

CartesianPoint.prototype.scalarProduct = function(point) {
	return this.x*point.x + this.y*point.y + this.z*point.z;
}

CartesianPoint.prototype.product = function(scalar) {
	return new CartesianPoint(this.x*scalar, this.y*scalar, this.z*scalar);
}

CartesianPoint.prototype.euclideanNorm = function() {
	return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
}

// http://en.wikipedia.org/wiki/Spherical_coordinates
CartesianPoint.prototype.spherical = function() {
	var phi = Math.acos(this.z);
	var sinPhi = Math.sin(phi);
	var theta = Math.atan2(this.y/sinPhi, this.x/sinPhi);
	var degreesPerRadian = 180/Math.PI;
	return new GLatLng(degreesPerRadian*(Math.PI/2 - phi), degreesPerRadian*theta);
}

function cartesian(point) {
	var phi = Math.PI/2 - point.latRadians();
	var theta = point.lngRadians();
	return new CartesianPoint(Math.sin(phi)*Math.cos(theta), Math.sin(phi)*Math.sin(theta), Math.cos(phi));
}

// make great circle segments
Qibla.greatCircle = function(point1, point2) {
	var d = point1.distanceFrom(point2);
	if (d > 2* this.segmentSize) {
		var P = cartesian(point1);
		var Q = cartesian(point2);
		var PdotQ = P.scalarProduct(Q);
		var w = Q.difference(P.product(PdotQ));
		var Qp = w.product(1.0/w.euclideanNorm());
		var bigAlpha = Math.acos(PdotQ);
		var nSegments = Math.round(d/ this.segmentSize);
		var dAlphaMax = bigAlpha/ nSegments;
		var dAlpha = dAlphaMax/64;
		var points = [];
		for (alpha = 0; alpha < bigAlpha; alpha += dAlpha) {
			points.push(P.product(Math.cos(alpha)).sum(Qp.product(Math.sin(alpha))).spherical());
			dAlpha = Math.min(dAlphaMax, dAlpha* 2);
		}
		points.push(point2);
	}
	else
		var points = [point1, point2];
	return points;
}

//-------------------------- Address-Bar Functions -----------------------


// called when address bar is focused
Qibla.focusAddressBar = function() {
	this.addressObj.style.color = '#000000';
	this.selectText(this.addressObj);
	if (this.addressObj.value == this.addressBarMsg)
		this.addressObj.value = '';
}

// called when address bar lose focus
Qibla.blurAddressBar = function() {
	if (this.addressObj.value == '' || this.addressObj.value == this.addressBarMsg)	{
		this.addressObj.style.color = '#999999';
		this.addressObj.value = this.addressBarMsg;
	}
	this.deselectText(this.addressObj);
}

// select all text in obj
Qibla.selectText = function(obj) {
	obj.select();
}

// deselect text in obj
Qibla.deselectText = function(obj) {
	if (document.selection)
		document.selection.empty();
	else
		window.getSelection().removeAllRanges();
}


//----------------------------- Cookies ---------------------------

// From: www.quirksmode.org

var Cookies = {};

// set a cookie value
Cookies.set = function(name, value, days, path) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+ (days* 86400000));
		var expires = "; expires="+ date.toGMTString();
	}
	else var expires = '';
	document.cookie = name+ '='+ value+ expires+ '; path='+ (path || '/');
}

// get a cookie value
Cookies.get = function(name) {
	var nameEQ = name+ '=';
	var ca = document.cookie.split(';');
	for(var i=0 ; i < ca.length ; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

// remove a cookie
Cookies.remove = function(name) {
	createCookie(name, '', -1);
}


//-------------------------- Misc Functions -----------------------

// Prototype $ method
function $(element) {
	return document.getElementById(element);
}

Qibla.init();

