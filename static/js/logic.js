// Create a map object centered on the United States.
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });
  
  // Add a tile layer.
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Function to determine marker size based on earthquake magnitude
  function markerSize(magnitude) {
    return magnitude * 3;  // Adjust size factor if needed
  }
  
  // Function to choose marker color based on earthquake depth
  function markerColor(depth) {
    if (depth > 90) return "#ea2c2c"; // Dark Red for deep earthquakes
    else if (depth > 70) return "#ea822c"; // Dark Orange
    else if (depth > 50) return "#ee9c00"; // Orange
    else if (depth > 30) return "#eecc00"; // Yellow
    else if (depth > 10) return "#d4ee00"; // Light Green
    else return "#98ee00"; // Bright Green for shallow earthquakes
  }
  
  // Fetch earthquake data from USGS GeoJSON endpoint
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
    // Loop through the earthquake data to create markers
    data.features.forEach(function(earthquake) {
      // Extract coordinates, magnitude, and depth from each earthquake feature
      let coords = earthquake.geometry.coordinates;
      let magnitude = earthquake.properties.mag;
      let depth = coords[2];
  
      // Create a circle marker for each earthquake
      let earthquakeMarker = L.circleMarker([coords[1], coords[0]], {
        radius: markerSize(magnitude),
        color: "#000",
        weight: 0.5,
        fillColor: markerColor(depth),
        fillOpacity: 0.75
      });
  
      // Add popup to each marker with earthquake information
      earthquakeMarker.bindPopup(`<h3>${earthquake.properties.place}</h3>
                                  <hr>
                                  <p>Date & Time: ${new Date(earthquake.properties.time)}</p>
                                  <p>Magnitude: ${magnitude}</p>
                                  <p>Depth: ${depth} km</p>`);
  
      // Add each earthquake marker to the map
      earthquakeMarker.addTo(myMap);
    });
  
    // Create a legend to show depth color coding
    // Create the legend control
    let legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend"),
        depths = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // Title for legend
    div.innerHTML += "<h4>Depth (km)</h4>";

    // Loop through depth intervals and create a color box for each interval
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
        `<i style="background:${markerColor(depths[i] + 1)}; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i> ` +
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
    };

    // Add the legend to the map
    legend.addTo(myMap);

  });
  