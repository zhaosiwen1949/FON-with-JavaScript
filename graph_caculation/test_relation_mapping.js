var db = require('./neo4j_operation/db_settings').db;
var relation_mapping = require('./relation_mapping');
var index_list = [10,11];
var node_graph = [[0,4],
                  [4,0]];

relation_mapping(db,index_list,node_graph).then(function(data){
    console.log(data);
    console.log("运行成功！");
})
