//Define all variables here and use them in Gulpfile.

module.exports = function () {

    //Setup the rootFolder
    var rootFolder = "./";

    var index = rootFolder + "/index.html";

    //Define the Output folder
    var dist = rootFolder + '/dist';

    //Define the Temp Data folder
    var temp = rootFolder + '/temp';

    //Provide the exclude file patterns i.e. Test/SPEC & Karma files.
    var testFiles = '*-spec.js';
    var excludePatterns = '!' + rootFolder + '*-spec.js';

    var buildConfig = {

        temp: temp,
        dist: dist,

        //Bower
        bower: {
            json: require('./bower.json'),
            directory: './bower_components',
            ignorePath: '../..'
        },


        //The LESS files to be compiled to CSS
        less: rootFolder + '/app.less',

        //The Index File. We'll use this to refer and replace data while concat operation
        index: index,

        //Working Folder Details
        partials: [rootFolder + '/**/*.html', '!' + index, '!' + rootFolder + '/bower_components/**', '!' + rootFolder + '/node_modules/**', '!' + rootFolder + '/dist/**'],
        js: [rootFolder + '/**/*.js','!' + rootFolder + '/**/*-spec.js', '!{Grunt*,gulp*}.js', '!' + rootFolder + '/bower_components/**', '!' + rootFolder + '/node_modules/**', '!' + rootFolder + '/dist/**'],
        vendors: [rootFolder + '/vendors/*.js'],

        //Output File Names
        template: 'templates.js',
        cryptojs: 'crypto.js',
        vendorjs1: 'vendors1.js',
        requirementjs: 'requirementjs.js',

        //Module Definitions
        //Here we define the folders to be combined,for each module, while concatenation 
        requirementJS: [rootFolder + '/app.js']

    };

    buildConfig.getWiredepOptions = function () {
        var options = {
            bowerJson: buildConfig.bower.json,
            directory: buildConfig.bower.directory,
            ignorePath: buildConfig.bower.ignorePath
        };
        //return options;
    };

    return buildConfig;
};