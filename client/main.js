import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { Electron } from 'meteor/meson:electron';
import _ from 'lodash';

import './main.html';
import '../node_modules/photon/dist/css/photon.css';

Meteor.startup(() => {
  Meteor.call('ping', (err, success) => {
    if(success) {
      Session.setDefault('prototypeRunning', true);
      Meteor.call('stop');
    } else {
      Session.setDefault('prototypeRunning', false);
    }
  });
});

Template.sidebar.helpers({
  projects() {
    return Projects.find({});
  },
});

Template.sidebar.events({
  'click .mtr-create-project'(event, instance) {
    Meteor.call('createProject', {
      name: `Project ${_.random(100, 999)}`,
      created_at: Date.now(),
    });
  },
});

Template.main.helpers({
  running() {
    return Session.get('prototypeRunning');
  }
});

Template.main.events({
  'click .mtr-view'(event, instance) {
    event.preventDefault();
    Meteor.call('open', Meteor.settings.prototypeUrl);
  },

  'click .mtr-run'(event, instance) {
    Meteor.call('run');
    Session.set('prototypeRunning', true);
  },

  'click .mtr-stop'(event, instance) {
    Meteor.call('stop');
    Session.set('prototypeRunning', false);
  }
});
