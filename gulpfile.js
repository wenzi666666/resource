//gulp 2015-08-04
/**
 * author lgzhang08@tfedu.net
 *
 * @param {String} ext
 * @param {String} name
 * @param {Object} opt
 */
'use strict';

var gulp = require('gulp');
var g = require('gulp-load-plugins')({lazy: false});
var fs = require('fs');
var less = require('gulp-less');
var replace = require('gulp-replace-task');
var inject = require('gulp-inject');
var browserSync = require('browser-sync');
var html2js = require('gulp-ng-html2js');
var reload = browserSync.reload;
var historyApiFallback = require('connect-history-api-fallback');

var settings;
// Try to read frontend configuration file, fallback to default file
try {
    settings = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));
} catch (error) {
    settings = JSON.parse(fs.readFileSync('./config/config_example.json', 'utf8'));
}

var config = {
    paths: {
        html: {
            src:  ["src/**/*.html"]
        },
        libjs: {
            src:  ["src/lib/**/*.js"]
        },
        corejs: {
            src: ["dist/template.js", "src/js/**/*.js"]
        },
        comsjs: {
            src: ["src/coms/**/*.js"]
        },
        libcss: {
            src: ["src/lib/**/*.css"]
        },
        appcss: {
            src: ["dist/frontend.css"]
        },
        less: {
            src: ["src/less/frontend.less"]
        },
        appless: {
            src: ["src/less/*.less"]
        },
        assets: {
            src: ["src/lib/bootstrap/fonts/**", "src/lib/font-awesome/font/**", "src/assets/**","src/favicon.ico","src/lib/tree//images/**"]
        }
    }
}

 // 检查脚本
gulp.task('jscheck', function() {
    gulp.src(config.paths.js.src)
        .pipe(g.jshint())
        .pipe(g.jshint.reporter('default'));
});

// 合并，压缩lib js文件
gulp.task('minlibjs', function() {
    gulp.src(config.paths.libjs.src)
        .pipe(g.concat('lib.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(g.rename('lib.min.js'))
        .pipe(g.uglify())
        .pipe(gulp.dest('./dist'));
});
// 合并，压缩coms app js文件
gulp.task('appjs',['templates'], function() {
	var appjs = config.paths.corejs.src.concat(config.paths.comsjs.src);
	console.log(appjs)
    gulp.src(appjs)
        .pipe(g.concat('app.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(g.rename('app.min.js'))
        .pipe(g.uglify())
        .pipe(gulp.dest('./dist'));
});
// 合并，压缩css文件
gulp.task('mincss', function() {
	var mincss = config.paths.libcss.src.concat( config.paths.appcss.src);
	console.log(mincss)
    gulp.src(mincss)
        .pipe(g.concat('app.css'))
        .pipe(gulp.dest('./dist'))
        .pipe(g.rename('app.min.css'))
        .pipe(g.cssmin())
        .pipe(gulp.dest('./dist'));
});

// 打包font assets中所有图片到dist目录下 
gulp.task('movassets', function() {
    gulp.src(config.paths.assets.src[0])
        .pipe(gulp.dest('./dist/fonts'))
     gulp.src(config.paths.assets.src[1])
        .pipe(gulp.dest('./dist/font'))
    gulp.src(config.paths.assets.src[2])
        .pipe(gulp.dest('./dist/assets'))
    gulp.src(config.paths.assets.src[3])
        .pipe(gulp.dest('./dist'));
    gulp.src(config.paths.assets.src[4])
        .pipe(gulp.dest('./dist/images'));
});

// 打包
gulp.task('dist', ['less', 'minlibjs', 'appjs',  'mincss',  'movassets', 'disthtml']);

//监听android
gulp.task('android', ['templates', 'appjs',  'mincss']);
gulp.task('appdist', ['templates', 'minlibjs', 'appjs',  'mincss']);

// 默认任务
gulp.task('watch', ['html'], function () {
  browserSync({
    notify: false,
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: {
        baseDir:['dist', 'src'],
        index: "index.html",
        middleware: [ historyApiFallback()]
    }
  });
  // gulp.watch(config.paths.css.src, ['inject']);
    gulp.watch(config.paths.appless.src, ['less']);
    gulp.watch('dist/frontend.css', reload);
    gulp.watch(config.paths.corejs.src, reload);
    gulp.watch(config.paths.comsjs.src, reload);
	//gulp.watch([config.paths.html.src,config.paths.css.src,config.paths.js.src], ['inject', 'templates']);
	gulp.watch(config.paths.html.src, ['templates']);
	gulp.watch(config.paths.appcss.src, reload);
	gulp.watch('./dist/template.js', reload);
	
	//android
    // gulp.watch(config.paths.comsjs.src,  ['android']);
});

// less编译 
gulp.task('less', function () {
    gulp.src(config.paths.less.src)
        .pipe(less())
        .pipe(gulp.dest('dist'));
});

// 转移index.html到dsit目录下 inject config
gulp.task('html', [ 'templates'], function() {
    gulp.src('./src/index.html')
        .pipe(replace({
            patterns: [
                {
                    match: 'BackendUrl',
                    replacement: settings.BackendUrl
                }
            ]
        }))
        .pipe(replace({
            patterns: [
                {
                    match: 'ImageServer',
                    replacement: settings.ImageServer
                }
            ]
        }))
        .pipe(replace({
            patterns: [
                {
                    match: 'FileServer',
                    replacement: settings.FileServer
                }
            ]
        }))
         //inject lib
        .pipe(inject(gulp.src(config.paths.libjs.src,  {read: false}), {starttag: '<!-- inject:lib:{{ext}} -->',ignorePath: 'src'}))
        .pipe(inject(gulp.src(config.paths.libcss.src, {read: false}), {starttag: '<!-- inject:lib:{{ext}} -->',ignorePath: 'src'}))
        //inject core and app
        .pipe(inject(gulp.src(config.paths.appcss.src,{read: false}), {starttag: '<!-- inject:app:{{ext}} -->',ignorePath: 'dist'}))
        .pipe(inject(gulp.src(config.paths.corejs.src,{read: false}), {starttag: '<!-- inject:core:{{ext}} -->',ignorePath: ['src', 'dist']}))
        .pipe(inject(gulp.src(config.paths.comsjs.src,{read: false}), {starttag: '<!-- inject:app:{{ext}} -->',ignorePath: 'src'}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('disthtml', function() {
     gulp.src('./src/dist.html')
        .pipe(replace({
            patterns: [
                {
                    match: 'BackendUrl',
                    replacement: settings.BackendUrl
                }
            ]
        }))
        .pipe(replace({
            patterns: [
                {
                    match: 'ImageServer',
                    replacement: settings.ImageServer
                }
            ]
        }))
        .pipe(replace({
            patterns: [
                {
                    match: 'FileServer',
                    replacement: settings.FileServer
                }
            ]
        }))
//      .pipe(g.rename('dist.html'))
        .pipe(gulp.dest('./dist'));
});
gulp.task('default', ['less', 'watch']);

gulp.task('templates', function() {
     return templateFiles();
});

/**
 * All AngularJS templates/partials as a stream
 */
function templateFiles(opt) {
    return gulp.src(['./src/coms/**/*.html'])
        .pipe(html2js({
            moduleName: 'tmp',
            prefix: '/coms/',
            stripPrefix: ''
        }))
         .pipe(g.concat('template.js'))
		 .pipe(gulp.dest('./dist'))
}