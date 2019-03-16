const gulp = require('gulp');
const sass  = require("gulp-sass");
const cp = require('child_process');
const through2  = require('through2');
const replaceExt     = require('replace-ext');

function wrap(){
    return through2.obj(function(file, enc, cb) {
        if (file.isNull()) {
          return cb(null, file);
        }
    
        if (file.isStream()) {
          return cb(new Error('Streaming not supported'));
        }
        file.path = replaceExt(file.path, '.ts');
        const str = file.contents.toString();
        // file.contents = new Buffer(`exports.default = "${str.replace(/[\r\n]/g,'')}"`);
        file.contents = new Buffer(`export default \`${str}\``);
        cb(null, file); 
    });
}


function sass_compile(cb){
    gulp.src('./src/**/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(wrap())
    .pipe(gulp.dest('./src'))
    cb && cb()
}

function variable_compile(){
    gulp.src('./src/index.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./lib'))
    // cb && cb()
}

// function runTask(cmd){
//     const ls = cp.spawn(cmd);
//     ls.stdout.on('data', (data) => {
//         console.log(data);
//     });
    
//     ls.stderr.on('data', (data) => {
//         console.err(data);
//     });
    
//     ls.on('close', (code) => {
//         console.log('watchTs closed!!!');
//     });
// }


exports.watch = function(cb){
    gulp.watch('./src/**/*.scss',function(icb){
        sass_compile();
        variable_compile();
        icb && icb();
    });
    cb && cb();
}
