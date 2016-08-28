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
    var storyPin = new google.maps.MarkerImage("/static/pins_resource.png");
    var resourcePin = new google.maps.MarkerImage("/static/pins_stories.png");
    this.stories = this.addMarkers([
      {lat: 37.422327, lng: -122.084401, assailant: 'domestic', type_of_abuse: 'rape', gender: 'female', location: 'college campus', reported: 'yes', pk: 1}], storyPin, true);
    // var stories_query = jQuery.ajax("/api/stories?lat=" + lat + "&lon=" + lng);
    // stories_query.done(
    //   function(stories){
    //     this.stories = this.addMarkers(JSON.parse(stories),
    //     storyPin, true
    // );
    //   }.bind(this));
    // var resources_queries = jQuery.ajax("/api/resources?lat=" + lat + "&lon=" + lng);
    // resources_queries.done(
    //   function(resources){
    //     this.resources = this.addMarkers(JSON.parse(resources),
    //     resourcePin, false
    // );
    //   }.bind(this));

    this.setEventHandlers();
  }

  setEventHandlers() {
    $('.toggle-stories').on('click', this.togglePins.bind(this, 'stories'));
    $('.toggle-resources').on('click', this.togglePins.bind(this, 'resources'));
    $('#addStoryIcon').on('click', function(){
      $('.accordion-container').toggle();
    });
  }

  filterByField(objects, fieldName, fieldValue) {
    var matches = [];
    for (let object of objects) {
      if (object[fieldName] === fieldValue) {
        matches.push(object);
      }
    }
    return matches;
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
    for (let location of locations) { //location_object
      // var location = location_object.fields;
      let marker = new google.maps.Marker({
        position: {lat: parseFloat(location.lat), lng: parseFloat(location.lng)},
        map: null,
        icon: pinImg,
        animation: google.maps.Animation.DROP,
      });
      marker = Object.assign(marker, location);
      if (showInfoWindow) {
        var fbLink = "";
        if (location.post_id) {
          var post_tags = location.post_id.split("_");
          fbLink = 'https://www.facebook.com/permalink.php?story_fbid=' + post_tags[1] + '&id=' + post_tags[0];
        }
        var reported = location.report === 'yes' ? 'reported' : 'not reported';
        let infowindow = new google.maps.InfoWindow({
          content: '<div class="story-bubble">'+
            '<div class="map-filter">'+location.assailant+'</div>'+
            '<div class="map-filter">'+location.type_of_abuse+'</div>'+
            '<div class="map-filter">'+location.gender+'</div>'+
            '<a href="'+fbLink+'" class="fb-link"><img src="/static/facebook_logo.png"></a>'+
            '<div class="map-filter">'+location.location+'</div>'+
            '<div class="map-filter">'+reported+'</div>'+
            '<div class="story-text">'+location.story+'</div>'+
            '<button class="btn btn-default read-story-btn">read story</button></div>'
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
