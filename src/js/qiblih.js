/* globals L */

// import * as Geomag from 'geomag';
import * as Geomag from '../../node_modules/geomag/dist/geomag.mjs';
import scrollingNav from './scrolling-nav.js';

scrollingNav();

const map = L.map('map').setView([50, -40], 3);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
  noWrap: true,
  subdomains: 'abcd',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);

const searchControl = L.esri.Geocoding.geosearch({
  useMapBounds:false,
  allowMultipleResults: false,
  placeholder: 'Search for your address',
  expanded: false,
  position: 'topleft'
}).addTo(map);

searchControl.on('results', function(data){
  for (let i = data.results.length - 1; i >= 0; i--) {
    const home = data.results[i].latlng;
    drawLine(home);
    map.setView(home, 19);
  }
});

// Put the result in a layer so that we can clear it
const result = L.layerGroup().addTo(map);

function drawLine(d) {
  result.clearLayers();
  const bahji = new L.LatLng(32.943529, 35.091834);
  const home = d;
  const A = L.marker(bahji, {draggable: false}).addTo(result);
  const B = L.marker(home, {draggable: true}).addTo(result)
    .bindPopup('You can reposition this marker. <br> The line points to <b>Bahjí</b>.').openPopup();

  const geodesic = L.geodesic([A.getLatLng(), B.getLatLng()], {
    weight: 7,
    opacity: 0.5,
    color: 'blue',
    steps: 50
  }).addTo(result);

  const vector = geodesic.geom.geodesic.inverse(B.getLatLng(), A.getLatLng());
  const {declination} = Geomag.field(B.getLatLng().lat, B.getLatLng().lng);
  info.update(geodesic.statistics, magBearing(vector.initialBearing.toFixed(0), declination));

  // update the geodesic line when the B marker is dragged
  // also update the bearing and Geomag calculation
  B.on('drag', (e) => {
    geodesic.setLatLngs([A.getLatLng(), e.latlng])
    const vector = geodesic.geom.geodesic.inverse(e.latlng, A.getLatLng());
    const {declination} = Geomag.field(e.latlng.lat, e.latlng.lng);
    info.update(geodesic.statistics, magBearing(vector.initialBearing.toFixed(0), declination));
  });
}

// Check if bearing is less than 0 or greater than 360
function magBearing(Bearing, declination) {
  let magBearing = Number(Bearing) + declination;
  if (magBearing < 0) {
    magBearing = 360 + magBearing;
  } else if (magBearing > 360) {
    magBearing = magBearing - 360;
  }
  return magBearing;
}

function onLocationFound(e) {
  const home = e.latlng;
  drawLine(home);

}

function onLocationError(/* e */) {
  const home = new L.LatLng(42.074481, -87.684267);
  drawLine(home);
  map.setView(home, 16);
}

// Auto detect user location if supported
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);
map.locate({setView: true, maxZoom: 16});

const info = L.control();

info.onAdd = function (/* map */) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function (stats, bearing) {
  this._div.innerHTML = `<h4>Distance</h4>${
    stats
      ? (stats.totalDistance > 10000)
        ? `${(stats.totalDistance / 1000).toFixed(0)} km`
        : `${(stats.totalDistance).toFixed(0)} m`
      : 'invalid'
  }<br/> <br/> <h4>Magnetic Bearing</h4>${bearing ? `${bearing}°` : 'invalid'}`;
};
info.addTo(map);
