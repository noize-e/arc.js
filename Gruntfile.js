const bundler = {
  concat: {
    core: {
      src: ['src/core/core.js', 'src/core/ext/helpers.js', 'src/core/ext/importer.js', 'src/core/model.js', 'src/core/storage.js', 'src/core/xhr/client.min.js'],
      dest: 'pre/<%= bundle %>.js',
    },
  },
  uglify: {
    options: {
      compress: {
        drop_console: true,
      },
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= today %> */',
    },
    core: {
      files: {
        'dist/<%= bundle %>.min.js': 'pre/<%= bundle %>.js',
      },
    },
  },
};

const linter = {
  js: {
    afterconcat: ['pre/<%= bundle %>.js'],
  },
};

const obfuscator = {
  javascript: {
    options: {
      debugProtection: true,
      debugProtectionInterval: true,
    },
    main: {
      files: {
        'dist/<%= bundle %>.min.obf.js': ['dist/<%= bundle %>.min.js']
      },
    },
  },
};

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    today: '<%= grunt.template.today("yyyy-mm-dd") %>',
    bundle: '<%= pkg.version %>/<%= today %>/<%= pkg.name %>.core.<%= pkg.version %>',
    jshint: linter.js,
    concat: bundler.concat,
    uglify: bundler.uglify,
    javascript_obfuscator: obfuscator.javascript,
  });

  // grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-uglify-es');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-javascript-obfuscator');

  grunt.registerTask('lint', ['jshint:afterconcat']);
  grunt.registerTask('default', ['concat', 'uglify', 'javascript_obfuscator']);
};
