var GIF_DELAY = 8000;
var TWEET_DELAY = 15000;


// var GIF_ARRAY = [
// 	"http://i.imgur.com/UmpOi.gif", 
// 	"http://i.imgur.com/5zKXz.gif", 
// 	"http://media.tumblr.com/tumblr_mdgh98bNqQ1qbpbbo.gif",
// 	"http://24.media.tumblr.com/tumblr_lz5pi0qGDF1qgxqujo1_400.gif", 
// 	"http://24.media.tumblr.com/tumblr_m16q5xACKO1r06m1wo1_500.gif", 
// 	"http://i.imgur.com/DYO6X.gif" ];

var GIF_ARRAY = [
"http://cdn.booooooom.com/wp-content/uploads/2010/03/iamnotanartist_johnnykelly_01.gif",
"http://24.media.tumblr.com/tumblr_lwowzyzkSh1qe4xqxo1_500.gif",
"http://www.ohmagif.com/wp-content/uploads/2011/12/drunk-santa-fail.gif",
"http://gifsoup.com/webroot/animatedgifs1/1534891_o.gif",
"http://i.imgur.com/K2o7L.gif",
"http://24.media.tumblr.com/tumblr_l78u4wIGsz1qzpal4o1_500.gif",
"http://2.media.collegehumor.cvcdn.com/23/80/56bedcecd40a7824ad2591c6081e9ac5.gif",
"http://i.chzbgr.com/completestore/2011/12/15/9e36be9e-e6e3-4108-96a8-0474ece897c0.gif",
"http://gifsoup.com/webroot/animatedgifs4/3204067_o.gif",
"http://holidaygifgiver.com/media/images/gifs/434/434_original.gif",
"http://holidaygifgiver.com/media/images/gifs/437/437_original.gif",
"http://holidaygifgiver.com/media/images/gifs/433/433_original.gif",
"http://holidaygifgiver.com/media/images/gifs/548/548_original.gif",
"http://holidaygifgiver.com/media/images/gifs/552/552_original.gif",
"http://holidaygifgiver.com/media/images/gifs/336/336_original.gif",
"http://holidaygifgiver.com/media/images/gifs/462/462_original.gif",
"http://25.media.tumblr.com/5a08b3b4baffe5e8dd04d1e90b6249fc/tumblr_mexo8aqhiW1qdibj7o1_500.gif",
"http://media.tumblr.com/tumblr_mc5tobsZKC1rsw1yf.gif",
"http://24.media.tumblr.com/tumblr_mbasq6BtUv1rz88gno1_500.gif",
"http://25.media.tumblr.com/tumblr_mefowkFxOK1rn0vh6o1_500.gif",
"http://25.media.tumblr.com/fa92a55aafff07c7933b1e8583ed68aa/tumblr_mex4mhREyN1rjru8oo1_500.gif",
"http://24.media.tumblr.com/e3b5441bce8b82a98fa9ba5c57358822/tumblr_meriwoDS6J1qjjyjoo3_500.gif",
"http://24.media.tumblr.com/c3d33fd6dcdb52a428902d6d9df0f02a/tumblr_meriwoDS6J1qjjyjoo4_500.gif",
"http://25.media.tumblr.com/4bcaa458749721bdcd84db0a5962cf7f/tumblr_meriwoDS6J1qjjyjoo5_500.gif",
"http://24.media.tumblr.com/478bad15304fff8be7e7607a0d857a4c/tumblr_merb3rScJC1qjjyjoo6_500.gif",
"http://25.media.tumblr.com/b295dfbc510608ad72cf0da62e2b338e/tumblr_merb3rScJC1qjjyjoo10_500.gif",
"http://25.media.tumblr.com/tumblr_mdy6ir3DvS1rn0vh6o1_500.gif",
"http://24.media.tumblr.com/tumblr_melchevOgn1rjhbn2o1_500.gif",
"http://media.tumblr.com/tumblr_me9fe5SRrv1qzh54m.gif",
"http://25.media.tumblr.com/tumblr_mdwgmgV8fB1ravqado3_500.gif",
"http://media.tumblr.com/tumblr_mdenpzSfqB1qdw63a.gif",
"http://media.tumblr.com/tumblr_mcohh4nvX51rst7cg.gif",
"http://24.media.tumblr.com/tumblr_lwrs3vm86J1qzc6foo1_500.gif",
"http://24.media.tumblr.com/tumblr_lwp79vv8Uj1r6ycrio1_250.gif",
"http://media.tumblr.com/tumblr_meum2lhgLl1rurv44.gif",
"http://24.media.tumblr.com/tumblr_lwbpo0mdgu1r7gq2to1_500.gif",
"http://25.media.tumblr.com/50b18e71d4a078ca7d1b9cf16bb9acba/tumblr_mer01qGcM11qlhgn5o1_500.gif",
"http://25.media.tumblr.com/tumblr_lwwq8ryvET1qmwbqzo1_500.gif",
"http://24.media.tumblr.com/tumblr_m01efyHvnn1qe2fnco1_500.gif",
"http://i.imgur.com/K7Nu6.gif",
"http://24.media.tumblr.com/tumblr_ldznmay8O01qauafro1_500.gif",
"http://24.media.tumblr.com/tumblr_lj7jawvwhK1qe3o6ho1_r1_400.gif",
"http://25.media.tumblr.com/tumblr_luwt92Z0Dt1qhryfyo1_250.gif",
"http://25.media.tumblr.com/tumblr_mehr2cvKZS1qa5etko6_r1_250.gif",
"http://24.media.tumblr.com/tumblr_lwfmkkoyJJ1qfzvr3o1_250.gif",
"http://24.media.tumblr.com/tumblr_mdcaa9ix2o1qm7vk8o1_250.gif" ];

var socket = io.connect("/");
var newTweetQueue = [];
var displayingTweet = false;
var gif;


$(document).ready(init);

function init() {
	startSocket();

	$(window).bind('resize', resizeWindow);

	gif = $('.gif');
	tweetContainer = $('.tweet');

	updateGif();
	setInterval(updateGif, GIF_DELAY);
	
	//var tweet = new Tweet({handle:"derekmolson", txt:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus mattis ultrices diam, nec dictum ipsum ornare et. Sed porta vestibulum imperdiet."});
	//newTweetQueue.push(tweet);
	//newTweetQueue.push(tweet);
	//updateTweet();
}

function updateGif(){
	var url = GIF_ARRAY[Math.floor(Math.random() * GIF_ARRAY.length)];
	gif.attr('src', url);
	console.log(url);
}

function resizeWindow(e){
}




function startSocket() {
	socket.on('tweet', function (data) {
		onNewTweet(data);
	});
}

function onNewTweet(data) {
	//console.log(data);
	//if(data.entities.media != null) {
		var tweet = new Tweet({	handle:data.user.screen_name,
								username:data.user.name,
								userpic:data.user.profile_image_url,
								txt:formatTweetText(data.text),
								img: null
								//img:(data.entities.media) ? data.entities.media[0].media_url : null
								});
		console.log(tweet);
		newTweetQueue.push(tweet);
		if(!displayingTweet) updateTweet();
	//}
}

function formatTweetText(str) {
	return str.replace("#prophetholiday2012","");
}

function Tweet(config) {

	this.handle		= config.handle;
	this.username	= config.username;
	this.userpic	= config.userpic;
	this.txt 		= config.txt;
	this.img 		= config.img;

};

function displayTweet(tweet){
	displayingTweet = true;
	//if(tweet.img) {
		//tweetContainer.html('<img src="'+tweet.img+'"/><h3 class="shadow">' + tweet.txt + '</h3>' + '<h3>&#64;' + tweet.handle + '<h3>');
	//}else {
		tweetContainer.html('<h3 class="shadow">' + tweet.txt + '</h3>' + '<h3>&#64;' + tweet.handle + '<h3>');
	//}
	
	tweetContainer.fadeIn("slow");
	setTimeout(fadeOutTweet, TWEET_DELAY);
};

function fadeOutTweet(){
	tweetContainer.fadeOut("slow", updateTweet);
};

function updateTweet(){
	displayingTweet = false;

	if(newTweetQueue.length > 0) {
		var tweet = newTweetQueue.shift();
		//console.log(tweet);
		displayTweet(tweet);
	}
}