const map = L.map("map").setView([49.246292, -123.12262], 12);

const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);


$.getJSON("electric-vehicle-charging-stations.geojson", function (data) {
  L.geoJSON(data,{
    onEachFeature: function (feature, layer){
        if (feature.properties && feature.properties.address){
            layer.on('mouseover', function(e){
                this.bindPopup(feature.properties.address).openPopup();
                map.getCanvas().style.cursor = 'pointer';

            });
            layer.on('mouseout',function(e){
                this.closePopup();
                map.getCanvas().style.cursor = 'pointer';
            });
        }
    }
  }).addTo(map)
});
