var db = require('./db_settings').db;

db.cypherQuery('MATCH (a) DETACH DELETE a',function(err,result){
    if(err){
        console.log(err);
    }else{
        console.log("成功删除所有节点！");
    }
});
