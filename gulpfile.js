const Builder = require('gulp-bem-bundle-builder');
const gulp = require('gulp');
const debug = require('gulp-debug');
const filter = require('through2-filter');
// const babel = require('gulp-babel');
const concat = require('gulp-concat');
const bemhtml = require('gulp-bem-xjst').bemhtml;
const toHtml = require('gulp-bem-xjst').toHtml;

const builder = Builder({
  // default (common) levels
  levels: ['l1'],
  techMap: {
    bemhtml: ['bemhtml.js']
  }
});

gulp.task('bemdecl', function(){
    return gulp.src('bundles/bemdecl/bemdecl.bemdecl.js')
        .pipe(builder({
            js: bundle => bundle.src('js')
                .pipe(concat(bundle.name + '.js'))
        }))
        .pipe(debug())
        .pipe(gulp.dest('bundles/bemdecl'));
});

gulp.task('bemjson', function(){
    return gulp.src('bundles/bemjson/bemjson.bemjson.js')
        .pipe(builder({
            js: bundle => bundle.src('js')
                .pipe(concat(bundle.name + '.js'))
        }))
        .pipe(debug())
        .pipe(gulp.dest('bundles/bemjson'));
});

gulp.task('common', function() {
    return gulp.src('bundles/common/common.bemdecl.js')
        .pipe(builder({
            'js': bundle =>
                // merge(
                    // bundle.src('js').pipe(filter(file => file.tech === 'bemhtml.js')
                        // .pipe(concat('all.bemhtml.js')).pipe(bemhtml())),
                    // and filtering out the rest of the js stream (any except templates)
                    bundle.src('js').pipe(filter.obj(file => file.tech !== 'bemhtml.js'))
                // )
                    .pipe(concat(bundle.name + '.js')),

            'css': bundle =>
                bundle.src('css')
                    // .pipe(autoprefixer({
                    //     browsers: ['last 2 versions'],
                    //     cascade: false
                    // }))
                    .pipe(concat(bundle.name + '.css')),

            'bemhtml.js': bundle =>
                bundle.src('bemhtml.js')
                    .pipe(concat('server.bemhtml.js'))
                    .pipe(bemhtml()),

            'html': bundle => {
                var bemhtmlStream = bundle.src('bemhtml.js')
                    .pipe(concat('server.bemhtml.js'))
                    .pipe(bemhtml())
                    .pipe(debug());

                return gulp.src('bundles/*/*.bemjson.js')
                    .pipe(debug())
                    .pipe(toHtml(bemhtmlStream))
                    .on('error', console.error);
            }
        }))
        .on('error', console.error)
        .pipe(debug())
        .pipe(gulp.dest('./bundles/common'))
                    .on('error', console.error);;
});

