module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
        css: {
           src: [
              'css/*'
            ],
            dest: 'css/combined.css'
        },
        js : {
            src : [
              'js/main.js'
            ],
            dest : 'js/combined.js'
        }
    },
    cssmin : {
        css:{
            src: 'css/combined.css',
            dest: 'combined.min.css'
        }
    },
    uglify: {
        my_target: {
         files: { 
          'combined.min.js': ['js/combined.js']
        }
      }
    },
    watch: {
      files: ['css/*', 'js/*'],
      tasks: ['concat', 'cssmin', 'uglify']
    }

});

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['concat','cssmin','uglify','watch']);

};