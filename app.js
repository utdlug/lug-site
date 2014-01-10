/* extremely bare for now. will add routing, mongo, and api stuff soon. */

var express = require('express')
  , http = require('http') , path = require('path');

var app = express();
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
app.set('port', process.env.PORT || 3000);  // dev
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Routing
app.get('/', function(req, res) {
    res.render('index', {title: "Linux Users Group @ UTD"});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});