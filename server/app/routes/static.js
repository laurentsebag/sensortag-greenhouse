var express = require('express');

module.exports = function (app) {
  console.log('dir: ', __dirname);
  app.use(express.static(__dirname + '/../../../client'));
};
