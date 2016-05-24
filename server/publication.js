import { Meteor } from 'meteor/meteor';

Meteor.publish('projects', () => {
  return Projects.find();
});
