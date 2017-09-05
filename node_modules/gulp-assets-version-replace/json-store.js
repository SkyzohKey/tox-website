var fs = require('fs');

function Store(path) {
  this.path = path;
  if (!fs.existsSync(path)) 
    fs.writeFileSync(path, JSON.stringify({}));
  this.Store = require(path);
}

Store.prototype.get = function(key) {
  if (!key) return clone(this.Store);
  if (!this.Store[key]) return;
  return clone(this.Store[key]);
}

Store.prototype.set = function(key, value) {
  this.Store[key] = clone(value);
}

Store.prototype.setSync = function(key, value) {
  this.Store[key] = clone(value);
  this.saveSync();
}

Store.prototype.del = function(key) {
  delete this.Store[key];
}

Store.prototype.delSync = function(key) {
  delete this.Store[key];
  this.saveSync();
}

Store.prototype.save = function() {
  fs.writeFile(this.path, JSON.stringify(this.Store));
}
Store.prototype.saveSync = function() {
  fs.writeFileSync(this.path, JSON.stringify(this.Store));
}

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

module.exports = function(path) {
  return new Store(path);
}
