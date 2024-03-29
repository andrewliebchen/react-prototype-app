import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { Electron } from 'meteor/meson:electron';
import _ from 'lodash';

import './main.html';

Session.setDefault('projectFiles', null);

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
  'click .mtr-new-project'(event, instance) {
    FlowRouter.go('/new-project');
  },
});

Template.projectNavItem.helpers({
  active() {
    return this.project._id === FlowRouter.getParam('id') ? true : false;
  },
});

Template.projectContent.helpers({
  project() {
    return Projects.findOne(FlowRouter.getParam('id'));
  },

  running() {
    return Session.get('prototypeRunning');
  },
});

Template.projectContent.events({
  'click .mtr-open-project'(event, instance) {
    event.preventDefault();
    Meteor.call('openProjectFiles', FlowRouter.getParam('id'));
  },

  'click .mtr-view'(event, instance) {
    event.preventDefault();
    Meteor.call('openPrototype');
  },

  'click .mtr-run'(event, instance) {
    Meteor.call('run', FlowRouter.getParam('id'));
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

Template.newProject.events({
  'click .mtr-create-project'(event, instance) {
    event.preventDefault();
    const projectName = instance.find('.mtr-project-name');
    if(projectName.value) {
      Meteor.call('createProject', {
        name: projectName.value,
        created_at: Date.now(),
      }, (err, projectId) => {
        FlowRouter.go(`/projects/${projectId}`);
      });
    }
  },
});

Template.projectEdit.helpers({
  project() {
    return Projects.findOne(FlowRouter.getParam('id'));
  }
});

Template.projectEdit.events({
  'click .mtr-save-project'(event, instance) {
    event.preventDefault();
    const projectName = instance.find('.mtr-project-name');
    if(projectName.value) {
      Meteor.call('updateProject', {
        id: FlowRouter.getParam('id'),
        name: projectName.value,
        modified_at: Date.now(),
      }, (err, projectId) => {
        console.log('Updated!');
      });
    }
  },

  'click .mtr-delete-project'(event, instance) {
    event.preventDefault();
    if(window.confirm('You sure you want to delete this project?')) {
      Meteor.call('deleteProject', FlowRouter.getParam('id'), (err, success) => {
        FlowRouter.go('/');
      });
    }
  }
});
