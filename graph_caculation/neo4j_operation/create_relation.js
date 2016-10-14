var array_stuff = require('./db_helpers').array_stuff;
var label = require('./db_settings').label;

module.exports = function(db,start_node_index,end_node_index,spectrum_resource){
    db.cypherQuery('MATCH (a),(b) WHERE a.index={start_node_index} AND b.index={end_node_index} CREATE (a)-[r:'+label+' {index:{link_index},occupied_spectrum_resource:{available_spectrum_resource}}]->(b)',{
        start_node_index:start_node_index,
        end_node_index:end_node_index,
        link_index:start_node_index+'-'+end_node_index,
        available_spectrum_resource:array_stuff(new Array(),spectrum_resource,0)
    },function(err,result){
        if(err) console.log(err);
        //console.log(result.data);
    });
}
