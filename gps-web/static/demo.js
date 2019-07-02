BASECOORDS = [33.0737, -117.1642];


var map = L.map('map',{
    center: [33.0737, -117.1642],
    zoom: 15
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

