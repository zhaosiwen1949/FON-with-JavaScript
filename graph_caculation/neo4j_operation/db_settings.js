var neo4j = require('node-neo4j');
var username = 'neo4j';
var password = 'caoyasong1949';
var domain = 'localhost';
var port = '7574';
var url = 'http://'+username+':'+password+'@'+domain+':'+port;
var db = new neo4j(url);
exports.db = db;
