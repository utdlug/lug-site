/* extremely bare for now. will add routing, mongo, and api stuff soon. */

var express = require('express')
  , http = require('http') , https = require('https') , path = require('path');
var fs = require('fs');
var app = express();
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
    if(!req.secure) {
        res.redirect(301, "https://lug.utdallas.edu");
    }
    else {
        res.render('index', {title: "Linux Users Group @ UTD"});
    }
});
app.get('/join', function(req, res) {
    if(!req.secure) {
        res.redirect(301, "https://" + req.headers.host + req.url);
    }
    else {
        res.redirect("https://orgsync.com/join/15316/linux-users-group");
    }
});
app.get('/chat', function(req, res) {
    if(!req.secure) {
        res.redirect(301, "https://" + req.headers.host + req.url);
    }
    else {
        res.redirect("https://lug.utdallas.edu:3000");
    }
});
app.get('/irc', function(req, res) {
    if(!req.secure) {
        res.redirect(301, "https://" + req.headers.host + req.url);
    }
    else {
        res.redirect("https://lug.utdallas.edu:3000");
    }
});

http.createServer(app).listen(80, function(){
  console.log('Express server (http redirect) listening on port 80');
});

https.createServer(options,app).listen(app.get('port'), function(){
  console.log('Express server (SSL) listening on port ' + app.get('port'));
});

