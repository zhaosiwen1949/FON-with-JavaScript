var db = require('./neo4j_operation/db_settings').db;
var create_node_list = require('./neo4j_operation/create_node_list');
var create_relation = require('./neo4j_operation/create_relation');
var graph_array = require('./graph_promise/http_promise');
var graph = require('./settings').graph;

graph_array('POST','/graph_array',{graph:graph}).then(function(data){
    var graph = data['graph'];
    //console.log(data);
    //console.log(graph);
    var len = graph.length;
    var props_list = [];
    for(var i=0;i<len;i++){
        props_list.push({
            index:i+1,
            available_compute_resource:100
        });
    }
    create_node_list(db,props_list).then(function(data){
        for(var j=0;j<len;j++){
            for(var k=0;k<len;k++){
                if(graph[j][k]==1){
                    if(j<k){
                    create_relation(db,j+1,k+1,100);
                    }
                }   
            }
        }
    }).catch(function(err){
        console.log(err);
    });
}).catch(function(err){
    console.log(err);
})
