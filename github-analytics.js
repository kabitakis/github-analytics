var express = require('express');
var async = require('async');
var moment = require('moment');
var _ = require('lodash');
var config = require('./config');

var GitHubApi = require("github");
var github = new GitHubApi({
    version: "3.0.0" // required
});

var ghUser = 'devstaff-crete';
var ghRepo = 'DevStaff-Heraklion';
var ghIssueLabels = 'Topics';
var ghIssueState = 'open';

var app = express();

app.use(function (req, res, next) {
  // authentication - authorization
  next();
});

app.get('/', function (req, res) {
  github.issues.repoIssues({
    user: ghUser,
    repo: ghRepo,
    labels: ghIssueLabels,
    state: ghIssueState
  }, function(err, issues){
    if (err) {
      console.log(err);
    } else {
      var allComments = {};
      async.each(issues, function(issue, cb){
        console.log(issue.number);
        github.issues.getComments({
          user: ghUser,
          repo: ghRepo,
          number: issue.number
        }, function(err, comments){
          if (err) {
            console.log(err);
            cb();
          } else {
            var votes = [];
            comments.forEach(function(comment, i){
              if (comment.body.indexOf(':+1:') !== -1) {
                votes.push(comment.user.login);
              }
            });
            allComments[issue.number] = {
              title: issue.title,
              votes: votes,
              voteCount: votes.length
              //comments: comments
            };
            console.log(comments.length);
            cb();
          }
        });
      }, function(err){
        if(err){
          console.log('Failed to process all issues');
        } else {
          console.log('All issues have been processed successfully');
          res.json(allComments);
        }
      });
    }
  });
});

var server = app.listen(config.port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
