var array_stuff = require('./db_helpers').array_stuff;

module.exports = function(db,start_node_index,end_node_index,spectrum_resource){
    db.cypherQuery('MATCH (a),(b) WHERE a.index={start_node_index} AND b.index={end_node_index} CREATE (a)-[r:TEST {index:{link_index},occupied_spectrum_resource:{occupied_spectrum_resource}}]->(b) RETURN r',{
        start_node_index:start_node_index,
        end_node_index:end_node_index,
        link_index:start_node_index+'-'+end_node_index,
        occupied_spectrum_resource:array_stuff(new Array(),spectrum_resource,0)
        //occupied_spectrum_resource:new Array()
    },function(err,result){
        if(err) throw err;
        console.log(result.data);
    });
}
