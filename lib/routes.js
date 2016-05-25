import { Meteor } from 'meteor/meteor';

FlowRouter.route('/', {
  subscriptions() {
    this.register('projects', Meteor.subscribe('projects'));
  },

  action() {
    BlazeLayout.render('layout', {content: 'home'});
  },
});

FlowRouter.route('/projects/:id', {
  subscriptions(id) {
    this.register('projects', Meteor.subscribe('projects'));
  },

  action(id) {
    FlowRouter.subsReady('projects', () => {
      BlazeLayout.render('layout', {content: 'projectContent'});
    });
  },
});

FlowRouter.route('/projects/:id/edit', {
  subscriptions(id) {
    this.register('projects', Meteor.subscribe('projects'));
  },

  action(id) {
    FlowRouter.subsReady('projects', () => {
      BlazeLayout.render('layout', {content: 'projectEdit'});
    });
  },
});

FlowRouter.route('/new-project', {
  subscriptions() {
    this.register('projects', Meteor.subscribe('projects'));
  },

  action() {
    BlazeLayout.render('layout', {content: 'newProject'});
  },
});
