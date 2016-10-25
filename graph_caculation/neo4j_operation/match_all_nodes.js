var label = require('./db_settings').label;

module.exports = function(db,list_num){
    return new Promise(function(resolve,reject){
        db.cypherQuery('MATCH (a:'+label+') RETURN a ORDER BY a.available_compute_resource DESC LIMIT {list_num}',{
            list_num:list_num
        },function(err,result){
            if(err){
                reject(err);
            }else{
                resolve(result.data);
            }
        });
    })
};
