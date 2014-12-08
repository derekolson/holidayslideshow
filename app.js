var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');


//ENV Config
var TWITTER_KEYWORD = "holiday",
    CONSUMER_KEY = process.env.CONSUMER_KEY,
    CONSUMER_SECRET = process.env.CONSUMER_SECRET,
    ACCESS_TOKEN = process.env.ACCESS_TOKEN,
    ACCES_TOKEN_SECRET = process.env.ACCES_TOKEN_SECRET;

// Express config
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  // app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/gif', routes.gif);
//app.post('/gif/add', routes.addgif);
app.get('/tweets', getTweets);

// Start HTTP/Express Server
var server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// Socket.io config
var io = require('socket.io').listen(server);

io.configure(function () { 
  io.set('transports', ['xhr-polling']); 
  io.set('polling duration', 10);
  io.set('log level', 1);
});

io.sockets.on('connection', function (socket) {
  console.log('socket connected');
});

// Twitter Config
//var twitter = require('ntwitter');
var Twit = require('twit')
var twit = new Twit({
  consumer_key: CONSUMER_KEY,
  consumer_secret: CONSUMER_SECRET,
  access_token: ACCESS_TOKEN,
  access_token_secret: ACCES_TOKEN_SECRET
});

function trackTwitterStream(keyword) { 
  twit.stream('statuses/filter', { track: keyword, include_entities: true }, function(stream) {
    stream.on('data', function (data) {
      console.log(data);
      io.sockets.emit('tweet', data);
    });

    stream.on('error', function (data) {
      console.log(data);
    });
  });
}

function getTweets(req, res){
  var query = TWITTER_KEYWORD + " -RT";
  twit.get('search/tweets', { q: query, include_entities: true, count: 100}, function(err, data) {
      //console.log(data);
      res.json(data);
    }
  );
};

trackTwitterStream(TWITTER_KEYWORD);
