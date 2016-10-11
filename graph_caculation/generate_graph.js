var db = require('./neo4j_operation/db_settings').db;
var create_node = require('./neo4j_operation/create_node');
var create_relation = require('./neo4j_operation/create_relation');

create_node(db,14,100);
create_node(db,13,100);
create_relation(db,13,14,100);
