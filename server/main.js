import { Meteor } from 'meteor/meteor';
import shell from 'shelljs';
import opn from 'opn';
import slug from 'slug';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  'createProject'(args) {
    const projectSlug = slug(args.name);
    // FIXME: How to get path to local files?
    const sourcePath = '~/Code/prototyper/.prototype_src';
    const projectPath = `~/.prototype/${projectSlug}`;

    // Set up project locally
    // `npm install` takes forever, just copy contents into new prototype
    shell.mkdir('-p', projectPath);
    shell.cp('-r', `${sourcePath}/*`, projectPath);

    // Store project in DB
    return Projects.insert({
      name: args.name,
      slug: projectSlug,
      created_at: args.created_at,
    });
  },

  'open'(address) {
    opn(address);
  },

  'ping'() {
    return shell.exec('lsof -t -i :8000').code === 0 ? true : false;
  },

  'run'(activeProject) {
    const activePath = `~/.prototype/${slug(Projects.findOne(activeProject).name)}`;
    shell.cd(activePath).exec('npm start', {async:true}, (code, stdout, stderr) => {
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
