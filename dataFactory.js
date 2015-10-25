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
          number: issue.number
        }, function(err, comments){
          if (err) {
            console.log(err);
            cb();
          } else {
            var votes = [];
            comments.forEach(function(comment, i){
              // Lookup for term in comments and don't count multiple terms
              // from the same login, if exclusive is set.
              if (comment.body.indexOf(params.term) !== -1 &&
                  (!params.exclusive || votes.indexOf(comment.user.login) < 0) ) {
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
          callback(err, null);
        } else {
          console.log('All issues have been processed successfully');
          callback(null, allComments);
        }
      });
    }
  });
}

module.exports = {
  getIssueVotes: getIssueVotes
};