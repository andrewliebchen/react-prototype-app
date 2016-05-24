import { Meteor } from 'meteor/meteor';
import shell from 'shelljs';
import opn from 'opn';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  'createProject'(args) {
    return Projects.insert({
      name: args.name,
      created_at: args.created_at,
    });
  },

  'open'(address) {
    opn(address);
  },

  'ping'() {
    return shell.exec('lsof -t -i :8000').code === 0 ? true : false;
  },

  'run'() {
    shell.cd('~/Code/prototyper/.prototype').exec('npm start', {async:true}, (code, stdout, stderr) => {
      console.log('Exit code:', code);
      console.log('Program output:', stdout);
      console.log('Program stderr:', stderr);
    });
  },

  'stop'() {
    shell.exec('kill -9 $(lsof -t -i :8000)', {async:true}, (code, stdout, stderr) => {
      console.log('Exit code:', code);
      console.log('Program output:', stdout);
      console.log('Program stderr:', stderr);
    });
  },
});
