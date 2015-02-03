var infoWindow = null;
var oms = null;
var poly = null;

gmaps = {
    // map object
    map: null,
 
    // google markers objects
    markers: [],
 
    // google lat lng objects
    latLngs: [],
 
    // formatted marker data objects
		// marker {
		//	createdAt: Date
		//	lat: float
		//	lng: float
    //  icon: string
		//	data {
		// 		type: int (0: no_data, 1: photo)
		//		path: string
		//	}
		// }
    markerData: [],

    // add a marker given our formatted marker data object
    addMarker: function(marker) {
        var wContent = '';
        var icon = {url: marker.icon};
        var gLatLng = new google.maps.LatLng(marker.lat, marker.lng);
        var gMarker = new google.maps.Marker({
            position: gLatLng,
            map: this.map,
            icon: icon
        });
      
        switch(marker.data.type) {
          case 0:
            wContent = '<div id="content" style="white-space: nowrap;">Was here on: ' + marker.createdAt.toLocaleString() + '</div>'
            break;
          case 1:
            wContent = '<div id="content"><p>Saw this on: ' + marker.createdAt.toLocaleString() + '</p><img src="http://lia.dc.ufscar.br/image_upload/uploads/' + marker.data.path + '"width="320" height="240"/></div>'
            break;
          case 2:
            wContent = '<div id="content" style="white-space: nowrap;">Was here on: ' + marker.createdAt.toLocaleString() + '</br>' + messagesToString(marker.data.messages) +'</div>'
            break;
          case 3:
            wContent = '<div id="content"><p>Saw this on: ' + marker.createdAt.toLocaleString() + '</p><img src="http://lia.dc.ufscar.br/image_upload/uploads/' + marker.data.path + '"width="320" height="240"/></br>' + messagesToString(marker.data.messages) + '</div>'
            break;
          default:
            throw('[ERROR] Not a valid data type');
        }

        gMarker.content = wContent;

        oms.addMarker(gMarker);

        var path = poly.getPath();
        path.push(gLatLng);

        google.maps.event.addListener(gMarker, 'click', function() {
          infoWindow.setContent(gMarker.content);
          infoWindow.open(this.map, gMarker);
        });

        this.latLngs.push(gLatLng);
        this.markers.push(gMarker);
        this.markerData.push(marker);
        this.calcBounds();
        this.map.setCenter(gLatLng);
        return gMarker;
    },
 
    // calculate and move the bound box based on our markers
    calcBounds: function() {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, latLngLength = this.latLngs.length; i < latLngLength; i++) {
            bounds.extend(this.latLngs[i]);
        }
        this.map.fitBounds(bounds);
    },
 
    // check if a marker already exists
    markerExists: function(key, val) {
        _.each(this.markers, function(storedMarker) {
            if (storedMarker[key] == val)
                return true;
        });
        return false;
    },
 
    // intialize the map
    initialize: function() {
        console.log("[+] Intializing Google Maps...");
        
        var mapOptions = {
            zoom: 15,
            center: new google.maps.LatLng(49.260605, -123.245994),
            mapTypeId: google.maps.MapTypeId.HYBRID,
						disableDefaultUI: true
        };
 
        this.map = new google.maps.Map(
            document.getElementById('map-canvas'),
            mapOptions
        );
 
        infoWindow = new google.maps.InfoWindow();
        oms = new OverlappingMarkerSpiderfier(this.map, {markersWontMove: true, markersWontHide: true, keepSpiderfied: true});

        var polyOptions = {
          strokeColor: '#000000',
          strokeOpacity: 1.0,
          strokeWeight: 3
        };
        poly = new google.maps.Polyline(polyOptions);
        poly.setMap(this.map);

        // global flag saying we intialized already
        Session.set('map', true);
    }
}

// Helper function
var messagesToString = function(messages) {
  console.log('[dbug] messagesToString: ', messages);
  var mString = 'Received: ';
  for(i in messages) {
    mString += '</br>' + messages[i];
  }
  return mString;
};
