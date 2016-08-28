// Initialize Firebase
var config = {
apiKey: "AIzaSyArj4LyQReInkR_--KfcGeDdF1ELVOi0MM",
authDomain: "spectra-trip-app.firebaseapp.com",
databaseURL: "https://spectra-trip-app.firebaseio.com",
storageBucket: "spectra-trip-app.appspot.com",
};
firebase.initializeApp(config);
var database = firebase.database();
var storage = firebase.storage();

function injectImage(url, imgElem){
	var gsReference = storage.refFromURL(url);
	gsReference.getDownloadURL().then(function(url) {
		imgElem.attr('src', url);
	}).catch(function(error) {
	  console.log('error downloading image', error);
	});
}

function addTripCard(trip, id){
		var link = '/listing.html?'+id;
		var card = $('<div class="col-md-6 img-portfolio">\
 				<a class="locol-link" href="'+link+'">\
                    <img class="img-responsive img-hover locol-cover_photo">\
                </a>\
                <h3>\
                    <a class="locol-link locol-title" href="'+link+'">' + trip.title + '</a>\
                </h3>\
                <p class="locol-location">' + trip.location + '</p>\
                <p class="locol-price"> Price: $' + trip.price + '</p>\
            </div>');

		injectImage(trip.cover_photo, card.find('img'));
		$('.locol-trips').append(card);
}

function init(){
	database.ref('trips/').on('child_added', function(snapshot) {
		var trip = snapshot.val();
		var id = snapshot.key;
		addTripCard(trip, id);
	});	
	$('#search-form').on('submit', onFormSubmit);
}

function onFormSubmit(event) {
  event.preventDefault();
  var searchTerm = $('.locol-search-term').val();
  filterBySearch(searchTerm)

  if (parseInt(searchTerm)){
	filterByPrice(0, Number(searchTerm));
	console.log('fitler by price')
  } else {
  	filterBySearch(searchTerm);
  	console.log('filter by term')
  }
}

function filterByPrice(lower, upper){
	$('.locol-trips').empty();
	console.log(lower, upper)
	database.ref('trips/').on('child_added', function(snapshot) {
		console.log('snapshot.val()', snapshot.val())
		var trip = snapshot.val();
		if (trip.price < upper && trip.price > lower){
			var id = snapshot.key;
			addTripCard(trip, id);
		}
	});
}

function filterBySearch(term) {
	$('.locol-trips').empty();
	database.ref('trips/').on('child_added', function(snapshot) {
		console.log('snapshot.val()', snapshot.val())
		var trip = snapshot.val();
		var reg = new RegExp(term, 'i');
		if (reg.test(trip.location) || reg.test(trip.title) || reg.test(trip.description)){
			var id = snapshot.key;
			addTripCard(trip, id);
		}
	});

}

$(init());
