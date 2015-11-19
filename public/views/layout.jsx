/** @jsx React.DOM */

'use strict';

var React = require('react');

module.exports = React.createClass({

  render: function render() {

    return (
      <html>
        <head>
          <meta charSet='utf-8' />
          <link rel="stylesheet" type="text/css" href="/bower_components/bootstrap/dist/css/bootstrap.min.css" />
          <link rel="stylesheet" type="text/css" href="/css/main.css" />  
          <title>
            {this.props.title}
          </title>
        </head>
        <body>
          <div id="bodywrapper" className="container-fluid">
            {this.props.children}
            <div id="footer" className="col-md-12">
              <p><a href="http://devstaff.gr" target="_blank">The DevStaff Team</a></p>
            </div>
          </div>
        </body>
        <script type="text/javascript" src="/bower_components/jquery/dist/jquery.min.js"></script>
        <script type="text/javascript" src="/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="/js/bundle.js"></script>
      </html>
    );
  }
});
