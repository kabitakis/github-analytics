/** @jsx React.DOM */

'use strict';

var Layout = require('./layout.jsx');
var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');
var BarChart = require("react-chartjs").Bar;

var InfoPanel = React.createClass({

  render: function(){
    return (
      <ul>
        <li>Repository: <a href={"https://github.com/"+this.props.data.user+"/"+this.props.data.repo} target="_blank">/{this.props.data.user}/{this.props.data.repo}</a></li>
        <li>Issue Labels: {this.props.data.labels}</li>
        <li>Issue State: {this.props.data.state}</li>
        <li>Search term: {this.props.data.term}</li>
        <li>Count one instance per user, per topic: {this.props.data.exclusive ? this.props.data.exclusive.toString() : 'false'}</li>
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

  getInitialState: function () {
    return {
      sort: 'byId'
    };
  },
  
  onSortUpdate: function (event) {
    this.setState({
      sort: event.target.dataset.sort
    });
    this.forceUpdate();
  },

  onChartClick: function (event) {
    var clickedBars = this.refs.issueVotesChart.state.chart.getBarsAtEvent(event);
    var issueNo = clickedBars[0].label.split(':')[0];
    if (window) {
      window.open('https://github.com/'+this.props.ghParams.user+'/'+this.props.ghParams.repo+'/issues/'+issueNo);
    }
  },
  
  render: function () {
    return (
      <Layout {...this.props}>
        <div id="index" className="row-fluid">
          <h1>Github Issues Analytics</h1>
        </div>
        <div className="row-fluid infopanel">
          <h2>Repo and search params</h2>
          <InfoPanel
            data={this.props.ghParams}/>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div id="sortingOptions" className="col-xs-12 col-md-6">
              <span>Sort by: </span>
              <div className="btn-group" role="group">
                <button data-sort="byId" onClick={this.onSortUpdate} type="button" className="btn btn-default" >Issue ID</button>
                <button data-sort="byCount" onClick={this.onSortUpdate} type="button" className="btn btn-default">Vote Count</button>
              </div>
            </div>
            <div className="col-xs-11 col-md-11">
              <h2>Votes per Issue ID</h2>
              <BarChart ref="issueVotesChart" data={this.props.chartData[this.state.sort]} options={chartOptions} onClick={this.onChartClick} redraw />
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
