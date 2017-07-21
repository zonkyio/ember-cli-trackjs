import Ember from 'ember';
import ErrorHandler from '../utils/error-handler';

export function initialize(app) {
  if (typeof FastBoot === 'undefined') {
    // Guard against Ember.onerror hiding test failures
    // http://raytiley.com/posts/ember-onerror-troll
    if ( Ember.testing ) { return; }

    const instance = app.lookup ? app : app.container;

    const trackJs = instance.lookup('service:trackjs');
    const appVersion = instance.lookup('application:main').get('version');

    trackJs.configure({
      version: appVersion
    });

    const handler = new ErrorHandler(trackJs);

    Ember.onerror = handler.report.bind(handler);
  }
}

export default {
  name: 'configure-trackjs',
  initialize: initialize
};
