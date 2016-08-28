function init() {
  var map = new StoryMap();
  //getting user geolocation takes too long to load
  // if ("geolocation" in navigator) {
  //   navigator.geolocation.getCurrentPosition(function(position) {
  //     map = new StoryMap(position.coords.latitude, position.coords.longitude);
  //   }, function(err) { map = new StoryMap(); });
  // }
  // } else {
  //   map = new StoryMap();
  // }
}

class StoryMap {
  constructor(lat = 37.422327, lng = -122.084401) { //facebook: lat = 37.484556, lng = -122.147845
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: lat, lng: lng},
      scrollwheel: false,
      zoom: 12
    });
    var storyPin = new google.maps.MarkerImage("/static/pins_stories.png");
    var resourcePin = new google.maps.MarkerImage("/static/pins_resource.png");
    this.stories = this.addMarkers([
      {lat: 37.479907, lng: -122.145378, assailant: 'family', gender: 'cis female', type_of_abuse: 'incest'},
      {lat: 37.480046, lng: -122.150570, assailant: 'outside', gender: 'cis female', type_of_abuse: 'gang rape'},
      {lat: 37.479400, lng: -122.156246, assailant: 'work', gender: 'cis female', type_of_abuse: 'sexual harassment'}],
      storyPin, true
    );
    this.resources = this.addMarkers([
      {lat: 37.409101, lng: -122.032489},
      {lat: 37.387982, lng: -122.134647},
      {lat: 37.433973, lng: -122.215460}],
      resourcePin, false
    );
    this.setEventHandlers();
  }

  setEventHandlers() {
    $('.toggle-stories').on('click', this.togglePins.bind(this, 'stories'));
    $('.toggle-resources').on('click', this.togglePins.bind(this, 'resources'));
  }

  togglePins(type, evt) {
    var $target = $(evt.currentTarget);
    $target.toggleClass('selected');
    var markers = (type === 'stories' ? this.stories : this.resources);
    $target.hasClass('selected') ? this.showMarkers(markers) : this.clearMarkers(markers);
  }

  // Adds a marker to the map.
  addMarkers(locations, pinImg, showInfoWindow) {
    var markers = [];
    for (let location of locations) {
      let marker = new google.maps.Marker({
        position: {lat: location.lat, lng: location.lng},
        map: null,
        icon: pinImg,
        markerId: location.id,
        animation: google.maps.Animation.DROP,
      });
      if (showInfoWindow) {
        var post_tags = location.post_id.split("_");
        var fbLink = 'https://www.facebook.com/permalink.php?story_fbid=' + post_tags[1] + '&id=' + post_tags[0];
        let infowindow = new google.maps.InfoWindow({
          content: '<div class="story-bubble" data-id="'+marker.markerId+'">'+
            '<div class="map-filter">'+location.assailant+'</div>'+
            '<div class="map-filter">'+location.type_of_abuse+'</div>'+
            '<div class="map-filter">'+location.gender+'</div>'+
            '<a href="'+fbLink+'" class="fb-link"><img src="/static/facebook_logo.png"></a>'+
            '<div class="read-story-btn">read story</div>'
        });
        marker.addListener('click', function() {
          if (this.openWindow) {
			      this.openWindow.close();
		      }
          infowindow.open(this.map, marker);
          this.openWindow = infowindow;
        }.bind(this));
      }
      markers.push(marker);
    }
    return markers;
  }

  // Sets the map on all markers in the array.
  setMapOnAll(markers, map) {
    for (let marker of markers) {
      marker.setMap(map);
    }
  }

  // Removes the markers from the map.
  clearMarkers(markers) {
    this.setMapOnAll(markers, null);
  }

  // Shows any markers in the array.
  showMarkers(markers) {
    this.setMapOnAll(markers, this.map);
  }
}
