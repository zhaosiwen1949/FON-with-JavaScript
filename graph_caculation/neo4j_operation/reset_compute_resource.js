var compute_resource = require('../settings').compute_resource;
var db = require('./db_settings').db;

db.cypherQuery('MATCH (a) SET a.available_compute_resource={resource} RETURN a',{
    resource:compute_resource
},function(err,result){
    if(err){
        console.log(err);
    }else{
        console.log(result);
    }
});

