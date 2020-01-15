var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"

//Pull in earthquake data to function for creating markers
d3.json(earthquakeUrl, function (data) {
    createFeatures(data.features);
});

//Function for pulling the magnitude for the radius from the geoJSON features
function getRadius(d) {
    return d * 2
};

//Function for pulling the magnitude for the radius from the geoJSON features
function getColor(d) {
    return d > 9 ? '#ff0202' :
        d > 8 ? '#ff2929' :
            d > 7 ? '#ff5050' :
                d > 6 ? '#ff7777' :
                    d > 5 ? '#ff9f9f' :
                        d > 4 ? '#ffb2b2' :
                            d > 3 ? '#ffc6c6' :
                                d > 2 ? '#ffd9d9' :
                                    d > 1 ? '#ffeded' :
                                        '#ffffff'
};

//Function for binding feature data from geoJSON to map
function createFeatures(earthquakeData) {

    // Add popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    };

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: getRadius(feature.properties.mag),
                fillColor: getColor(feature.properties.mag),
                color: "#ffffff",
                weight: 1,
                opacity: 1,
                fillOpacity: 1
            });
        }
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

//Create Map
function createMap(earthquakes) {

    //Add basemap
    var globalmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    //Add overlay
    var overlayMap = {
        Earthquakes: earthquakes
    };

    //Add Leaflet map to div
    var myMap = L.map("map", {
        center: [29.261021, -36.814468],
        zoom: 3,
        layers: [globalmap, earthquakes]
    });

    var info = L.control({ position: 'bottomright' });

    info.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            scale = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            // labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < scale.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(scale[i] + 1) + '"></i> ' +
                scale[i] + (scale[i + 1] ? '&ndash;' + scale[i + 1] + '<br>' : '+');
        }
        return div;
    };

    info.addTo(myMap);

}



// // Plots all of the earthquakes from your data set based on their longitude and latitude

// // Adjust data markers to show magnitude of the earthquake in their size (larger) and color(darker)

// //Add popups (on click)

// //Add legend 
