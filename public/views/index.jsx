/** @jsx React.DOM */

'use strict';

var Layout = require('./layout.jsx');
var React = require('react');
var _ = require('lodash');

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

  getInitialState: function() {
    var initialData = {
    };
    
    return initialData;
  },

  render: function () {
    return (
      <Layout {...this.props}>
        <div id='index' className="row-fluid">
          <h1>Github Issues Analytics</h1>
        </div>
      </Layout>
    );
  }
});
