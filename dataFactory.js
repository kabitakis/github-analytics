'use strict'

var Promise = require('bluebird');
var objectAssign = require('object-assign');
var async = require('async');
var moment = require('moment');
var _ = require('lodash');
var config = require('./config');




function getIssueVotes (github, tentacles, params, callback) {
  console.log('params', params);

  var getRepoIssues = Promise.promisify(github.issues.repoIssues);
  var getComments = Promise.promisify(github.issues.getComments);

  var stream = tentacles.issue.listForRepo(params.user + '/' + params.repo, {});

  var processingDataPromiseList = [];

  var allComments = {};

  stream.on('data', function(issue) {
    //console.log(issue);

    var processingCommentsPromise = getComments({
        user: params.user,
        repo: params.repo,
        number: issue.number,
        per_page: params.per_page
      })
      .then(function(comments) {
        var votes = [];
        comments.forEach(function(comment, i) {
          // Lookup for term in comments and don't count multiple terms
          // from the same login, if exclusive is set.
          if (
            comment.body.indexOf(params.term) !== -1 &&
            (!params.exclusive || votes.indexOf(comment.user.login) < 0)
          ) {
            votes.push(comment.user.login);
          }
        });

        /* */
        // Filter out issues that don't have any votes
        if(votes.length > 0) {
          allComments[issue.number] = {
            title: issue.title,
            html_url: issue.html_url,
            created_at: issue.created_at,
            votes: votes,
            voteCount: votes.length
            //comments: comments
          };
        }
        /* */
      });

    processingDataPromiseList.push(processingCommentsPromise);

  });

  stream.on('end', function() {
    console.log('end');

    Promise.all(processingDataPromiseList)
      .then(function() {
        console.log('done processing all data');
        callback(null, allComments);
      })
  });

  stream.on('error', function(err) {
    callback(err, null);
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
