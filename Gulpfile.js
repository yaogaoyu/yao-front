/**
 * @author    姚尧 <yaogaoyu@qq.com>
 * @copyright © 2016 YaoYao<yaogd.com>
 * @license   GPL-3.0+
 */

var $gulp = require('gulp'),
    $jshint = require('gulp-jshint');
    $smap = require('gulp-sourcemaps'),
    $sass = require('gulp-sass'),
    $pug = require('gulp-pug'),
    $puglint = require('gulp-pug-lint'),
    $rename = require('gulp-rename'),
    $insert = require('gulp-insert'),
    $del = require('del'),
    $browserify = require('browserify'),
    $source = require('vinyl-source-stream'),
    $buffer = require('vinyl-buffer'),
    $uglify = require('gulp-uglify'),
    pkg = require('./package.json'),
    src = {
        scss: 'scss/www.scss',
        scssLib: ['scss/*.scss'],
        js: 'js/www.js',
        jsLib: ['js/*.js','js/lib/*.js'],
        pugLib: ['pug/*.pug', 'pug/*/*.pug']
    },
    dst = {
        _: 'var/build',
        css: 'var/build/share/static/css',
        js: 'var/build/share/static/js',
        html: 'var/build/share/public/html',
    };

$gulp.task('clear', function () {
    $del(dst._ + '/*');
});

$gulp.task('js:hint', function () {
    return $gulp.src(src.jsLib)
        .pipe($jshint('.jshintrc'))
        .pipe($jshint.reporter('jshint-stylish', {beep: true}))
});

$gulp.task('js:debug', ['js:hint'], function () {
    return $browserify({
            debug: true,
            detectGlobals: false
        })
        .require('./js/' + pkg.name, {
            expose: 'www'
        })
        .bundle()
        .pipe($source(pkg.version + '.min.js'))
        .pipe($insert.append('$().ready(function(){require("www");});'))
        .pipe($buffer())
        .pipe($gulp.dest(dst.js));
});

$gulp.task('js', ['js:hint'], function () {
    return $browserify({
            debug: true,
            detectGlobals: false
        })
        .require('./js/' + pkg.name, {
            expose: 'www'
        })
        .bundle()
        .pipe($insert.append('$().ready(function(){require("www");});'))
        .pipe($source(pkg.version + '.min.js'))
        .pipe($buffer())
        .pipe($smap.init({
            loadMaps: true
        }))
        .pipe($uglify())
        .pipe($smap.write('.'))
        .pipe($gulp.dest(dst.js));
});

$gulp.task('css', function () {
    return $gulp.src(src.scss)
        .pipe($smap.init())
        .pipe(
            $sass({outputStyle: 'compressed'})
                .on('error', $sass.logError)
        )
        .pipe($rename(pkg.version + '.min.css'))
        .pipe($smap.write('.'))
        .pipe($gulp.dest(dst.css));
});

$gulp.task('html', ['html:lint'], function () {
    return $gulp.src(src.pugLib)
        .pipe($pug({
            'pretty': '    '
        }))
        .pipe($gulp.dest(dst.html));
});

$gulp.task('html:lint', function () {
    return $gulp.src(src.pugLib)
        .pipe($puglint());
});

$gulp.task('bundle', ['css', 'js']);

$gulp.task('watch', function () {
    $gulp.watch(src.scssLib, ['css']);
    $gulp.watch(src.jsLib, ['js:debug']);
    $gulp.watch(src.pugLib, ['html']);
});

$gulp.task('default', ['bundle']);

