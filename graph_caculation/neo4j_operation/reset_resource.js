var compute_resource = require('../settings').compute_resource;
var spectrum_resource = require('../settings').spectrum_resource;
var db = require('./db_settings').db;
var label = require('./db_settings').label;

db.cypherQuery('MATCH (a:'+label+'),()-[r:'+label+']-() SET a.available_compute_resource={compute_resource},r.available_spectrum_resource={spectrum_resource} RETURN a,r',{
    compute_resource:compute_resource,
    spectrum_resource:spectrum_resource
},function(err,result){
    if(err){
        console.log(err);
    }else{
        console.log("重置资源成功！！");
    }
});

