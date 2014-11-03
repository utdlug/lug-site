'use strict';
var express = require('express'),
    fs = require('fs'),
    http = require('http'),
    https = require('https'),
    path = require('path'),
    siteUrl = "https://lug.utdallas.edu",
    certPath = "/var/www/certs/",
    options = {
        key: fs.readFileSync(certPath + 'lug.utdallas.edu.key'),
        cert: fs.readFileSync(certPath + 'lug.utdallas.edu.cert.cer'),
        ca: [
            fs.readFileSync(certPath + 'root.cer'),
            fs.readFileSync(certPath + 'inter1.cer')
        ]
    },
    app = express(),
    appRedirect = express();

app.set('views', __dirname + '/views');
app.set('port', process.env.PORT || 3001); // dev
app.set('view engine', 'jade');
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(function(err, req, res, next) {
    var code = err.code,
        message = err.message;
    res.writeHead(code, message, {
        'content-type': 'text/plain'
    });
    res.end(message);
});
app.use(function(req, res, next) {
    res.status(404);
    res.redirect(siteUrl);
});

if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

appRedirect.set('port', 3002);
appRedirect.get("*", function(req, res) {
    res.redirect(siteUrl + req.path);
});

app.get('/', function(req, res) {
    res.render('index', {
        title: "Linux Users Group @ UTD"
    });
});
app.get('/join', function(req, res) {
    res.redirect("https://orgsync.com/join/15316/linux-users-group");
});
app.get('/chat', function(req, res) {
    res.redirect("https://scrollback.io/lug-utd");
});
app.get('/irc', function(req, res) {
    res.redirect(siteUrl + ":3000");
});
app.get('/about', function(req, res) {
    res.render('about', {
        title: "Linux Users Group @ UTD"
    });
});

http.createServer(appRedirect).listen(appRedirect.get('port'), function() {
    console.log('Express server (http redirect) listening on port ' + appRedirect.get('port'));
});

https.createServer(options, app).listen(app.get('port'), function() {
    console.log('Express server (SSL) listening on port ' + app.get('port'));
});