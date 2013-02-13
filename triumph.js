"use strict";

/*** GLOBALS ***/
// Use tiles from MapQuest; see: http://developer.mapquest.com/web/products/open/map
var TILE_SETTINGS = {
    attribution: 'Map data © <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors — Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>',
    subdomains: ['otile1', 'otile2', 'otile3', 'otile4']
},
    TILE_LAYER_MAP = new L.TileLayer("http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg", TILE_SETTINGS),
    TILE_LAYER_SAT = new L.TileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", TILE_SETTINGS),
    LAYERS = [TILE_LAYER_MAP, TILE_LAYER_SAT]
;

// Start centered on central Rome
var START_BOUNDS = [
    [41.886751707869635, 12.471263408660887],
    [41.89435512030309, 12.495853900909424]
];

// Resize sidebar and map container on load and on window resize
function resize() {
    var viewHeight = $(window).height() - 40;

    var map = $('#map');
    map.width(map.parent().width())
       .height(viewHeight);

    $('#sidebar').height(viewHeight);
}
resize();
$(window).resize(resize);

// Initialize map
var _map;
_map = L.map('map');
_map.addLayer(TILE_LAYER_MAP);
_map.fitBounds(START_BOUNDS);
//L.control.layers(LAYERS).addTo(_map);
// Satellite layer disabled: MapQuest has no data for Rome at this resolution

// Process features when adding them to the map
var _points = $('#points');
function processFeature(feature, layer) {
    var type = feature.geometry.type;
    if(type === 'Point') {
        // Create a popup
        var name = feature.properties.Name;
        var popup = layer.bindPopup(name);

        // Add to sidebar and activate popup on click
        var point = $('<li>' + name + '</li>');
        point.click(function() {
            popup.openPopup();
        });
        _points.append(point);
    } else if(type === 'LineString') {
        // Create a popup
        layer.bindPopup(feature.properties.Name);
    }
}

// Process and display geoJSON data on the map
L.geoJson(DATA, {
    onEachFeature: processFeature
}).addTo(_map);

