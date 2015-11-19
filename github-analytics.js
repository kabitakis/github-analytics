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
var github = new GitHubApi({
    version: "3.0.0" // required
});

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
  github.misc.rateLimit({}, function(err, result) {
    console.log('Github API rate limit: ', result);
    next();
  });
});

app.get('/', function (req, res, next) {
  var ghParams = _.isEmpty(req.query) ? config.defaultParams : req.query;
  dataFactory.getIssueVotes(github, ghParams, function (err, data) {
    if (err) {
      res.json({error: err});
      // res.render('error', {
      //   allComments: {},
      //   error: err
      // });
    } else {
      var chartData = {
        labels: [],
        datasets: [
          {
            label: "Votes",
            fillColor: "rgba(42,144,159,0.7)",
            strokeColor: "rgba(42,144,159,0.9)",
            highlightFill: "rgba(42,144,159,0.9)",
            highlightStroke: "rgba(42,144,159,1)",
            //highlightStroke: "rgba(224,121,0,1)",
            data: []
          }
        ]
      },
      chartData2 = {
        labels: [],
        datasets: [
          {
            label: "Votes",
            fillColor: "rgba(42,144,159,0.7)",
            strokeColor: "rgba(42,144,159,0.9)",
            highlightFill: "rgba(42,144,159,0.9)",
            highlightStroke: "rgba(42,144,159,1)",
            //highlightStroke: "rgba(224,121,0,1)",
            data: []
          }
        ]
      };

      _.forEach(data, function(v, k) { // @todo move this to the dataFactory
        chartData.labels.push(k + ': ' + v.title.substring(0, 12));
        chartData.datasets[0].data.push(v.voteCount);
      });

      // Sort by popularity
      var zipped = [], i;

      // pack the two arrays in one
      for(i=0; i<chartData.labels.length; ++i) {
        zipped.push({
            label: chartData.labels[i],
            value: chartData.datasets[0].data[i]
        });
      }

      // Sort the packed array in descending order
      zipped.sort(function(left, right) {
          var leftValue  = left.value,
              rightValue = right.value;

          return leftValue === rightValue ? 0 : (leftValue < rightValue ? 1 : -1);
      });

      // Unpack array
      for(i=0; i<zipped.length; ++i) {
          chartData2.labels.push(zipped[i].label);
          chartData2.datasets[0].data.push(zipped[i].value);
      }

      res.render('index', {
        allData: data,
        chartData: chartData,
        chartData2: chartData2,
        ghParams: ghParams,
        error: null
      });
    }
  });
});

app.get('/api/issues', function (req, res) {
  var ghParams = _.isEmpty(req.query) ? config.defaultParams : req.query;
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
