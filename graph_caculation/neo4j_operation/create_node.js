var array_stuff = require('./db_helpers').array_stuff;

module.exports = function(db,index,compute_resource){
    db.cypherQuery("CREATE (a:TEST {index:{index},compute_resource:{compute_resource},occupied_compute_resource:{occupied_compute_resource}}) RETURN a",{
        index:index,
        compute_resource:compute_resource,
        occupied_compute_resource:new Array()
    },function(err,result){
        if(err) throw err;
        console.log(result.data);
    })
}
