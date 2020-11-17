const bundler = {
    concat: {
        main: {

            src: ['src/core/boot.js',
                'src/core/util.js',
                'src/core/storage.js',
                'src/core/session.js',
                'src/core/importer.js',
                'src/core/models/model-view.js',
                'src/core/models/form-model-view.js',
                'src/core/auth/cognito.js',
                'src/core/xhr/xclient.js',
                'src/core/me.js'
            ],
            dest: 'pre/<%= bundle %>.js'
        },

        vendor: {
            src: ['lib/jquery.min.js',
                  'lib/bootstrap.bundle.min.js',
                  'lib/popper.min.js',
                  'lib/knockout.min.js',
                  'lib/aws/cognito-sdk.min.js',
                  'lib/aws/cognito-identity.min.js'],
            dest: 'pre/<%= bundle %>.vendor.js'
        }

    },

    uglify: {
        options: {
            compress: {
                drop_console: false
            },
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= today %> */'
        },
        main: {
            files: {
                'dist/<%= bundle %>.min.js': 'pre/<%= bundle %>.js'
            }
        },
        vendor: {
            files: {
                'dist/<%= bundle %>.vendor.min.js': 'pre/<%= bundle %>.vendor.js'
            }
        }
    }

};

const linter = {
    js: {
        afterconcat: ['pre/<%= bundle %>.js']
    }
};

const obfuscator = {
    javascript: {
        // options: {
        //   debugProtection: true,
        //   debugProtectionInterval: true,
        // },
        main: {
            files: {
                'dist/<%= bundle %>.min.js': ['dist/<%= bundle %>.min.js']
            }
        },
        ext: {
            files: {
                'dist/<%= bundle %>.ext.min.js': ['dist/<%= bundle %>.ext.min.js']
            }
        }
    }
};


const lastest = {
    copy: {
        main: {
            src: 'dist/<%= bundle %>.min.js',
            dest: 'dist/lastest/<%= pkg.name %>.min.js'
        },
        vendor: {
            src: 'dist/<%= bundle %>.vendor.min.js',
            dest: 'dist/lastest/<%= pkg.name %>.vendor.min.js'
        }
    }
};

module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        today: '<%= grunt.template.today("yyyy-mm-dd") %>',
        bundle: '<%= pkg.version %>/<%= today %>/<%= pkg.name %>-<%= pkg.version %>',
        jshint: linter.js,
        concat: bundler.concat,
        uglify: bundler.uglify,
        javascript_obfuscator: obfuscator.javascript,
        copy: lastest.copy
    });

    // grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-javascript-obfuscator');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('lint', ['jshint:afterconcat']);
    grunt.registerTask('prod', ['concat:main', 'uglify:main', 'javascript_obfuscator', 'copy:main']);
    grunt.registerTask('vendor', ['concat:vendor', 'uglify:vendor', 'copy:vendor']);
    grunt.registerTask('default', ['concat:main', 'uglify:main', 'copy:main']);
};