/* extremely bare for now. will add routing, mongo, and api stuff soon. */

var express = require('express')
  , http = require('http') , https = require('https') , path = require('path');
var fs = require('fs');
var app = express();
var appRedirect = express();

var options = {
    key: fs.readFileSync('/var/www/certs/lug.utdallas.edu.key'),
    cert: fs.readFileSync('/var/www/certs/lug.utdallas.edu.cer')
//   rejectUnauthorized: false
};

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
app.set('port', process.env.PORT || 3001);  // dev
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

appRedirect.set('port', 3002);
appRedirect.get("*", function (req, res) {
   res.redirect("https://lug.utdallas.edu" + req.path);
});

/* Future Mongo / Mongoose support
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/lug-site');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // continue
}); 

// Schema 
var lugEvent = mongoose.Schema({
    date: { type: Date },
    title:  String,
    body:   String,
    hidden: Boolean,
    updated: { type: Date, default: Date.now }
});
*/


if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Routing
app.get('/', function(req, res) {
        res.render('index', {title: "Linux Users Group @ UTD"});
});
app.get('/join', function(req, res) {
        res.redirect("https://orgsync.com/join/15316/linux-users-group");
});
app.get('/chat', function(req, res) {
        res.redirect("https://lug.utdallas.edu:3000");
});
app.get('/irc', function(req, res) {
        res.redirect("https://lug.utdallas.edu:3000");
});
app.get('/stats', function(req, res) {
        res.redirect("http://stats.utdlug.org.s3-website-us-east-1.amazonaws.com/");
});

http.createServer(appRedirect).listen(appRedirect.get('port'), function(){
  console.log('Express server (http redirect) listening on port ' + appRedirect.get('port'));
});

https.createServer(options,app).listen(app.get('port'), function(){
  console.log('Express server (SSL) listening on port ' + app.get('port'));
});

