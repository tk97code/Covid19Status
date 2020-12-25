const mapDiv = document.getElementById('map');

mapboxgl.accessToken = 'pk.eyJ1Ijoia3Jpc2t0YW41NDM2IiwiYSI6ImNrZTJ3a3locDBkbHMyc21hd2theDV3bTgifQ.RuFY4aHJauzWd_Ea516HhA';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
        center: [105, 21], // starting position [lng, lat]
        zoom: 4, // starting zoom
        attributionControl: false
    });

    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();

    map.addControl(
        new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
        })
    );  

    map.addControl(
        new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        })
    );

function updateMap() {
    map.on('load', () => {
        map.resize();  
    });
    console.log("Updating map with realtime data")
    fetch("https://corona.lmao.ninja/v2/countries")
        .then(response => response.json())
        .then(data => {
            //console.log(data)
            data.forEach(element => {
                latitude = element.countryInfo.lat;
                longitude = element.countryInfo.long;

                cases = element.cases;
                active = element.active;
                deaths = element.deaths;
                recovered = element.recovered;
                country = element.country;

                if (cases>255){
                    color = "rgb(255, 0, 0)";
                }

                else{
                    color = `rgb(${cases}, 0, 0)`;
                }


                var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                    //'<b> Country: ' + country + '</b>' +
                    //'<p> Cases: ' + cases + '</p>' + 
                    //'<p> Active: ' + active + '</p>' +
                    //'<p> Deaths: ' + deaths + '</p>' +
                    //'<p> Recovered: ' + recovered + '</p>'
                    
                    `
                    <b>Country: ${country}</b> <br> <br>
                    <span>Cases: ${cases.toLocaleString()}</span> <br>
                    <span>Active: ${active.toLocaleString()}</span> <br>
                    <span>Deaths: ${deaths.toLocaleString()}</span> <br>
                    <span>Recovered: ${recovered.toLocaleString()}</span> <br>
                    `
                );

                // Mark on the map
                new mapboxgl.Marker({
                    draggable: false,
                    color: color,
                    offset: [0, -15]
                }).setPopup(popup).setLngLat([longitude, latitude]).addTo(map);
            });
        })
}

updateMap();

let interval = 35000;
setInterval( updateMap, interval); 