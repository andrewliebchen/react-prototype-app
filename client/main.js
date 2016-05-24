import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { Electron } from 'meteor/meson:electron';

import './main.html';

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

Template.main.helpers({
  running() {
    return Session.get('prototypeRunning');
  }
});

Template.main.events({
  'click .mtr-view'(event, instance) {
    event.preventDefault();
    Meteor.call('open', 'http://localhost:8000');
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
