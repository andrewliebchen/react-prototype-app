import { Meteor } from 'meteor/meteor';
import shell from 'shelljs';
import opn from 'opn';
import slug from 'slug';

const projectPathPrefix = `~/Sites/${Meteor.settings.appName}/`;

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  createProject(args) {
    const projectSlug = slug(args.name);
    // FIXME: How to get path to local files?
    const sourcePath = '~/Code/prototyper/.prototype_src';
    const projectPath = `${projectPathPrefix}/${projectSlug}`;

    // Set up project locally
    // `npm install` takes forever, just copy contents into new prototype
    shell.mkdir('-p', projectPath);
    shell.exec(`cp -R ${sourcePath}/. ${projectPath}`, {async: true}, (code, stdout, stderr) => {
      console.log('copied');
      shell.cd(projectPath);
      shell.exec(`npm install`, {async: true}, (code, stdout, stderr) => {
        console.log('Exit code:', code);
        console.log('Program output:', stdout);
        console.log('Program stderr:', stderr);
      });
    });

    // Store project in DB
    return Projects.insert({
      name: args.name,
      slug: projectSlug,
      created_at: args.created_at,
    });
  },

  openProjectFiles(projectId) {
    const projectSlug = Projects.findOne(projectId).slug;
    opn(`${projectPathPrefix}/${projectSlug}`);
  },

  openPrototype() {
    opn(`http://localhost:${Meteor.settings.prototypePort}`);
  },

  ping() {
    return shell.exec(`lsof -t -i :${Meteor.settings.prototypePort}`).code === 0 ? true : false;
  },

  run(activeProject) {
    const activePath = `${projectPathPrefix}/${Projects.findOne(activeProject).slug}`;
    shell.cd(activePath).exec('npm start', {async: true}, (code, stdout, stderr) => {
      console.log('Exit code:', code);
      console.log('Program output:', stdout);
      console.log('Program stderr:', stderr);
    });
  },

  stop() {
    shell.exec('kill -9 $(lsof -t -i :8000)', {async: true}, (code, stdout, stderr) => {
      console.log('Exit code:', code);
      console.log('Program output:', stdout);
      console.log('Program stderr:', stderr);
    });
  },

  getFiles(activeProject) {
    return shell.ls(`${projectPathPrefix}/${Projects.findOne(activeProject).slug}/src/*`);
  },

  openFile(filePath) {
    opn(filePath, {app: 'textEdit'});
  },
});
