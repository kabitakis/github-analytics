/** @jsx React.DOM */

'use strict';

var Layout = require('./layout.jsx');
var React = require('react');
var _ = require('lodash');
var BarChart = require('react-d3-components').BarChart;

var InfoPanel = React.createClass({

  render: function(){
    return (
      <ul className="infopanel">
        <li>Repository: /{this.props.data.ghUser}/{this.props.data.ghRepo}</li>
        <li>Labels: {this.props.data.ghIssueLabels}</li>
        <li>State: {this.props.data.ghIssueState}</li>
      </ul>
    );
  }
});

module.exports = React.createClass({

  render: function () {
    return (
      <Layout {...this.props}>
        <div id='index' className="row-fluid">
          <h1>Github Issues Analytics</h1>
        </div>
        <div className="row-fluid">
          <InfoPanel
            data={this.props.ghParams}/>
        </div>
        <div className="row-fluid">
          <BarChart
            data={this.props.chartData}
            width={400}
            height={400}
            xAxis={{label: "Topic #"}}
            yAxis={{label: 'Votes'}}
            margin={{top: 20, bottom: 50, left: 50, right: 20}}/>
        </div>
      </Layout>
    );
  }

});
