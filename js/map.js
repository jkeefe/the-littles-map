function drawmap(newyork_table, ancestry_lat, ancestry_lon, ancestry_zoom, ancestry_code) {
	
	
	// First, draw the legend (esp since it should appear even before the data does)
	// drawLegend();  
	
	// Draw the correct map selecting from rows in a fusion table
	if (newyork_table) {
		newyork_layer1 = new google.maps.FusionTablesLayer(newyork_table, {
		  query: "SELECT geometry FROM " + newyork_table + " WHERE CODE=" + ancestry_code
		});
		new_center = new google.maps.LatLng(ancestry_lat, ancestry_lon);
		
		// make the zoom value an integer (seems to be passing as a string)
		new_zoom = parseInt(ancestry_zoom);
		
		newyork_layer1.setMap(map);
		map.setZoom(new_zoom);
		map.panTo(new_center);
		
    	mapdrawn = true;
	
	}
	
}

function clearmap() {
    // Blanks all of the map layers
	// Works only if the first map has been drawn
	if (mapdrawn == true) {
		newyork_layer1.setMap();
	}
}

function menuchange() {
	// This parses the select-menu value. Kinda Fortrany.
	var newyork_table = $('#map_menu').val().slice(0,7);
	var ancestry_lat = $('#map_menu').val().slice(8,14);
	var ancestry_lon = $('#map_menu').val().slice(15,22);
	var ancestry_zoom = $('#map_menu').val().slice(23,25);
	var ancestry_code = $('#map_menu').val().slice(26,30);
	clearmap();
	drawmap(newyork_table, ancestry_lat, ancestry_lon, ancestry_zoom, ancestry_code);	
}

function codeAddress() {
  var address = document.getElementById("address").value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
			map.setZoom(14);
    } else {
      alert("Couldn't relocate for the following reason: " + status);
    }
  });
}

function currentMapUrl() {
	var embed_url_response = basemap_location + 
			"?lat=" + map.getCenter().lat().toFixed(4) + 
			"&lon=" + map.getCenter().lng().toFixed(4) + 
			"&zoom=" + map.getZoom() + 
			"&sel=" + $('#map_menu').attr('selectedIndex');
	return embed_url_response;
}

function embedBox() {
	var embed_url_response = currentMapUrl();
	jAlert('<strong>The link to this map is:<br></strong>'+ embed_url_response+'<br><br><strong>To embed on a blog or site, copy this:<br></strong>&lt;iframe src=\"'+embed_url_response+'\" height=\"700\" width=\"520\" scrolling=\"no\" frameborder=\"0\"&gt;&lt;/iframe>', 'Share or Embed');
	
}

function expandWindow() {
    window.open( currentMapUrl() );
    return false;
};

//
// Main Mapmaking Section
//

var map;
var geocoder;
var mapdrawn = false;
var basemap_location = "http://project.wnyc.org/census-maps/littles/littles.html"

// get named params from the URL using jquery.url.min.js
var map_lat = $.url.param("lat");
var map_lon = $.url.param("lon");
var map_zoom = $.url.param("zoom");
var map_select = $.url.param("sel");

// set defaults if no named params in URL
if (map_lat == "") {
	map_lat = 40.774326;
}

if (map_lon == "") {
	map_lon = -73.970839;
}

if (map_zoom == "") {
	map_zoom = 12;
} else {
	map_zoom = parseInt(map_zoom);
}

if (map_select == "") {
	map_select = 0;
}

// set initial starting point for map
var centerpoint = new google.maps.LatLng(map_lat, map_lon);

var MY_MAPTYPE_ID = 'wnyc';
 
function initialize() {
   
  // set up the geocoder for addresses search (when used)
   geocoder = new google.maps.Geocoder();

  // use WNYC's custom Google Maps styling
  var stylez = [
	{
	    featureType: "road",
	    elementType: "all",
	    stylers: [
	      { visibility: "on" },
	      { gamma: 2.78 }
	    ]
	  },{
	    featureType: "poi",
	    elementType: "all",
	    stylers: [
	      { saturation: 0 },
	      { gamma: 0.76 }
	    ]
	  },{
	    featureType: "transit",
	    elementType: "all",
	    stylers: [
	      { visibility: "off" }
	    ]
	  },{
	    featureType: "road.arterial",
	    elementType: "geometry",
	    stylers: [
	      { hue: "#fff700" },
	      { gamma: 2.05 }
	    ]
	}

  ];

  // set base map options
  var mapOptions = {
    zoom: map_zoom,
    center: centerpoint,
    streetViewControl: false,
    mapTypeControl: false,
    zoomControl: true,
    panControl: true,
    mapTypeControlOptions: {
       mapTypeIds: [MY_MAPTYPE_ID]
    },
    mapTypeId: MY_MAPTYPE_ID
  };
 
  map = new google.maps.Map(document.getElementById("map_canvas"),
      mapOptions);

	// Set one option for the styled map: Its name
	var styledMapOptions = {
    name: "WNYC"
	};

	// this creates the new StyledMapType object, using the styles variable and the options
	var myMapType = new google.maps.StyledMapType(stylez, styledMapOptions);

	// set 'WNYC' as a map type, naming it ... then use that one to start with 
	map.mapTypes.set('WNYC', myMapType);
	map.setMapTypeId('WNYC');

	// This runs our map-drawing menu, passing info used to set table, zoom, etc.
	$('#map_menu').attr('selectedIndex', map_select);
	menuchange();

}

// Do the following when the page is ready
$(document).ready(function(){

	 // Watch the address input box and clear it when highlighted
	 $('#address').focus(function(){
	  if(this.value=='Zip code or place')
	  {
	  this.value=''
	  }
	 });
 
	 // if  address input box unhighlighted and empty, put back helper text
	 $('#address').blur(function(){
	  if(this.value=='')
	  {
	  this.value='Zip code or place'
	  }
	 });

	 // run the initialize function
	 initialize();

});


