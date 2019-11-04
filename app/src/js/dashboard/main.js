console.log('dashboard/main.js Initialised');

import '../Dropdown';
import '../ThemeToggle';
import mapboxgl from 'mapbox-gl';
import { packSoundtrack } from '../engines/AudioEngine';
import { LocationsApi } from '../Api';
import { formatSession } from '../Helpers';

/*
**** Edit the left icon boxes on past sessions (date formatting, background boxes of accuracy..)
*/
formatSession.leftIconBoxes();

/*
**** Audio
*/

// packSoundtrack('start', '/assets/sounds/DashboardMusic.mp3');
// var isMuted = false;

// document.getElementById('mute-btn').addEventListener('click', function (e) {
//     e.preventDefault();
//     toggleMute();
// });

// function toggleMute() {
//     if (isMuted) {
//         isMuted = false;
//         packSoundtrack('unmute');
//         document.getElementById('mute-btn').innerHTML = '<span class="icon icon-volume"></span> Mute';
//     } else if (!isMuted) {
//         isMuted = true;
//         packSoundtrack('mute');
//         document.getElementById('mute-btn').innerHTML = '<span class="icon icon-volume"></span> Unmute';
//     }
// }

/*
 **** Map
 */
mapboxgl.accessToken = 'pk.eyJ1Ijoic2FtbGlsbGkiLCJhIjoiY2swZTl0Z3RrMGZkYzNnbzIxMjMxbmxneCJ9.c8Fb6woJqiVYTbMgo2w1UA';
var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/samlilli/ck0eha77p0u841cnoa0cksnbv',
	center: [50.82, 0.13],
	zoom: 2.5,
	pitch: 200,
	attributionControl: false
}).addControl(new mapboxgl.AttributionControl({
	compact: true
}));

// Add geolocate control to the map.
const geolocate = new mapboxgl.GeolocateControl({
	positionOptions: {
		enableHighAccuracy: true
	},
	trackUserLocation: false
});

map.addControl(geolocate);
map.scrollZoom.disable();

geolocate.on('geolocate', function (e) {
	//Get the updated user location, this returns a javascript object.
	var userlocation = e;

	//Your work here - Get coordinates like so
	var lat = userlocation.coords.latitude;
	var lng = userlocation.coords.longitude;

	LocationsApi.newLocation(lng, lat);

	map.flyTo({
		center: [lng, lat],
		zoom: 3,
		pitch: 400
	});
	setTimeout(function () {
		rotateCamera(0);
	}, 4000)
	rotateCamera(0);
});

function rotateCamera(timestamp) {
	// clamp the rotation between 0 -360 degrees
	// Divide timestamp by 100 to slow rotation to ~10 degrees / sec
	map.rotateTo((timestamp / 1000) % 360, {
		duration: 0
	});
	// Request the next frame of the animation.
	requestAnimationFrame(rotateCamera);
}

map.on('load', function () {
	geolocate.trigger();

	//Add a source for cluster
	map.addSource("earthquakes", {
		type: "geojson",
		// Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
		// from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
		data: "/location.geojson",
		cluster: true,
		clusterMaxZoom: 14, // Max zoom to cluster points on
		clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
	});

	map.addLayer({
		id: "clusters",
		type: "circle",
		source: "earthquakes",
		filter: ["has", "point_count"],
		paint: {
			// Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
			// with three steps to implement three types of circles:
			//   * Blue, 20px circles when point count is less than 100
			//   * Yellow, 30px circles when point count is between 100 and 750
			//   * Pink, 40px circles when point count is greater than or equal to 750
			"circle-color": [
				"step",
				["get", "point_count"],
				"#0fafff",
				100,
				"#0fafff",
				750,
				"#0fafff"
			],
			"circle-radius": [
				"step",
				["get", "point_count"],
				20,
				100,
				30,
				750,
				40
			]
		}
	});

	map.addLayer({
		id: "cluster-count",
		type: "symbol",
		source: "earthquakes",
		filter: ["has", "point_count"],
		layout: {
			"text-field": "{point_count_abbreviated}",
			"text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
			"text-size": 12
		}
	});

	map.addLayer({
		id: "unclustered-point",
		type: "circle",
		source: "earthquakes",
		filter: ["!", ["has", "point_count"]],
		paint: {
			"circle-color": "#0fafff",
			"circle-radius": 4,
			"circle-stroke-width": 1,
			"circle-stroke-color": "#fff"
		}
	});

	// inspect a cluster on click
	map.on('click', 'clusters', function (e) {
		var features = map.queryRenderedFeatures(e.point, {
			layers: ['clusters']
		});
		var clusterId = features[0].properties.cluster_id;
		map.getSource('earthquakes').getClusterExpansionZoom(clusterId, function (err, zoom) {
			if (err)
				return;

			map.easeTo({
				center: features[0].geometry.coordinates,
				zoom: zoom
			});
		});
	});

	map.on('mouseenter', 'clusters', function () {
		map.getCanvas().style.cursor = 'pointer';
	});
	map.on('mouseleave', 'clusters', function () {
		map.getCanvas().style.cursor = '';
	});
});

// Code to ask to install the web app 'natively'

let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
});

let installBtn = document.getElementById('installBtn');
installBtn.addEventListener('click', (e) => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    console.log(deferredPrompt)
    deferredPrompt.userChoice.then(function(choiceResult){

      if (choiceResult.outcome === 'accepted') {
      console.log('Your PWA has been installed');
    } else {
      console.log('User chose to not install your PWA');
    }

    deferredPrompt = null;

    });
  }
});
