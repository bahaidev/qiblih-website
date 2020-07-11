const Magvar = require('magvar');
var map = L.map('map').setView([50, -40], 3);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    noWrap: true,
    subdomains: 'abcd',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);

var searchControl = L.esri.Geocoding.geosearch({
    useMapBounds:false,
    allowMultipleResults: false,
    placeholder: 'Search for your address',
    expanded: false,
    position: 'topleft'
}).addTo(map);

searchControl.on('results', function(data){
for (var i = data.results.length - 1; i >= 0; i--) {
    var home = data.results[i].latlng;
    drawLine(home);
    map.setView(home, 19);
}
});

// Put the result in a layer so that we can clear it
var result = L.layerGroup().addTo(map);

function drawLine(d) {
    result.clearLayers();
    var bahji = new L.LatLng(32.943529, 35.091834);
    var home = d;
    var A = L.marker(bahji, {draggable: false}).addTo(result);
    var B = L.marker(home, {draggable: true}).addTo(result)
        .bindPopup("You can reposition this marker. <br> The line points to <b>Bahjí</b>.").openPopup();

    const geodesic = L.geodesic([A.getLatLng(), B.getLatLng()], {
        weight: 7,
        opacity: 0.5,
        color: 'blue',
        steps: 50
    }).addTo(result);

    let vector = geodesic.geom.geodesic.inverse(B.getLatLng(), A.getLatLng());
    const magVar = Magvar.get(B.getLatLng().lat, B.getLatLng().lng);
    info.update(geodesic.statistics, magBearing(vector.initialBearing.toFixed(0), magVar));

    // update the geodesic line when the B marker is dragged
    // also update the bearing and magvar calculation
    B.on('drag', (e) => {
        geodesic.setLatLngs([A.getLatLng(), e.latlng])
        let vector = geodesic.geom.geodesic.inverse(e.latlng, A.getLatLng());
        const magVar = Magvar.get(e.latlng.lat, e.latlng.lng);
        info.update(geodesic.statistics, magBearing(vector.initialBearing.toFixed(0), magVar));
    });
}

// Check if bearing is less than 0 or greater than 360
function magBearing(Bearing, Magvar) {
  var magBearing = Number(Bearing) + Number(Magvar);
  if (magBearing < 0) {
    var magBearing = 360 + magBearing;
  } else if (magBearing > 360) {
    var magBearing = magBearing - 360;
  }
  return magBearing;
}

function onLocationFound(e) {
    var home = e.latlng;
    drawLine(home);

}

function onLocationError(e) {
    var home = new L.LatLng(42.074481, -87.684267);
    drawLine(home);
    map.setView(home, 16);
}

// Auto detect user location if supported
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);
map.locate({setView: true, maxZoom: 16});

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (stats, bearing) {
    this._div.innerHTML = '<h4>Distance</h4>' + 
    (stats ? (stats.totalDistance>10000)?(stats.totalDistance/1000).toFixed(0)+' km':(stats.totalDistance).toFixed(0)+' m' : 'invalid') + 
    '<br/> <br/> <h4>Magnetic Bearing</h4>' + (bearing ? bearing + '°': 'invalid');
};
info.addTo(map);
