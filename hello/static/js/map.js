var map;
var reported_lng;
var reported_lat;
var stories_data;

function init() {
  $('#intro_modal').modal('show');
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
        // map = new StoryMap(place.geometry.location.lat(), place.geometry.location.lng());
      }
    });
  });
}

class StoryMap {
  constructor(lat = 37.766731, lng = -122.425782) {
  //facebook: lat = 37.484556, lng = -122.147845
  // SF: lat = 37.766731, lng = -122.425782
  // Centering on SF since we have resource pins
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
    var storyPin = new google.maps.MarkerImage("/static/pins_resource.png");
    var resourcePin = new google.maps.MarkerImage("/static/pins_stories.png");
    var stories_query = jQuery.ajax("/api/stories?lat=" + lat + "&lng=" + lng);
    stories_query.done(
      function(stories){
        stories_data = JSON.parse(stories);
        this.stories = this.addMarkers(stories_data,
        storyPin, "stories"
    );
        console.log('stories_data after query complete: ', stories_data)
      }.bind(this));
    var resources_queries = jQuery.ajax("/api/resources?lat=" + lat + "&lng=" + lng);
    resources_queries.done(
      function(resources){
        this.resources = this.addMarkers(JSON.parse(resources),
        resourcePin, "resources"
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
    $('.filter_box').on('click', function(e) {
      $(this).toggleClass('')
      var fieldvalue =  $(this).text().trim();
      var fieldname = $(this).attr('class').split(' ')[1];
      var filtered_stories_data = map.filterByField(stories_data, fieldname, fieldvalue);
      console.log('filtered story data:',filtered_stories_data);
      var storyPin = new google.maps.MarkerImage("/static/pins_resource.png");
      map.clearMarkers(map.stories);
      console.log('after clearMarkers', map.stories, stories_data)
      map.stories = map.addMarkers(filtered_stories_data, storyPin, true, "stories");
      console.log('after addMarkers', map.stories, stories_data)
    });
  }

  filterByField(objects, fieldName, fieldValue) {
    console.log('inside filterByField', objects, fieldName, fieldValue)
    var matches = [];
    for (let object of objects) {

      if (object['fields'][fieldName]=== fieldValue) {
        matches.push(object);
      }
    }
    return matches;
  }

  togglePins(type, evt) {
    // var $target = $(evt.currentTarget);
    // $target.toggleClass('selected');
    // var markers = (type === 'stories' ? this.stories : this.resources);
    // $target.hasClass('selected') ? this.showMarkers(markers) : this.clearMarkers(markers);

    var $target = $(evt.currentTarget);
    $target.toggleClass('selected');
    if (type == 'stories') {
      if ($target.hasClass('selected')) {
        var storyPin = new google.maps.MarkerImage("/static/pins_resource.png");
        map.clearMarkers(map.stories);
        this.stories = map.addMarkers(stories_data, storyPin, true, "stories");
        this.markers = this.stories;
      } else {
        this.clearMarkers(this.stories);
      }
    } else {
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
      if (type == "stories") {
        lat = parseFloat(lat) + Math.random() * .01
        lng = parseFloat(lng) + Math.random() * .01
      }
      let marker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        map: this.map,
        icon: pinImg,
        animation: google.maps.Animation.DROP,
      });

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
