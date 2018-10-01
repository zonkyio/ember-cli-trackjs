'use strict';

var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var path = require('path');
var fbTransform = require('fastboot-transform');

module.exports = {
  name: require('./package').name,

  contentFor(type, config) {
    let trackOpts;
    let trackConfig;
    let trackConfiguration;

    if (type === 'head-footer') {
      trackOpts = config.trackJs || {};
      trackConfig = trackOpts.config || {};

      trackConfiguration = `<script type="text/javascript" id="trackjs-configuration">window._trackJs = ${JSON.stringify(trackConfig)};</script>`;

      return trackConfiguration;
    }
  },

  treeForVendor(defaultTree) {
    var trees = [];

		if (defaultTree) {
			trees.push(defaultTree);
    }
    
    let trackJsPath = path.join(this.project.root, 'node_modules', 'trackjs');

    let browserVendorLib = fbTransform(new Funnel(trackJsPath, {
      files: ['tracker.js'],
      destDir: 'trackjs',
    }));
  
    trees.push(browserVendorLib);
    
    return mergeTrees(trees);
  },

  included(app) {
    this._super.included.apply(this, arguments);

    // allow addon to be nested - see: https://github.com/ember-cli/ember-cli/issues/3718
    while (app.app) {
      app = app.app;
    }

    app.import(this.treePaths.vendor + '/trackjs/tracker.js');
  }
};
