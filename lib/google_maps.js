var infoWindow = null;

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
        var gLatLng = new google.maps.LatLng(marker.lat, marker.lng);
        var gMarker = new google.maps.Marker({
            position: gLatLng,
            map: this.map,
            // animation: google.maps.Animation.DROP,
            icon: marker.icon
        });
      
        switch(marker.data.type) {
          case 0:
            wContent = '<div id="content"> I was here on: ' + marker.createdAt + '</div>'
            break;
          case 1:
            wContent = '<div id="content"> I saw this on: ' + marker.createdAt + '</div>'
            break;
          default:
            throw('[EROR] Not a valid data type');
        }

        google.maps.event.addListener(gMarker, 'click', function() {
          infoWindow.setContent(wContent);
          infoWindow.open(this.map, gMarker);
        });

        this.latLngs.push(gLatLng);
        this.markers.push(gMarker);
        this.markerData.push(marker);
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

        // global flag saying we intialized already
        Session.set('map', true);
    }
}
