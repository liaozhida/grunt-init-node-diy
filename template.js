// Basic template description.
exports.description = 'Create a umi node module.';

// Template-specific notes to be displayed before question prompts.
exports.notes = '项目名不能包含node或者js，且项目名在代码仓库中是唯一的';

// Template-specific notes to be displayed after question prompts.
exports.after = '安装完毕，请使用 npm install 安装项目依赖，使用 grunt help 可以查看grunt支持的任务。';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = 'Gruntfile.js';

// The actual init template.
exports.template = function(grunt, init, done) {

  init.process({
    type: 'node'
  }, [
    // Prompt for these values.
    init.prompt('name'),
    init.prompt('description'),
    init.prompt('version', '1.0.0'),
    init.prompt('author_name'),
    init.prompt('author_email'),
    init.prompt('node_version', '>= 0.12.0'),
    init.prompt('main'),
    init.prompt('npm_test', 'grunt nodeunit'), {
      name: 'gitlab_ci',
      message: 'Will this project be tested with Gitlab CI?',
      default: 'Y/n',
      warning: 'If selected, you must enable Gitlab CI support for this project.'
    },
  ], function(err, props) {
    props.keywords = [];
    props.homepage = 'http://gitlab.umiit.cn/' + props.name;
    props.repository = props.homepage + '.git';
    props.bugs = props.homepage + '/issues';
    props.devDependencies = {
      'grunt-contrib-jshint': '~0.6.4',
      'grunt-contrib-nodeunit': '~0.2.0',
      'grunt-contrib-watch': '~0.5.3',
    };

    props.gitlab_ci = /y/i.test(props.gitlab_ci);

    // Files to copy (and process).
    var files = init.filesToCopy(props);
    if (!props.gitlab_ci) {
      delete files['.gitlab-ci.yml'];
    }

    // Add properly-named license files.
    // init.addLicenseFiles(files, props.licenses);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props);

    // Generate package.json file.
    init.writePackageJSON('package.json', props, function(pkg, props) {
      pkg['publishConfig'] = {
        "registry": "http://m2.umiit.cn/content/repositories/npm-umi/"
      };
      pkg['license'] = "MIT";
      return pkg;
    });

    // All done!
    done();
  });

};