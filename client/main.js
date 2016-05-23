import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { Electron } from 'meteor/meson:electron';

import './main.html';

Session.setDefault('prototypeRunning', false);

const options = {
  title: "Basic Notification",
  body: "Short message part"
};

Meteor.startup(() => {
  Meteor.call('stop');
});

Template.hello.helpers({
  running() {
    return Session.get('prototypeRunning');
  }
});

Template.hello.events({
  'click .mtr-list'(event, instance) {
    Meteor.call('ls', (err, success) => {
      console.log(success ? success : 'Error');
    });
  },

  'click .mtr-ping'(event, instance) {
    // Electron.isDesktop ? new Notification(options.title, options) : false;
    Meteor.call('ping', (err, success) => {
      console.log(success);
    });
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
