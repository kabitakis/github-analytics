'use strict'

var async = require('async');
var moment = require('moment');
var _ = require('lodash');
var config = require('./config');

function getIssueVotes (github, params, callback) {
  github.issues.repoIssues(params, function(err, issues){
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      var allComments = {};
      async.each(issues, function(issue, cb){
        console.log(issue.number);
        github.issues.getComments({
          user: params.user,
          repo: params.repo,
          number: issue.number,
          per_page: params.per_page
        }, function(err, comments){
          if (err) {
            console.log(err);
            cb();
          } else {
            var votes = [];
            comments.forEach(function(comment, i){
              // Lookup for the terms in comments and don't count
              // multiple terms from the same login, if exclusive is
              // set.
              params.terms.forEach(function(term, i){
                if (comment.body.indexOf(term) !== -1 &&
                    (!params.exclusive || votes.indexOf(comment.user.login) < 0) ) {
                  votes.push(comment.user.login);
                }
              });
            });
            allComments[issue.number] = {
              title: issue.title,
              html_url: issue.html_url,
              created_at: issue.created_at,
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
          callback(err, null);
        } else {
          console.log('All issues have been processed successfully');
          callback(null, allComments);
        }
      });
    }
  });
}

function toVoteCountChartData (data) {
  var initData = {
    labels: [],
    datasets: [
      {
        label: "Votes",
        fillColor: "rgba(42,144,159,0.7)",
        strokeColor: "rgba(42,144,159,0.9)",
        highlightFill: "rgba(42,144,159,0.9)",
        highlightStroke: "rgba(42,144,159,1)",
        data: []
      }
    ]
  };

  var chartData = {
    byId: _.cloneDeep(initData),
    byCount: _.cloneDeep(initData),
    byDate: _.cloneDeep(initData)
  };

  _.forEach(data, function(v, k) {
    chartData.byId.labels.push(k + ': ' + v.title.substring(0, 12));
    chartData.byId.datasets[0].data.push(v.voteCount);
  });

  // Sort by popularity
  var zipped = [], i;

  // pack the two arrays in one
  for(i=0; i<chartData.byId.labels.length; ++i) {
    zipped.push({
        label: chartData.byId.labels[i],
        value: chartData.byId.datasets[0].data[i]
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
      chartData.byCount.labels.push(zipped[i].label);
      chartData.byCount.datasets[0].data.push(zipped[i].value);
  }

  return chartData;
}

module.exports = {
  getIssueVotes: getIssueVotes,
  toVoteCountChartData: toVoteCountChartData
};