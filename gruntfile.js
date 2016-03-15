/// <binding AfterBuild='bower, uglify, cssmin, wiredep' />
module.exports = function (grunt) {
    
    grunt.loadNpmTasks('grunt-wiredep');
	grunt.renameTask('wiredep', 'wiredepdebug');
	grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-installer');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');
	
	grunt.registerTask('default', ['bower', 'uglify', 'cssmin', 'wiredep', 'jshint', 'karma']);
	grunt.registerTask('release', ['bower', 'uglify', 'cssmin', 'wiredep', 'jshint', 'karma']);
	grunt.registerTask('debug', ['bower', 'wiredepdebug']);
	grunt.registerTask('test', ['jshint', 'karma']);
    
    grunt.initConfig({
		
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            files: {
                src: ['td/public/app/*.js', 'td/public/app/**/*.js']
            },
        },
		
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },		
		
        bower: {
            install: {
                options: {
                    targetDir: 'td/public/libs',
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
                        cwd: 'td/public/libs',
                        src: '**/*.js',
                        dest: 'td/public/libs',
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
                        cwd: 'td/public/libs',
                        src: '**/*.css',
                        dest: 'td/public/libs',
                        ext: '.min.css',
                        extDot: 'first'
                    }]
            }
        },
		
        wiredepdebug: {
            task: {
                src: ['td/public/index.html'],
                options: {
                    devDependencies: false,
                    fileTypes: {
                        html: {
                            replace: {
                                js: function (filePath) {
                                    var prefixLength = '../../bower-packages'.length;
                                    var trimmedPath = filePath.slice(prefixLength);
                                    var packageName = trimmedPath.slice(1).split('/')[0];
                                    var fileName = trimmedPath.slice(trimmedPath.lastIndexOf('/'));
                                    
                                    return '<script src="libs/' + packageName + fileName + '"></script>';
                                },
                                
                                css: function (filePath) {
                                    var prefixLength = '../../bower-packages'.length;
                                    var trimmedPath = filePath.slice(prefixLength);
                                    var packageName = trimmedPath.slice(1).split('/')[0];
                                    var fileName = trimmedPath.slice(trimmedPath.lastIndexOf('/'));
                                    
                                    return '<link href="libs/' + packageName + fileName + '" rel="stylesheet" />';
                                }
                            }
                        }
                    }
                }
            }
        },
		
		wiredep: {
            task: {
                src: ['td/index.html'],
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
                                    
                                    return '<script src="public/libs/' + packageName + minFileName + '"></script>';
                                },
                                
                                css: function (filePath) {
                                    var prefixLength = '../bower-packages'.length;
                                    var trimmedPath = filePath.slice(prefixLength);
                                    var packageName = trimmedPath.slice(1).split('/')[0];
                                    var fileName = trimmedPath.slice(trimmedPath.lastIndexOf('/'));
									var minFileName = fileName.split('.')[0] + '.min.css';
                                    
                                    return '<link href="public/libs/' + packageName + minFileName + '" rel="stylesheet" />';
                                }
                            }
                        }
                    }
                }
            }
        }

    });
};