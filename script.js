$(document).ready(() => {
	setLocation("Fairway", "Kansas, United States");
	makeRating(4);

	let title = "Shawnee Mission School Board lets down its district with ...";
	let source = "Kansas City Star";
	let timestamp = "16 hours ago";
	let caption = "This is what it's like to be the parent of an Shawnee Mission School District student in 2017. It's frustrating. It's confusing. It's maddening. The district answers a question about legal fees by incurring more legal fees. The district, once the jewel of public education in Kansas City, now excels in the art of the ...";
	
	makeNewsCard(title, source, timestamp, caption); 

	let author = "YaleHack"
	let tweet1 = "When's the next Soylent stampede? Stay tuned...";
	let tweet2 = "Handsome Dan, Yale's mascot, came to visit! Good pats were had by all @HandsomeDan18 @Yale";
	makeTwitterFeed([makeTweetCard(author, tweet1), makeTweetCard(author, tweet2)]);

	// makeNewsCard(title, source, timestamp, caption); 
});

const makeReq = (lat, lng) => {
	$("#results").html('');
	$.ajax({
		 url: "https://maps.googleapis.com/maps/api/geocode/json",
		 data: {
		  latlng: lat + "," + lng,
		  key: "AIzaSyCZ3Ejf0EzxClDbW0ouPgtuyBcDW1utz68"
		 },
		 success: function(res) {
		  const city = res.results[0].address_components[2].short_name;
		  const state = res.results[0].address_components[3].long_name;
		  const country = res.results[0].address_components[4].long_name;

		  setLocation(city, state + ", " + country);
		  get_tweets(lat, lng);
		  getNews(city, state);
		  // get_tweets(lat, lng);
		 }
	});
	makeRating(4);
}

var results = [];
function get_tweets(lat, lng) {
    results = [];
    var data = {"Lat" : lat.toString(), "Lng" : lng.toString()};
    $.post('http://127.0.0.1:5000/tweets', data , function(response){
        console.log(response.results);
        console.log("OUT OF POST");

        let tweets = [];
        const responseObj = JSON.parse(response);
        for (let i = 0; i < responseObj.results.length; i++) {
        	tweets[i] = makeTweetCard(responseObj.results[i].handle, responseObj.results[i].text);
        }
        makeTwitterFeed(tweets);
    });
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function getNews(city, state) {
  const url = 'https://newsapi.org/v2/everything\?q=' +
           city + "+" + state + "&" + 'apiKey=' + "e9793fbd1d1c43ad9edbf5566a13339d";
  httpGetAsync(url, finalCallback);
}

function finalCallback(response) {
  obj = JSON.parse(response);
  // alert(JSON.stringify(obj));
  console.log(obj);
  const article1 = obj.articles[0];
  const article2 = obj.articles[1];
  const article3 = obj.articles[2];

  makeNewsCard(article1.title, article1.source.name, article1.publishedAt, article1.description, article1.url);
  makeNewsCard(article2.title, article2.source.name, article2.publishedAt, article2.description, article2.url);
  makeNewsCard(article3.title, article3.source.name, article3.publishedAt, article3.description, article3.url);
}

const makeNewsRequest = (city, state) => {
	$.ajax({
		url: "https://newsapi.org/v2/everything",
		data: {
		  apiKey: "e9793fbd1d1c43ad9edbf5566a13339d",
		  q: city + "+OR+" + state,
		},
		type: 'GET',
		crossDomain: 'true',
		dataType: 'jsonp',
		success: function(res) {
		  // const city = res.results[0].address_components[2].short_name;
		  // const state = res.results[0].address_components[3].long_name + ", " 
		  // 	+ res.results[0].address_components[4].long_name;

		  // setLocation(city, state);
			console.log("HIIIII");
		  // console.log(res);
		},
		error: function(err) {
		 	console.log(err);
		}
	});
}

const setLocation = (city, state) => {
	$("#city").text(city);
	$("#state").text(state);
}

const makeRating = (rating) => {
	let div = "<div class='rating'>" + 
				"<div class='rating-desc-container'>" +
					"<span id='rating-desc' class='source'>Positivity Rating </span>" + "</div>";
					// "<span id='help' onclick='openOnClick()'><i class='fa fa-question-circle-o' aria-hidden='true'></i></span></div>";
	for (let i = 0; i < rating; i++) {
		let svg = "<svg width='30' height='20'><circle cx='10' cy='10' r='10' fill='#a2ccff'/></svg>";
		div += svg;
	}

	for (let i = rating; i < 5; i++) {
		let svg = "<svg width='30' height='20'><circle cx='10' cy='10' r='10' fill='#ffffff'/></svg>";
		div += svg;
	}

	div += "</div>"
	$("#results").append(div);
	const height = parseInt($(".header").css("height")) + 75;
	$(".rating").css("margin-top", height + "px");
}

const makeNewsCard = (title, source, timestamp, caption, url) => {
	let titleDiv = "<div class='title'><a href='" + url + "'>" + title + "</a></div>";

	let sourceDiv = "<div class='source'>" + source + "</div>";
	let timestampDiv = "<div class='timestamp'>" + timestamp + "</div>";
	let infoDiv = "<div class='info'>" + sourceDiv + "|" + timestampDiv + "</div>";

	let captionDiv = "<div class='caption'>" + caption + "</div>";

	let result = "<div class='result'>" + titleDiv + infoDiv + captionDiv + "</div>";
	$("#results").append(result);
}

const makeTwitterFeed = (cards) => {
	let div = "<div class='twitter-group'><div class='twitter-header'>" +
		"<i class='fa fa-twitter' aria-hidden='true'></i> Twitter Feed</div>" +
				"<div class='twitter'>";

	for (let i = 0; i < cards.length; i++) {
		div += cards[i];
	}
				
	div += "</div></div>";
	$("#results").append(div);
}

const makeTweetCard = (author, chars) => {
	let authorCard = "<div class='author'>@" + author + "</div>";
	let charsCard = "<div class='chars'>" + chars + "</div>";

	let tweet = "<div class='tweet'>" + authorCard + charsCard + "</div>";
	let tweetContainer = "<div class='tweet-container'>" + tweet + "</div>";
	return tweetContainer;
}