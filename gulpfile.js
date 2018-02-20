var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var rename = require("gulp-rename");
var browserSync = require('browser-sync').create();
var jade = require('gulp-jade');
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');
var image = require('gulp-image');

//create browser-sync
gulp.task("browser-sync",["styles","script","jade","image"],function(){
    browserSync.init({
        server:{
            baseDir:"build"
        },
        notify: false
    });
});
//compile image
gulp.task("image",function(){
    gulp.src("app/img/**/*")
    .pipe(image())
    .pipe(gulp.dest("build/img"));
});
//compile jade code
gulp.task("jade",function(){
     gulp.src("app/templates/**/*.jade")
    .pipe(jade())
    .pipe(gulp.dest("build"));
})
//add JS library for build
gulp.task("script", function(){
    return gulp.src(require("./dependencies.json").js)
    .pipe(concat("main.js"))
    .pipe(gulp.dest("./build/js"))
})


//compile scss code
gulp.task("styles",function(){
    return gulp.src("./app/style/**/*.scss")
    .pipe(sass().on("error",sass.logError))
    .pipe(rename({
        suffix: ".min",
        prefix: ""
        
    }))
    .pipe(autoprefixer({
        browsers: ["last 10 versions"],
        cascade: true
    }))
    .pipe(minifycss())
    .pipe(gulp.dest("build/css"))
    .pipe(browserSync.stream());
});

gulp.task("build",["styles","script","jade","image"]);
gulp.task("watch",function(){
    gulp.watch("app/style/**/*.scss",["styles"]);
    gulp.watch("app/img/**/*",["image"]);
    gulp.watch("app/templates/**/*.jade",["jade"]);
    gulp.watch("app/js/**/*.js",["script"]);
    gulp.watch("app/*.html").on("change",browserSync.reload);
});
gulp.task("default",["browser-sync","watch"]);