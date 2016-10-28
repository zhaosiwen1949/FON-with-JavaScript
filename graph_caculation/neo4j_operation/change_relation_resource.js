var label = require('./db_settings').label;

module.exports = function(db,index,available_spectrum_resource){
    return new Promise(function(resolve,reject){
        db.cypherQuery('MATCH ()-[r:'+label+']-() WHERE r.index = {index} SET r.available_spectrum_resource = {available_spectrum_resource} RETURN r',{
            index:index,
            available_spectrum_resource:available_spectrum_resource
        },function(err,result){
            if(err){
                reject(err);
            }else{
                if(result.data[0].index == index){
                    resolve(true);
                }else{
                    resolve(false);
                }
            }
        });
    });
};
