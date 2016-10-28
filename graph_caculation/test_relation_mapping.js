var test_node_mapping = require('./test_node_mapping');
test_node_mapping().then(function(data){
    console.log(data);
}).catch(function(err){
    console.log(err);
});

/*var db = require('./neo4j_operation/db_settings').db;
var relation_mapping = require('./relation_mapping');
var index_list = [10,11,3];
var node_graph = [[0,4,5],
                  [4,0,7],
                  [5,7,0]];

relation_mapping.relation_mapping(db,index_list,node_graph).then(function(data){
    console.log(data);
    if(data.relation_flag){
        console.log("运行成功！");
    }else{
        console.log("运行失败！");
    }
    console.log("可用频谱资源数量列表是：");
    console.log(relation_mapping.relation_mapping_get_info());
}).catch(function(err){
    console.log(err);
});
*/
