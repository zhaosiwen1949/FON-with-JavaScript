var label = require('./db_settings').label;

module.exports = function(db,index,available_compute_resource){
    return new Promise(function(resolve,reject){
        db.cypherQuery('MATCH (a:'+label+') WHERE a.index = {index} SET a.available_compute_resource = {resource} RETURN a',{
            index:index,
            resource:available_compute_resource
        },function(err,result){
            if(err){
                reject(err);
            }else{
                //console.log(result.data);
                //console.log(result.data[0]);
                if(result.data[0].index == index){
                    resolve(true);
                }else{
                    resolve(false);
                }
            }
        });
    });
};
