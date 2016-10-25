var spectrum_resource = require('../settings').spectrum_resource;
var db = require('./db_settings').db;
var label = require('./db_settings').label;

db.cypherQuery('MATCH ()-[r:'+label+']-() SET r.available_spectrum_resource={spectrum_resource} RETURN r',{
    spectrum_resource:spectrum_resource
},function(err,result){
    if(err){
        console.log(err);
    }else{
        console.log("链路频谱资源已全部重置！");
    }
});
