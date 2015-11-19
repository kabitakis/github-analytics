/** @jsx React.DOM */

'use strict';

var Layout = require('./layout.jsx');
var React = require('react');
var _ = require('lodash');
var BarChart = require("react-chartjs").Bar;

var InfoPanel = React.createClass({

  render: function(){
    return (
      <ul className="infopanel">
        <li>Repository: /{this.props.data.user}/{this.props.data.repo}</li>
        <li>Issue Labels: {this.props.data.labels}</li>
        <li>Issue State: {this.props.data.state}</li>
        <li>Search term: {this.props.data.term}</li>
        <li>Count one instance per user, per topic: {this.props.data.exclusive.toString()}</li>
      </ul>
    );
  }
});

var IssueInfoBox = React.createClass({
  
  renderItem: function(issue){
    return (
      <div className="issue">
        <h3><a href={issue.html_url} target="_blank">#{issue.key} {issue.title}</a> <span className="badge">{issue.voteCount}</span></h3>
        <div className="date">
          <b>Created at: </b> {issue.created_at}
        </div>
        <div className="allUsers">
          <b>Users: </b>
          {issue.votes.map(function(user, i) {
            return (
              <span className="user" key={i}>{user} </span>
            );
          })}
        </div>
      </div>
    );
  },

  render: function(){
    return (
      <div>
        {this.renderItem(this.props.issue)}
      </div>
    );
  }
});

var chartOptions = {
  responsive: true
};

module.exports = React.createClass({

  render: function () {
    return (
      <Layout {...this.props}>
        <div id='index' className="row-fluid">
          <h1>Github Issues Analytics</h1>
        </div>
        <div className="row-fluid">
          <h2>Repo and search params</h2>
          <InfoPanel
            data={this.props.ghParams}/>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 col-md-6">
              <h2>Votes per issue # (Sorted by issue #)</h2>
              <BarChart data={this.props.chartData} options={chartOptions}/>
            </div>
            <div className="col-xs-12 col-md-6">
              <h2>Votes per issue # (Sorted by popularity)</h2>
              <BarChart data={this.props.chartData2} options={chartOptions}/>
            </div>
          </div>
        </div>
        <div className="row-fluid">
          <h2>Upvoting users per issue</h2>
          {Object.keys(this.props.allData).map(function(v, i) {
            var issue = this.props.allData[v];
            issue.key = v;
            return (
              <div key={issue.key}>
                <IssueInfoBox issue={issue}/>
              </div>
            );
          }, this)}
        </div>
      </Layout>
    );
  }

});
