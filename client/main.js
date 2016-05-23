import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Electron } from 'meteor/meson:electron';

import './main.html';

const options = {
    title: "Basic Notification",
    body: "Short message part"
  };

Template.hello.events({
  'click .mtr-list'(event, instance) {
    Meteor.call('ls', (err, success) => {
      console.log(success ? success : 'Error');
    });
  },

  'click .mtr-notfiy'(event, instance) {
    Electron.isDesktop ? new Notification(options.title, options) : false;
  },

  'click .mtr-run'(event, instance) {
    Meteor.call('run');
  },

  'click .mtr-stop'(event, instance) {
    Meteor.call('stop');
  }
});
