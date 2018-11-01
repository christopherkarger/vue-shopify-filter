const gulp = require('gulp');
const webpack = require('webpack');
const argv = require('yargs').argv;
const webpackConfig = require('./.webpackconfig.js');
const webpackConfigProd = require('./.webpackconfig-prod.js');

let webpackInstance;

gulp.task('default' ,['prepare', 'scripts'], () => {
  gulp.watch(['./src/scss/*.scss','./src/js/*.js', './src/js/modules/*.js', './src/vue/*.vue'], ['scripts', () => {}]);
});

gulp.task('prepare', () => {
  webpackInstance = webpack((argv.live) ? webpackConfigProd : webpackConfig);
});


gulp.task('buildscripts', (callback) => {
  webpackInstance.run((err,stats) => {
    callback();
  });
});

gulp.task('scripts', ['buildscripts'], () => {
  gulp.src('./shop/assets/filter.js')
      .pipe(gulp.dest('./shop/assets/'));
});