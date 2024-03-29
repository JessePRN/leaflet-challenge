//using exercise 15.1.10-Stu_GeoJson as a template
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
    function pointToLayer(feature, latlng) {
        return L.circleMarker(latlng);
    }
    function fillColorQuake(depth) {
        if (depth > 15) {
            return "darkred"
        } else if (depth > 10){
            return "red"
        } else if (depth > 5){
            return "darkgreen"        
        } else if (depth > 2){
            return "green"
        } else return "lightgreen"
    }

    function varyRadiusQuake(mag) {
        if (mag > 4) {
            return 18
        } else if (mag > 3){
            return 14
        } else if (mag > 2){
            return 10    
        } else if (mag > 1){
            return 6
        } else return 4
    }

    function styleQuakeMarker(feature) {
        return {
            radius: varyRadiusQuake(feature.properties.mag),
            fillColor: fillColorQuake(feature.geometry.coordinates[2]),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8

        }
    }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: pointToLayer,
        onEachFeature: onEachFeature,
        style: styleQuakeMarker
    });

    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
}
// reference from docs
// var geojsonMarkerOptions = {
//     radius: 8,
//     fillColor: "#ff7800",
//     color: "#000",
//     weight: 1,
//     opacity: 1,
//     fillOpacity: 0.8
// };

function createMap(earthquakes) {

    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object.
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // Create an overlay object to hold our overlay.
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [street, earthquakes]
    });

    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

}