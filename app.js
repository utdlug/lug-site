var express = require('express')
  , http = require('http') , https = require('https') , path = require('path');
var fs = require('fs');
var app = express();
var appRedirect = express();
var siteUrl = "https://lug.utdallas.edu";
var certPath = "/var/www/certs/";
var options = {
    key: fs.readFileSync(certPath + 'lug.utdallas.edu.key'),
    cert: fs.readFileSync(certPath + 'lug.utdallas.edu.cert.cer'),
    ca: [ 
        fs.readFileSync(certPath + 'root.cer'),
        fs.readFileSync(certPath + 'inter1.cer')
        ]
};
var Subway = require('./irc/lib/subway');
var subway = new Subway();

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
   res.redirect(siteUrl + req.path);
});

app.use(function errorHandler(err, req, res, next) {
  var code = err.code;
  var message = err.message;
  res.writeHead(code, message, {'content-type' : 'text/plain'});
  res.end(message);
});

app.use(function(req, res, next){
  res.status(404);
  res.redirect(siteUrl);
});

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
        res.redirect(siteUrl + ":3000");
});
app.get('/irc', function(req, res) {
        res.redirect(siteUrl + ":3000");
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

subway.start();
