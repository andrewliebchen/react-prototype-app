import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { Electron } from 'meteor/meson:electron';
import _ from 'lodash';

import './main.html';
import '../node_modules/photon/dist/css/photon.css';

Session.setDefault('projectFiles', null);

Meteor.startup(() => {
  // Session.setDefault('activeProject', Projects.findOne()._id);

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

Template.projectNavItem.helpers({
  active() {
    return Session.equals('activeProject', this.project._id);
  },
});

Template.projectNavItem.events({
  'click .mtr-nav-item'(event, instance) {
    Session.set('activeProject', this.project._id);
  },
});

Template.main.helpers({
  project() {
    return Projects.findOne(Session.get('activeProject'));
  },
});

Template.projectContent.helpers({
  running() {
    return Session.get('prototypeRunning');
  },
});

Template.projectContent.events({
  'click .mtr-open-project'(event, instance) {
    event.preventDefault();
    Meteor.call('openProjectFiles', Session.get('activeProject'));
  },

  'click .mtr-view'(event, instance) {
    event.preventDefault();
    Meteor.call('openPrototype');
  },

  'click .mtr-run'(event, instance) {
    Meteor.call('run', Session.get('activeProject'));
    Session.set('prototypeRunning', true);
  },

  'click .mtr-stop'(event, instance) {
    Meteor.call('stop');
    Session.set('prototypeRunning', false);
  }
});

Template.fileTable.helpers({
  files() {
    Meteor.call('getFiles', this.project._id, (err, files) => {
      if(files) {
        Session.set('projectFiles', files)
      }
    });
    return Session.get('projectFiles');
  },
});

Template.fileRow.events({
  'click .mtr-open-file'(event, instance) {
    Meteor.call('openFile', this.filePath);
  },
});
