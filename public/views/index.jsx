/** @jsx React.DOM */

'use strict';

var Layout = require('./layout.jsx');
var React = require('react');
var _ = require('lodash');
var BarChart = require('react-d3-components').BarChart;

var PlainMessage = React.createClass({

  onOK: function() {
    this.props.onOK();
  },

  render: function(){
    return (
      <div>
        <h3>{this.props.msg}</h3>
      </div>
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
        <div>
          <BarChart
            data={this.props.chartData}
            width={400}
            height={400}
            margin={{top: 10, bottom: 50, left: 50, right: 10}}/>
        </div>
      </Layout>
    );
  }
  
});
