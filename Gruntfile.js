module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		sass: {
			options: {
				style: 'compressed',
				compass: true,
				noCache: true
			},
			all_files: {
				files: [{
					expand: true,
					cwd: 'sass',
					src: ['*.scss'],
					dest: 'css',
					ext: '.css'
				}]
			}
		},
		autoprefixer: {
			all_files: {
				files: [{
					expand: true,
					cwd: 'css',
					src: ['*.css'],
					dest: 'css'
				}]
			}
		},
		imagemin: {
			all_files: {
				files: [{
					expand: true,
					cwd: 'images_source',
					src: ['**/*.{jpg,jpeg,gif,png}'],
					dest: 'images'
				}]
			}
		},
		copy: {
			nonoptim_images: {
				files: [{
					expand: true,
					cwd: 'images_source',
					src: ['**/*.*', '!**/*.{jpg,jpeg,gif,png}'],
					dest: 'images'
				}]
			}
		},
		closureCompiler: {
			options: {
				compilerFile: 'c:\\Program Files (x86)\\Google Closure compiler\\compiler.jar'
			},
			all_root_files: {
				files: [{
					expand: true,
					cwd: 'js',
					src: ['*.js', '!*.min.js'],
					dest: 'js',
					ext: '.min.js'
				}]
			}
		}
	});

	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-closure-tools');

	//helper tasks
	grunt.registerTask('sass_all', ['sass:all_files', 'autoprefixer:all_files']);
	grunt.registerTask('images_all', ['copy:nonoptim_images', 'imagemin:all_files']);

	// Default task(s).
	grunt.registerTask('default', ['sass_all', 'closureCompiler:all_root_files', 'images_all']);

};