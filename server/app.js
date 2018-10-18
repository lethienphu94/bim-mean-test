var express = require('express'),
    fs = require('fs'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    path = require('path');

var app = express();

// SetUp Log Error
app.use(require('morgan')('dev', {
    skip: function (req, res) { return res.statusCode < 400 }
}));

//Setup parameter Limit
app.use(bodyParser.json({ limit: '5mb', parameterLimit: 100 }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true, parameterLimit: 100 }));

// Setup Mongodb 
const configMongo =  require('./CONFIG/mongo.json');
mongoose.Promise = Promise;
app.db = mongoose.createConnection('mongodb://'+configMongo.host+':'+configMongo.port+'/' + configMongo.name, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
    console.log('mongo open');
});
require('./MODEL')(app, mongoose);

//setup router
app.use(cors());
app.use('/api/v1', require('./API/v1')); 



global.appRoot = path.resolve(__dirname);

//Config Server
const configServer =  require('./CONFIG/server.json');
var server = require('http').createServer(app);
server.listen(configServer.port, function () {

    console.log("Example app listening at http://%s:%s", configServer.host, configServer.port)
});