var map = L.map('mapid', {
    center: [49.265637, -123.256113],
    zoom: 15
});
var topoTiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


var roadGeoJson;
var roadsToHighlight = "";

function default_style (feature) {
    return {
        color : 'blue',
        weight: 2,
        opacity: 1,
    }
}

function highlight_style(feature){
    return {
        color : "red",
        weight : 3,
        opacity : 1,
    }
}

function buttonswitch() {
    var button = document.getElementById('showRoad');
    if (button.textContent == 'Show Base Roads') {
        button.textContent = 'Hide Base Roads';
    } else {
        button.textContent = 'Show Base Roads';
    }
}

function roadsToFilter(feature){
    if (roadsToHighlight == ""){
        return true;
    } else if (feature.properties &&feature.properties.RD_CLASS ){
        return feature.properties.RD_CLASS.toLowerCase().includes(roadsToHighlight.toLowerCase());
    } else {
        return false;
    }
    
}


var hightlightLayer = {};
var baseRoads = {}

function layerchange(){
    var buttonText = document.getElementById('showRoad').textContent;
    if (buttonText == 'Hide Base Roads'){
        addbaseRoads();
    }else if (buttonText == 'Show Base Roads'){
        hideRoads()
    }
}

function hideRoads() {
    map.removeLayer(baseRoads)
}
function addbaseRoads() {

    if (map.hasLayer(hightlightLayer)){
        map.removeLayer(hightlightLayer)
    }
    baseRoads = L.geoJSON(roadGeoJson, 
        {style : default_style,

    });
    baseRoads.addTo(map)
  };


  function highlightRoads() {

    if (map.hasLayer(hightlightLayer)){
        map.removeLayer(hightlightLayer)
    }

    roadsToHighlight = document
      .getElementById("road_types")
      .value;

    hightlightLayer = L.geoJSON(roadGeoJson,
        {style:highlight_style,
        filter : roadsToFilter,
    });
    hightlightLayer.addTo(map)

    roadsToHighlight = "";
  }

$.getJSON("https://raw.githubusercontent.com/UBCGeodata/ubc-geospatial-opendata/master/ubcv/transportation/geojson/ubcv_roads_simple.geojson",
    function (data){
        roadGeoJson = data;
        document.getElementById("showRoad")
        .addEventListener('click', layerchange);

        document.getElementById("roadHighlightButton")
        .addEventListener('click',highlightRoads)
    });