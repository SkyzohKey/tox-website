var gulp = require('gulp');
var fs = require("fs");
var path = require("path");
var through2       = require('through2');
var md5 = require('md5');
var JSONStore = require('./json-store');
var util = require('gulp-util');
var PluginError = util.PluginError;
// local version store 
var db = JSONStore(process.cwd() + '/gulp-assets-version-replace-version.json');
// replace list
var reList = [];

var PLUGIN_NAME = 'gulp-assets-version-replace';

function scanTsFiles(replaceTemplateList, thisVersionsAmount) {
  return through2.obj(function(file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }
    if (file.isStream()) {
      return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }

    // TODO: when gulp released 4, use `file.basename` instead of get basename by path
    var basename = path.basename(file.path);
    // TODO: when gulp released 4, use `file.stem` instead of replace file.relative append with extname
    var extname = path.extname(file.path);
    
    var fileVersions = db.get(basename);
    var thisVersion = md5(file.contents);
    var oldVersion;

    // Check file changed or not
    var fileChanged = false;

    // Alwways replace '__placeholder__' when thisVersionsAmount is 0
    if(thisVersionsAmount == 0
      // First time version
     || !fileVersions || fileVersions.length == 0) {
      oldVersion = '__placeholder__';
      fileVersions = [thisVersion];
      fileChanged = true;
    }
    else {
      // Use the last key to comparison as only the last version is using in template
      oldVersion = fileVersions[fileVersions.length - 1];
      if(oldVersion != thisVersion) {
        fileVersions.push(thisVersion);
        // Amount limit
        if(fileVersions.length > thisVersionsAmount) {
          fileVersions = fileVersions.slice(fileVersions.length - thisVersionsAmount, fileVersions.length)
        }
        fileChanged = true;
      }
    }

    db.set(basename, fileVersions)

    // Only pass modified files
    if(fileChanged) {
      var oldPath = basename.replace(extname, '.' + oldVersion + extname);
      var newRelativePath = basename.replace(extname, '.' + thisVersion + extname);
      reList.push({
        fileBasename: basename,
        oldPath: oldPath,
        newRelativePath: newRelativePath
      })
      // Output versioned file name
      var newPath = file.path.replace(extname, '.' + thisVersion + extname);
      file.path = newPath;
      this.push(file);
    }
    cb();

  }, function(cb) {
    // Keep to json file when limit is not 0
    // TODO: deal with saved bofore when limit is not 0, they can't be wiped now!
    if(thisVersionsAmount != 0) {
      // async save, and save only once
      db.save();
    }

    // Can only start after scaned ts files and finished collecting relist
    // Templates are always relative path of gulpfile.js
    if(replaceTemplateList && replaceTemplateList.length) {
      gulp.src(replaceTemplateList, { base: "./" })
        .pipe(replaceTemplate())
        .pipe(gulp.dest('.'));
    }

    cb();
  })
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
function countOcurrences(str, value) {
  var regExp = new RegExp(value, "g");
  return (str.match(regExp) || []).length;
}

function replaceTemplate() {
  return through2.obj(function(file, enc, cb) {
    var content = file.contents.toString();
    for (var i = reList.length - 1; i >= 0; i--) {
      var reItem = reList[i];
      var count = countOcurrences(content, escapeRegExp(reItem.oldPath));
      if(count > 0) {
        util.log('Replaced ' + util.colors.magenta(count) + ' version string of ' + util.colors.gray(reItem.fileBasename) + ' in ' + file.relative + ':')
      }
      content = content.replace(reItem.oldPath, reItem.newRelativePath)
    }
    file.contents = new Buffer(content);
    cb(null, file)
  })
}

module.exports = function (options) {
  var replaceTemplateList = options.replaceTemplateList;
  // default amount of versions is 1
  var versionsAmount = options.versionsAmount;
  if(typeof versionsAmount === 'undefined')
    versionsAmount = 1;
  return scanTsFiles(replaceTemplateList, versionsAmount)
}