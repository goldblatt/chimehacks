var map;
var reported_lng;
var reported_lat;

function init() {
  map = new StoryMap();
  //getting user geolocation takes too long to load
  // if ("geolocation" in navigator) {
  //   navigator.geolocation.getCurrentPosition(function(position) {
  //     map = new StoryMap(position.coords.latitude, position.coords.longitude);
  //   }, function(err) { console.log('error loading new map' + err); });
  // }
  initAutocomplete();
  initForm();
}

function initForm() {

$('#addStoryIcon').click(function(e) {
  $('.accordion-container').addClass('accordion-container-show');
});

$('#submit').click(function(e) {
  $('.accordion-container').hide();
  var data = {};
  e.preventDefault();
  console.log('submit clicked')
  data.gender = $('#genderInput').val().trim();
  data.type = $('#typeInput').val().trim();
  data.assailant = $('#assailantInput').val().trim();
  data.location = $('#locationInput').val().trim();
  data.report = $('input[name="reportInput"]:checked').val();
  data.story = $('#storyInput').val().trim();
  data.permission = $('input[name="permissionInput"]:checked').val();
  data.longitude = reported_lng;
  data.latitude = reported_lat;
  console.log(data)
  $.ajax({
      type:'POST',
      url: '/api/add/story',
      data: data,
      success: function() {
          console.log('adding story worked');
      },
      error: function() {
          console.log('error adding story');
      }
  });
});

}

function initAutocomplete() {
    var input1 = document.getElementById('map_search');
    var input2 = document.getElementById('specificLocationInput');
    var mapSearchBox = new google.maps.places.SearchBox(input1);
    var storyLocationBox = new google.maps.places.SearchBox(input2);

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    mapSearchBox.addListener('places_changed', function() {
      var places = mapSearchBox.getPlaces();
      if (!places) {
      return;
      }
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        } else {
          console.log('geometry is: ', place.geometry.location.lat(), place.geometry.location.lng())
          map.map.setCenter({lat:place.geometry.location.lat(), lng: place.geometry.location.lng()});
        }
      });
    });

    storyLocationBox.addListener('places_changed', function() {
    var places = storyLocationBox.getPlaces();
      if (!places) {
      return;
      }
      places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      } else {
        console.log('geometry is: ', place.geometry.location.lat(), place.geometry.location.lng())
        reported_lat = place.geometry.location.lat();
        reported_lng = place.geometry.location.lng();
      }
    });
  });
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
    var stories_query = jQuery.ajax("/api/stories?lat=" + lat + "&lon=" + lng);
    stories_query.done(
      function(stories){
        console.log(stories)
        this.stories = this.addMarkers(JSON.parse(stories),
        storyPin, true, "stories"
    );
      }.bind(this));
    var resources_queries = jQuery.ajax("/api/resources?lat=" + lat + "&lon=" + lng);
    resources_queries.done(
      function(resources){
        this.resources = this.addMarkers(JSON.parse(resources),
        resourcePin, false, "resources"
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
    $('.toggle-filters').on('click', function(evt) {
      $('.filters-list').toggleClass('expand-filters');
    });
  }

  togglePins(type, evt) {
    var $target = $(evt.currentTarget);
    $target.toggleClass('selected');
    var markers = (type === 'stories' ? this.stories : this.resources);
    $target.hasClass('selected') ? this.showMarkers(markers) : this.clearMarkers(markers);
  }

  // Adds a marker to the map.
  addMarkers(locations, pinImg, showInfoWindow, type_of_marker) {
    var markers = [];
    for (let location_object of locations) {
      var location = location_object.fields;
      var lat = parseFloat(location.lat); 
      var lng = parseFloat(location.lng); 
      if (type_of_marker == "stories") {
        lat = parseFloat(lat) + Math.random() * .01
        lng = parseFloat(lng) + Math.random() * .01
      }
      let marker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        map: null,
        icon: pinImg,
        markerId: location.id,
        animation: google.maps.Animation.DROP,
      });
      if (showInfoWindow) {
        var fbLink = "";
        if (location.post_id) {
          var post_tags = location.post_id.split("_");
          fbLink = 'https://www.facebook.com/permalink.php?story_fbid=' + post_tags[1] + '&id=' + post_tags[0];
        }


        let infowindow = new google.maps.InfoWindow({
          content: '<div class="story-bubble" data-id="'+marker.markerId+'">'+
            '<div class="map-filter">'+location.assailant+'</div>'+
            '<div class="map-filter">'+location.type_of_abuse+'</div>'+
            '<div class="map-filter">'+location.gender+'</div>'+
            '<a href="'+fbLink+'" class="fb-link"><img src="/static/facebook_logo.png"></a>'+
            '<button class="btn btn-default read-story-btn">read story</button>'
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
