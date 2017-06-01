'use strict'

var async = require('async');
var moment = require('moment');
var _ = require('lodash');
var config = require('./config');

function getIssueVotes (github, params, callback) {
  github.issues.getForRepo({
          owner: params.owner,
          repo: params.repo,
          state: params.state,
          labels: params.labels,
          per_page: params.per_page
  }, function(err, issues){
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      var allComments = {};
      async.each(issues.data, function(issue, cb){
        console.log(issue.number);
        github.issues.getComments({
          owner: params.owner,
          repo: params.repo,
          number: issue.number,
          per_page: params.per_page
        }, function(err, comments){
          if (err) {
            console.log(err);
            cb();
          } else {
            var votes = [];
            var speakers = [];
            github.reactions.getForIssue({
              owner: params.owner,
              repo: params.repo,
              number: issue.number
            }, function(err, reactions){
              if (err) {
                console.log(err);
              } else {
                params.reactionVotes.forEach(function(term, i){
                  reactions.data.forEach(function(reaction, j){
                    if (reaction.content === term &&
                      !params.exclusive || votes.indexOf(reaction.user.login) < 0 ) {
                      votes.push(reaction.user.login);
                    }
                    allComments[issue.number].voteCount = votes.length;
                  });
                });
              }
            });

            comments.data.forEach(function(comment, i){
              // Lookup for the terms in comments and don't count
              // multiple terms from the same login, if exclusive is
              // set.
              params.terms.forEach(function(term, i){
                if (comment.body.indexOf(term) !== -1 &&
                    (!params.exclusive || votes.indexOf(comment.user.login) < 0) ) {
                  votes.push(comment.user.login);
                }
              });
              params.speakerTerms.forEach(function(term, i){
                if (comment.body.indexOf(term) !== -1 &&
                    (!params.exclusive || speakers.indexOf(comment.user.login) < 0) ) {
                  speakers.push(comment.user.login);
                }
              });
            });
            params.speakerTerms.forEach(function(term, i){
              if (issue.body.indexOf(term) !== -1 &&
                  (!params.exclusive || speakers.indexOf(issue.user.login) < 0) ) {
                speakers.push(issue.user.login);
              }
            });
            allComments[issue.number] = {
              title: issue.title,
              html_url: issue.html_url,
              created_at: issue.created_at,
              votes: votes,
              speakers: speakers,
              voteCount: votes.length,
              speakerCount: speakers.length
              //comments: comments
            };
            console.log(comments.data.length);
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
      },
      {
        label: "Speakers",
        fillColor: "rgba(151,107,177,0.7)",
        strokeColor: "rgba(151,107,177,0.9)",
        highlightFill: "rgba(151,107,177,0.9)",
        highlightStroke: "rgba(151,107,177,1)",
        data: []
      }
    ]
  };

  var chartData = {
    byId: _.cloneDeep(initData),
    byCount: _.cloneDeep(initData),
    bySpeaker: _.cloneDeep(initData),
    byDate: _.cloneDeep(initData)
  };

  _.forEach(data, function(v, k) {
    chartData.byId.labels.push(k + ': ' + v.title.substring(0, 20));
    chartData.byId.datasets[0].data.push(v.voteCount);
    chartData.byId.datasets[1].data.push(v.speakerCount);
  });

  // Sort by popularity
  var zipped = [], i;
  var speakzipped = [];

  // pack the two arrays in one
  for(i=0; i<chartData.byId.labels.length; ++i) {
    zipped.push({
        label: chartData.byId.labels[i],
        value: chartData.byId.datasets[0].data[i],
        speakers: chartData.byId.datasets[1].data[i]
    });
  }
  speakzipped = _.cloneDeep(zipped);

  // Sort the packed array in descending order according to vote
  zipped.sort(function(left, right) {
      var leftValue  = left.value,
          rightValue = right.value;

      return leftValue === rightValue ? 0 : (leftValue < rightValue ? 1 : -1);
  });

  // Sort the packed array in descending order according to speaker
  speakzipped.sort(function(left, right) {
      var leftValue  = left.speakers,
          rightValue = right.speakers;

      return leftValue === rightValue ? 0 : (leftValue < rightValue ? 1 : -1);
  });

  // Unpack array
  for(i=0; i<zipped.length; ++i) {
      chartData.byCount.labels.push(zipped[i].label);
      chartData.byCount.datasets[0].data.push(zipped[i].value);
      chartData.byCount.datasets[1].data.push(zipped[i].speakers);
      chartData.bySpeaker.labels.push(speakzipped[i].label);
      chartData.bySpeaker.datasets[0].data.push(speakzipped[i].value);
      chartData.bySpeaker.datasets[1].data.push(speakzipped[i].speakers);
  }

  return chartData;
}

module.exports = {
  getIssueVotes: getIssueVotes,
  toVoteCountChartData: toVoteCountChartData,
};