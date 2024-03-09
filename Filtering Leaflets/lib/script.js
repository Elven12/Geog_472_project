var map = L.map('mapid', {
    center: [49.260637, -123.251113],
    zoom: 13.5
});

var topoTiles =  L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
}).addTo(map);

function majorRoad_style(feature) {
    return {
        color: 'red',
        weight: 3
    };
}

function localRoad_style(feature) {
    return {
        color: 'blue',
        weight: 2
    };
}

function lane_style(feature) {
    return {
        color: 'green',
        weight: 1.5
    };
}

var majorRoad ={};
var localRoad= {};
var lane = {};

function filter_sender(feature,str){
    if (feature.properties && feature.properties.RD_CLASS){
        return (feature.properties.RD_CLASS.toLowerCase() === str.toLowerCase());
    } else{
        return false;
    }

}

function buttonswitch(id) {
    var btn = document.getElementById(id);
    var sw = btn.textContent.includes('Show');
    if (id === "Major"){
        btn.textContent = sw? 'Hide Major Roads' : 'Show Major Roads';
    }else if (id === "Local"){
        btn.textContent = sw? 'Hide Local Roads' : 'Show Local Roads';
    }else if (id === "Lane"){
        btn.textContent = sw? 'Hide Lane' : 'Show Lane';

    }
}

function showMajorLayer(data){
    if (map.hasLayer(majorRoad)){
        map.removeLayer(majorRoad);
    }
    majorRoad = L.geoJSON(data, {
        style: majorRoad_style,
        filter: function (feature) {
            return filter_sender(feature, "Major");

        }
    }).addTo(map);
}

function showLocalLayer(data){
    if (map.hasLayer(localRoad)){
        map.removeLayer(localRoad);
    }
    localRoad = L.geoJSON(data, {
        style: localRoad_style,
        filter: function (feature) {
            return filter_sender(feature, "Local");

        }
    }).addTo(map);
}

function showLaneLayer(data){
    if (map.hasLayer(lane)){
        map.removeLayer(lane);
    }
    lane = L.geoJSON(data, {
        style: lane_style,
        filter: function (feature) {
            return filter_sender(feature, "lane");

        }
    }).addTo(map);
}

function showlayers(data) {
    showMajorLayer(data);
    showLocalLayer(data)
    showLaneLayer(data)
}

function markerChange(id, data) {
    var tc = document.getElementById(id).textContent;

    if (id === "Major") {
        if (tc.includes('Show')) {
            map.removeLayer(majorRoad);
        } else if (tc.includes('Hide')) {
            showMajorLayer(data);
        }
    } else if (id === "Local") {
        if (tc.includes('Show')) {
            map.removeLayer(localRoad);
        } else if (tc.includes('Hide')) {
            showLocalLayer(data);
        }
    } else if (id === "Lane") {
        if (tc.includes('Show')) {
            map.removeLayer(lane);
        } else if (tc.includes('Hide')) {
            showLaneLayer(data);
        }
    }
}

$.getJSON("https://raw.githubusercontent.com/UBCGeodata/ubc-geospatial-opendata/master/ubcv/transportation/geojson/ubcv_roads_simple.geojson",
    function (data) {
        showlayers(data);

        document.getElementById("Major").addEventListener('click', function () {
            markerChange("Major", data);
        });
        document.getElementById("Local").addEventListener('click', function () {
            markerChange("Local", data);
        });
        document.getElementById("Lane").addEventListener('click', function () {
            markerChange("Lane", data);
        });
    });
