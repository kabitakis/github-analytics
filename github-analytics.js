'use strict'

require('node-jsx').install(); // make `.jsx` file requirable by node
var express = require('express');
var engine = require('react-engine');
var async = require('async');
var moment = require('moment');
var _ = require('lodash');
var config = require('./config');
var dataFactory = require('./dataFactory');

var GitHubApi = require("github");
var github = new GitHubApi();

var app = express();

var engineOptions = {
  // optional if not using react-router
  // reactRoutes: 'PATH_TO_REACT_ROUTER_ROUTE_DECLARATION' 
};

// set `react-engine` as the view engine
app.engine('.jsx', engine.server.create(engineOptions));

// set the view directory
app.set('views', __dirname + '/public/views');

// set js as the view engine
app.set('view engine', 'jsx');

// finally, set the custom react-engine view for express
app.set('view', engine.expressView);

//expose public folder as static assets
app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
  github.authenticate({
    type: "oauth",
    token: config.github_token
  });
  next();
});

app.use(function (req, res, next) {
  github.misc.getRateLimit({}, function(err, result) {
    console.log('Github API rate limit: ', result);
    next();
  });
});

app.get('/', function (req, res, next) {
  var ghParams = _.isEmpty(req.query) ? config.defaultParams : _.defaults(req.query, config.defaultParams);
  dataFactory.getIssueVotes(github, ghParams, function (err, data) {
    if (err) {
      res.json({error: err});
    } else {
      var chartData = dataFactory.toVoteCountChartData(data);

      res.render('index', {
        allData: data,
        chartData: chartData,
        ghParams: ghParams,
        error: null
      });
    }
  });
});

app.get('/api/issues', function (req, res) {
  var ghParams = _.isEmpty(req.query) ? config.defaultParams : _.defaults(req.query, config.defaultParams);
  dataFactory.getIssueVotes(github, ghParams, function (err, data) {
    if (err) {
      res.json({error: err});
    } else {
      res.json(data);
    }
  });
});

var server = app.listen(process.env.PORT || config.port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Github analytics app listening at http://%s:%s', host, port);
}).on("error", function(err){
    console.log("Error trying to claim port " + config.port);
    console.log(err);
});
