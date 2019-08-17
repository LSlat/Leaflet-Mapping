var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-08-01&endtime=" +
  "2019-08-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

  // Streetmap and satellite map layers
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "mapbox.streets",
accessToken: API_KEY
});

var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY 
  });

// Create the map
var myMap = L.map("map", {
center: [37.09, -95.71],
zoom: 4
});

streetmap.addTo(myMap)

// Colors and sizes for the markers
d3.json(queryUrl, function(data){
    function getColor(d) {
        return d >= 4 ? '#feebe2' :
               d >= 3 ? '#fbb4b9' :
               d >= 2 ? '#f768a1' :
               d >= 1 ? '#c51b8a' :
                        '#7a0177'; 

            // return d >= 4 ? '#7a0177' :
            //        d >= 3 ? '#c51b8a' :
            //        d >= 2 ? '#f768a1' :
            //        d >= 1 ? '#fbb4b9' :
            //                 '#feebe2'; 
        }
    function getSize(s) {
        return s >= 4 ? '25' :
               s >= 3 ? '20' :
               s >= 2 ? '15' :
               s >= 1 ? '10' :
                        '5'; 
        }
    // Set the marker colors and other style details
    function myStyle(feature) {
        return {
            radius: getSize(feature.properties.mag),
            fillColor: getColor(feature.properties.mag),
            weight: 1,
            opacity: 1,
            color: 'white',           
            fillOpacity: 0.5
        }
    }

// Create circle markers for each earthquake location and add the styling
var earthquakes =  L.geoJson(data,{
    pointToLayer: function(feature, latlng){
        return L.circleMarker(latlng)
        },
    style: myStyle,

    // Pop-ups for each marker
    onEachFeature: function(feature, layer){
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>" + feature.properties.place +
        "<br>" + new Date(feature.properties.time))
        }
    }).addTo(myMap)


// Create a baseMaps object to hold the base layers
var baseMaps = {
    "Street Map": streetmap,
    "Satellite Map": satellite
    }

// Create an overlay object to hold the overlay layer
var overlayMaps = {
    Earthquakes: earthquakes
    }
  
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(myMap);

// Add the fault lines to the map
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json",
    function(data){L.geoJSON(data).addTo(myMap)});
    
});

// // Legend for the map
// var legend = L.control({position: 'bottomright'});

// legend.onAdd = function (map) {

// 	var div = L.DomUtil.create('div', 'legend'),
// 		mags = ['0-1', '1-2', '2-3', '4-5', '5+'],
// 		labels = [];

// 	// loop through our density intervals and generate a label with a colored square for each interval
// 	for (var i = 0; i < mags.length; i++) {
// 		div.innerHTML +=
// 			'<i style="background:' + getColor(mags[i] + 1) + '"></i> ' +
// 			mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
// 	}

// 	return div;
// };

// legend.addTo(map);


    