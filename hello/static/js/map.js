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

    this.stories = this.addMarkers([
      {lat: 37.479907, lng: -122.145378},
      {lat: 37.480046, lng: -122.150570},
      {lat: 37.479400, lng: -122.156246}]);
    this.resources = this.addMarkers([
      {lat: 37.409101, lng: -122.032489},
      {lat: 37.387982, lng: -122.134647},
      {lat: 37.433973, lng: -122.215460}]);
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
  addMarkers(locations) {
    var markers = [];
    for (let location of locations) {
      var marker = new google.maps.Marker({
        position: location,
        map: null,
        animation: google.maps.Animation.DROP,
      });
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
