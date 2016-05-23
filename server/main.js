import { Meteor } from 'meteor/meteor';
import shell from 'shelljs';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  'ls'() {
    return shell.ls('-A');
  },

  'run'() {
    return shell.cd('~/Code/prototyper/.prototype').exec('npm start', {async:true}, (code, stdout, stderr) => {
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
  }
});
