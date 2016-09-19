var map;
var reported_lng;
var reported_lat;
var stories_data;

function init() {
  $('#intro_modal').modal('show');
  map = new StoryMap();
  var geoOptions = {
     timeout: 10 * 1000,
     maximumAge: 5 * 60 * 1000,
  }

  var geoSuccess = function(position) {
    map.map.setCenter({lat:position.coords.latitude, lng: position.coords.longitude});
    initAutocomplete();
    initForm();
  };
  var geoError = function(error) {
    console.log('Error occurred. Error code: ' + error.code);
  };

  navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
}

function initForm() {
  // (TODO:azorko) not using the resource center provided by user.
  $('#submit').click(function(e) {
    e.preventDefault();
    $('.accordion-container').hide();
    var data = {};
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
    console.log('lat' + reported_lat);
    console.log('lng' + reported_lng);
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
      if (places) {
        places.forEach(function(place) {
          if (place.geometry) {
            map.map.setCenter({lat:place.geometry.location.lat(), lng: place.geometry.location.lng()});
              // var resources_queries = jQuery.ajax("/api/resources?lat=" + place.geometry.location.lat() + "&lng=" + place.geometry.location.lng());
              // var resourcePin = new google.maps.MarkerImage("/static/pins_resource.png");
              // resources_queries.done(
              //   function(resources){
              //     map.resources = map.resources.concat(
              //       map.addMarkers(JSON.parse(resources),
              //       resourcePin, false, "resources")
              //     );
              //   map.clearMarkers(map.resources);
              //   map.showMarkers(map.resources);
              // }.bind(map));
          }
        });
      }
    });

    storyLocationBox.addListener('places_changed', function() {
      var places = storyLocationBox.getPlaces();
      if (places) {
        places.forEach(function(place) {
        if (place.geometry) {
          reported_lat = place.geometry.location.lat();
          reported_lng = place.geometry.location.lng();
          // map = new StoryMap(place.geometry.location.lat(), place.geometry.location.lng());
        }
      });
    }
  });
}

class StoryMap {
  // Center on SF on default.
  constructor(lat = 37.766731, lng = -122.425782) {

    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: lat, lng: lng},
      scrollwheel: false,
      zoom: 12
    });
    // this.stories = this.addMarkers([
    //   {lat: 37.422327, lng: -122.084401, assailant: 'domestic', type_of_abuse: 'rape', gender: 'female', location: 'college campus', reported: 'yes', pk: 1, story: "I was raped by a guy I was dating. I fell asleep and woke up to him raping me. It was very awkward and I never confronted him about it."}], storyPin, 'stories');
    // this.resources = this.addMarkers([
    //   {lat: 37.422327, lng: -122.084401, name: 'Planned Parenthood', address: '1 Hacker Way, Menlo Park', url: 'facebook.com', phone_number: '(408) 666-7867'},
    // {lat: 37.484556, lng: -122.147845, name: 'Facebook', address: '1 Hacker Way, Menlo Park', url: 'facebook.com', phone_number: '(408) 666-7867'}], storyPin, 'resources');
    this.storyPin = new google.maps.MarkerImage("/static/pins_resource.png");
    var resourcePin = new google.maps.MarkerImage("/static/pins_stories.png");
    var stories_query = jQuery.ajax("/api/stories?lat=" + lat + "&lng=" + lng);
    stories_query.done(
      function(stories) {
        stories_data = JSON.parse(stories);
        this.stories = this.addMarkers(stories_data, this.storyPin, "stories");
      }.bind(this));
    var resources_queries = jQuery.ajax("/api/resources?lat=" + lat + "&lng=" + lng);
    resources_queries.done(
      function(resources){
        this.resources = this.addMarkers(JSON.parse(resources), resourcePin, "resources");
      }.bind(this));

    this.setEventHandlers();
  }

  setEventHandlers() {
    $('.toggle-stories').on('click', this.togglePins.bind(this, 'stories'));
    $('.toggle-resources').on('click', this.togglePins.bind(this, 'resources'));
    $('#addStoryIcon, .slide-btn').on('click', function(){
      $('.accordion-container').toggleClass('move-accordion');
    });
    var toggleFilters = $('.toggle-filters');
    toggleFilters.on('click', function(evt) {
      $('.filters-list').toggleClass('expand-filters');
      toggleFilters.toggleClass('selected');
    });
    $('.filter_box').on('click', function(e) {
      var fieldvalue =  $(this).text().trim();
      var fieldname = $(this).data('filter-key');
      var filtered_stories_data = map.filterByField(stories_data, fieldname, fieldvalue);
      map.clearMarkers(map.stories);
      map.stories = map.addMarkers(filtered_stories_data, map.storyPin, "stories");
    });
  }

  filterByField(objects, fieldName, fieldValue) {
    var matches = [];
    for (let object of objects) {
      if (object['fields'][fieldName]=== fieldValue) {
        matches.push(object);
      }
    }
    return matches;
  }

  // Show or clear markers.
  togglePins(type, evt) {
    var $target = $(evt.currentTarget);
    $target.toggleClass('selected');
    if (type == 'stories') {
      map.clearMarkers(map.stories);
      if ($target.hasClass('selected')) {
        this.stories = map.addMarkers(stories_data, map.storyPin, "stories");
      }
    } else { // type == "resources"
      $target.hasClass('selected') ? this.showMarkers(this.resources) : this.clearMarkers(this.resources);
    }
  }

  // Adds a marker to the map.
  addMarkers(locations, pinImg, type) {
    var markers = [];

    for (let location_object of locations) {
      var location = location_object.fields;
      var lat = parseFloat(location.lat);
      var lng = parseFloat(location.lng);
      let marker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        map: this.map,
        icon: pinImg,
        // animation: google.maps.Animation.DROP,
      });

      let infowindow;
      if (type === 'stories') {
        var fbLink = '';
        if (location.post_id) {
          var post_tags = location.post_id.split("_");
          fbLink = 'https://www.facebook.com/permalink.php?story_fbid=' + post_tags[1] + '&id=' + post_tags[0];
        }
        var reported = location.report === 'yes' ? 'reported' : 'not reported';
        var storyTextVisibility = location.story === '' ? 'hide' : '';
        var fbLinkVisibility = location.story === '' ? '' : 'hide';
        var readStoryVisibility = location.story === '' ? 'hide' : '';
        if (fbLink === '') {
          fbLinkVisibility += ' no-fb-link';
        }
        infowindow = new google.maps.InfoWindow({
          content: '<div class="story-bubble">'+
            '<div class="map-filter">'+location.assailant+'</div>'+
            '<div class="map-filter">'+location.type_of_abuse+'</div>'+
            '<div class="map-filter">'+location.gender+'</div>'+
            '<div class="map-filter">'+location.location+'</div>'+
            '<div class="map-filter">'+reported+'</div>'+
            '<button class="btn btn-default read-story-btn '+readStoryVisibility+'">read story</button></div>'+
            '<div class="story-text '+storyTextVisibility+'">'+location.story+'</div>'+
            '<a href="'+fbLink+'" class="fb-btn '+fbLinkVisibility+'"><img class="fb-logo" src="/static/fb_logo.png">share</a>'
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
            $('.fb-btn').removeClass('hide');
          });
        }

        this.openWindow = infowindow;
      }.bind(this));
      markers.push(marker);
    }
    return markers;
  }

  // Sets the map on all markers in the array.
  setMapOnAll(markers, mapObj) {
    for (let marker of markers) {
      marker.setMap(mapObj);
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
