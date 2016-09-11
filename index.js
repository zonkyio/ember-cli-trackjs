/* jshint node: true */
'use strict';

var replace = require('broccoli-string-replace');
var filterInitializers = require('fastboot-filter-initializers');

module.exports = {
  name: 'ember-cli-trackjs',

  contentFor: function (type, config) {
    var trackOpts = config.trackJs || {};
    var trackConfig = trackOpts.config || {};

    if (type === 'head-footer') {
      var trackConfiguration = '';

      if (!trackOpts.url) {
        trackConfiguration = '<script>window._trackJs = ' + JSON.stringify(trackConfig) + ';</script>';
      }

      return trackConfiguration;
    }
  },

  // TODO app.options.trackJs is not defined
  // included: function (app) {
  //   this._super.included(app);
  //
  //   if (!process.env.EMBER_CLI_FASTBOOT) {
  //     if (!app.options.trackJs.cdn) {
  //       app.import(app.bowerDirectory + '/trackjs/tracker.js');
  //     }
  //   }
  // },

  preconcatTree: function(tree) {
    return filterInitializers(tree, this.app.name);
  },

  postprocessTree(type, tree) {
    if (!this.app.options.trackJs) {
      return tree;
    }

    if (type === 'all') {
      let config = this.app.options.trackJs.config;
      let files = ['assets/trackjs-config.js'];

      let pattern = {
        match: /{{config}}/g,
        replacement: JSON.stringify(config)
      };

      tree = replace(tree, { files, pattern });
    }

    return tree;
  }
};
