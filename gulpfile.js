//Import dependencies
const { dest, series, parallel } = require('gulp');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass')); //compile sass
const browserSync = require('browser-sync').create(); //keep the browser updated
const concat = require('gulp-concat'); //join files
const uglify = require('gulp-uglify'); //uglify the js
const replace = require('gulp-replace'); //for the cache skipper
const rename = require('gulp-rename'); //rename files
const babel = require('gulp-babel'); //turn es6 into older versions for compatibilnpity
const webp = require('gulp-webp'); //convert images into webp
const stripComments = require('gulp-strip-comments');
const autoprefixer = require('gulp-autoprefixer'); //add vendor prefixes

const paths = {
    styles: {
        src: 'src/sass/**/*.scss',
        dest: 'dist/css',
    },
    js: {
        src: 'src/js/**/*.js',
        dest: 'dist/js',
    },
    images: {
        src: 'src/img/**/*.{png,jpg,jpeg,gif}',
        dest: 'dist/img',
    },
    html: ['index.html'],
};

//Compile images as webp
//TODO add export webp
const exportWebP = () => {
    return (
        gulp
            //images source
            .src(paths.images.src, { allowEmpty: true })
            //convert into webp
            .pipe(webp())
            //save as webp
            .pipe(dest(paths.images.dest))
    );
};

//Compile and minify the javascripts
function compileJs() {
    return (
        gulp
            .src(paths.js.src, { allowEmpty: true })
            //Merge all the Js files
            .pipe(concat('scripts.js'))
            //Strip comments
            .pipe(stripComments())
            //Uglify it
            .pipe(uglify())
            //babel it
            .pipe(
                babel({
                    presets: ['@babel/preset-env'],
                })
            )
            //Save it as a single file
            .pipe(dest(paths.js.dest))
            //Refresh the browser
            .pipe(browserSync.stream())
    );
}

//Compile scss into css
function compileSass() {
    return (
        gulp
            //find the sass file
            .src(paths.styles.src, { allowEmpty: true })
            //pass the file through sass compiler
            .pipe(sass().on('error', sass.logError))
            //add autoprefixer
            .pipe(autoprefixer())
            //rename the file
            .pipe(rename('styles.css'))
            //save the css file
            .pipe(dest(paths.styles.dest))
            // stream changes to all browsers
            .pipe(browserSync.stream())
    );
}

//Update cache skipper
function cacheSkipper() {
    const currentDate = new Date();
    const options = { dateStyle: 'short', timeStyle: 'short' };
    const formattedDate = currentDate.toLocaleString(undefined, options);

    return gulp
        .src(paths.html)
        .pipe(replace(/(cacheSkipper=)[^"]*/g, 'cacheSkipper=' + formattedDate))
        .pipe(concat('index.html'))
        .pipe(dest('./'));
}

function watch() {
    //Start the preview server
    browserSync.init({
        server: {
            baseDir: './',
        },
        notify: false,
    });

    //Start watching for changes on the files you are working on

    //Sass
    gulp.watch(paths.styles.src, series(compileSass, cacheSkipper));

    //Js
    gulp.watch(paths.js.src, series(compileJs, cacheSkipper));

    //Html
    gulp.watch(paths.html).on('change', browserSync.reload);

    //Images
    gulp.watch(paths.images.src, exportWebP);
}

exports.default = watch;
