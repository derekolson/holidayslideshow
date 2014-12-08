var container, photoContainer, photo, info, userPhoto, userName,
	timeout = 0,
	currImg = 0,
	picDelay = 10000,
	tweets = {},
	tweetArray = [],
	newTweetQueue = [];

var socket = io.connect("/");

$(document).ready(init);
	
function init() {
	loadTweets();
	//loadTweetsNode();
	startSocket();
	
	// cache DOM elements
	container 		= $('.container');
	photoContainer 	= $('.photo-container');
	photo 			= $('#photo');
	info            = $('.info');
	userPhoto       = $('.user-photo');
	userName		= $('.user-name');
	
	info.hide();
	container.hide();

	// listen 
	photo.load(largePhotoLoaded);
	$(window).resize(onResize);
}

function onResize(){
	var tweet 			= tweetArray[currImg],
		containerWidth  = $(window).width(),
		containerHeight = $(window).height(),
		containerRatio  = containerWidth / containerHeight,
		imageRatio = tweet.w / tweet.h,
		padding 		= 30,
		ratio 			= 0,
		newWidth 		= 0,
		newHeight 		= 0;
			
	container.width(containerWidth);
	container.height(containerHeight);
	
	if (imageRatio >= containerRatio) {
		var targetWidth = containerWidth - (padding * 2);
		var currentWidth = tweet.w;
		ratio = targetWidth/currentWidth;
	} else if (imageRatio < containerRatio) {
		var targetHeight = containerHeight - (padding * 2);
		var currentHeight = tweet.h;
		ratio = targetHeight/currentHeight;
	}
	
	newWidth = Math.round(tweet.w * ratio);
	newHeight = Math.round(tweet.h * ratio);
	
	photo.width(newWidth);
	photo.height(newHeight);
	
	photoContainer.width(newWidth);
	photoContainer.height(newHeight);
	
	photoContainer.css({
		left: (containerWidth - photoContainer.outerWidth())*0.5,
		top: (containerHeight - photoContainer.outerHeight())*0.5
	});
}

function startSocket() {
	socket.on('tweet', function (data) {
		onNewTweet(data);
	});
}

function onNewTweet(tweet) {
	//console.log(tweet);
	if(tweet.entities.media != null) {
		var tweetObj = new twtObj({
			handle:tweet.user.screen_name,
			username:tweet.user.name,
			userpic:tweet.user.profile_image_url,
			txt:formatString(tweet.text), 
			img:tweet.entities.media[0].media_url,
			size:tweet.entities.media[0].sizes.large
		});
		
		console.log(tweetObj);
		newTweetQueue.push(tweetObj);
	}
}

/****************************************************************/
// Tweet Obj:
function twtObj(config) {
	this.handle		= config.handle;
	this.username	= config.username;
	this.userpic	= config.userpic;
	this.txt 		= config.txt;
	this.img 		= config.img;
	this.w 			= config.size.w;
	this.h 			= config.size.h;
	this.isVert 	= getOrientation(config.size);
};

/****************************************************************/
// Load Tweets:
function loadTweets() {
	$.ajax({
		url: 'http://search.twitter.com/search.json',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			q: '#prophetholiday2012 -RT',
			results_type: 'mixed',
			include_entities: true,
			rpp: '100'
		},
		success: function(data) {
			// console.log(data.results);
			var results = data.results;
			
			if(results.length > 0){
				
				for(var i = 0; i < results.length; i++){
					if(results[i].entities.media) {
						var tweetObj = new twtObj({
							handle:results[i].from_user,
							username:results[i].from_user_name,
							userpic:results[i].profile_image_url,
							txt:formatString(results[i].text), 
							img:results[i].entities.media[0].media_url,
							size:results[i].entities.media[0].sizes.large
						});
						
						tweetArray.push(tweetObj);
						console.log(tweetObj);
					}
				}
			}else{
				console.log("no results");
			};
			
			// update UI with content 
			// startSlideshow();
			renderTweet();
		}
	});
};

function loadTweetsNode() {       
	$.ajax({
		url: '/tweets',
		type: 'GET',
		dataType: 'json',
		success: function(data) {
			// console.log(data.results);
			var results = data.results;
			
			if(results.length > 0){
				
				for(var i = 0; i < results.length; i++){
					if(results[i].entities.media) {
						var tweetObj = new twtObj({
							handle:results[i].from_user,
							username:results[i].from_user_name,
							userpic:results[i].profile_image_url,
							txt:formatString(results[i].text), 
							img:results[i].entities.media[0].media_url,
							size:results[i].entities.media[0].sizes.large
						});
						
						tweetArray.push(tweetObj);
						console.log(tweetObj);
					}
				}
			}else{
				console.log("no results");
				
			};

			//update UI with content 
			// startSlideshow();
			renderTweet();
		}
	});
};

/****************************************************************/
// App Functions:
function startSlideshow() {
	renderTweet();
	// setInterval(changeImg, picDelay);
}

// strip image url from tweet:
function formatString(str){
 
	var sArray = str.split(' ');
	
	for(var i = 0; i < sArray.length; i++){
		
		//check for "HTTP" in string, splic if found
		
		var boolUrl = S(sArray[i]).startsWith("http");
		var boolTag = S(sArray[i]).startsWith("#prophetholiday2012");
		
		if(boolUrl || boolTag ){
			//console.log("booltag:" + boolTag + " string:" + sArray[i] )
			sArray.splice(i);
		}
	}
	
	// rebuild string removing ","
	return S(sArray.join()).replaceAll(',', ' ');
}

function getOrientation(size){
	if(size.h > size.w){
		return true;
	}else{
		return false;
	};
};

function renderTweet(){
	var tweet = tweetArray[currImg];
	
	photo.attr('src', tweet.img + ":orig");
	userName.html(tweet.username + " | &#64;" + tweet.handle);
	userPhoto.attr('src', tweet.userpic);
	
	onResize();
};

function changeImg(){
	info.delay(200).fadeOut("slow");
	container.delay(500).fadeOut("slow", updateCurrent);
};

function largePhotoLoaded(e){
	e.preventDefault();
	// console.log(e);
	
	info.delay(500).fadeIn("slow");
	container.delay(200).fadeIn("slow");
	
	clearTimeout(timeout);
	timeout = setTimeout(changeImg, picDelay);
}

function updateCurrent(){
	//Splice in new tweets
	if(newTweetQueue.length > 0) {
		
		for(var i=0; i<newTweetQueue.length; i++) {
			tweetArray.splice(currImg + i + 1, 0, newTweetQueue[i]);
		}

		newTweetQueue.length = 0;
	}

	currImg++;
	currImg %= tweetArray.length;

	console.log(currImg);
	renderTweet();
}

