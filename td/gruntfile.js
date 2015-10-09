/// <binding AfterBuild='bower, uglify, cssmin, wiredep' />
module.exports = function (grunt) {
    
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-installer');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    
    grunt.initConfig({
        bower: {
            install: {
                options: {
                    targetDir: './public/libs',
                    layout: 'byComponent',
                    install: true,
                    verbose: false,
                    overrideBowerDirectory: false,
                    cleanTargetDir: false,
                    cleanBowerDir: false,
                    bowerOptions: {}
                }
            }
        },
        uglify: {
            minifyjs: {
                files: [{
                        expand: true,
                        cwd: 'public/libs',
                        src: '**/*.js',
                        dest: 'public/libs',
                        ext: '.min.js',
                        extDot: 'first'
                    }]
            },
            options: {
                sourceMap: true
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            minifycss: {
                files: [{
                        expand: true,
                        cwd: 'public/libs',
                        src: '**/*.css',
                        dest: 'public/libs',
                        ext: '.min.css',
                        extDot: 'first'
                    }]
            }
        },
        wiredep: {
            task: {
                src: ['public/index.html'],
                options: {
                    devDependencies: false,
                    fileTypes: {
                        html: {
                            replace: {
                                js: function (filePath) {
                                    var prefixLength = '../bower-packages'.length;
                                    var trimmedPath = filePath.slice(prefixLength);
                                    var packageName = trimmedPath.slice(1).split('/')[0];
                                    var fileName = trimmedPath.slice(trimmedPath.lastIndexOf('/'));
                                    var minFileName = fileName.split('.')[0] + '.min.js';
                                    
                                    return '<script src="libs/' + packageName + minFileName + '"></script>';
                                },
                                
                                css: function (filePath) {
                                    var prefixLength = '../bower-packages'.length;
                                    var trimmedPath = filePath.slice(prefixLength);
                                    var packageName = trimmedPath.slice(1).split('/')[0];
                                    var fileName = trimmedPath.slice(trimmedPath.lastIndexOf('/'));
                                    var minFileName = fileName.split('.')[0] + '.min.css';
                                    
                                    return '<link href="libs/' + packageName + minFileName + '" rel="stylesheet" />';
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    grunt.registerTask('default', ['bower', 'uglify', 'cssmin', 'wiredep']);
};