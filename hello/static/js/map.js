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
    // this.stories = this.addMarkers([
    //   {lat: 37.422327, lng: -122.084401, assailant: 'domestic', type_of_abuse: 'rape', gender: 'female', location: 'college campus', reported: 'yes', pk: 1, story: "I was raped by a guy I was dating. I fell asleep and woke up to him raping me. It was very awkward and I never confronted him about it."}], storyPin, 'stories');
    // this.resources = this.addMarkers([
    //   {lat: 37.422327, lng: -122.084401, name: 'Planned Parenthood', address: '1 Hacker Way, Menlo Park', url: 'facebook.com', phone_number: '(408) 666-7867'},
    // {lat: 37.484556, lng: -122.147845, name: 'Facebook', address: '1 Hacker Way, Menlo Park', url: 'facebook.com', phone_number: '(408) 666-7867'}], storyPin, 'resources');
    var stories_query = jQuery.ajax("/api/stories?lat=" + lat + "&lon=" + lng);
    stories_query.done(
      function(stories){
        this.stories = this.addMarkers(JSON.parse(stories),
        storyPin, 'stories'
    );
      }.bind(this));
    var resources_queries = jQuery.ajax("/api/resources?lat=" + lat + "&lon=" + lng);
    resources_queries.done(
      function(resources){
        this.resources = this.addMarkers(JSON.parse(resources),
        resourcePin, 'resources'
    );
      }.bind(this));

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
  addMarkers(locations, pinImg, type) {
    var markers = [];
    for (let location_object of locations) {
      var location = location_object.fields;
      let marker = new google.maps.Marker({
        position: {lat: parseFloat(location.lat), lng: parseFloat(location.lng)},
        map: null,
        icon: pinImg,
        animation: google.maps.Animation.DROP,
      });
      marker = Object.assign(marker, location);
      let infowindow;
      if (type === 'stories') {
        var fbLink = "";
        if (location.post_id) {
          var post_tags = location.post_id.split("_");
          fbLink = 'https://www.facebook.com/permalink.php?story_fbid=' + post_tags[1] + '&id=' + post_tags[0];
        }
        var reported = location.report === 'yes' ? 'reported' : 'not reported';
        infowindow = new google.maps.InfoWindow({
          content: '<div class="story-bubble">'+
            '<div class="map-filter">'+location.assailant+'</div>'+
            '<div class="map-filter">'+location.type_of_abuse+'</div>'+
            '<div class="map-filter">'+location.gender+'</div>'+
            '<div class="map-filter">'+location.location+'</div>'+
            '<div class="map-filter">'+reported+'</div>'+
            '<button class="btn btn-default read-story-btn">read story</button></div>'+
            '<div class="story-text">'+location.story+'</div>'+
            '<a href="'+fbLink+'" class="fb-btn display-none"><img class="fb-logo" src="/static/fb_logo.png">share</a>'
        });
      } else { // type = resources
        var contentString = '<div class="resource-name">'+location.name+'</div>';
        if (location.address) { contentString += '<div class="resource-address">'+location.address+'</div>';  }
        if (location.phone_number) { contentString += '<div class="resource-phone">'+location.phone_number+'</div>';  }
        if (location.url) { contentString += '<div class="resource-url">'+location.url+'</div>'; }
        infowindow = new google.maps.InfoWindow({ content: contentString });
      }
      marker.addListener('click', function() {
        if (this.openWindow) {
          this.openWindow.close();
        }
        infowindow.open(this.map, marker);
        if (type === 'stories') {
          $('.read-story-btn').on('click', function(evt) {
            $(evt.currentTarget).hide();
            $('.story-text').show();
            $('.fb-btn').removeClass('display-none');
          });
        }

        this.openWindow = infowindow;
      }.bind(this));
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
