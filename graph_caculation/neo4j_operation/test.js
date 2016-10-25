var db = require('./db_settings').db;
var label = require('./db_settings').label;

db.cypherQuery('MATCH (a:'+label+') RETURN a ORDER BY a.available_compute_resource LIMIT {list_num}',
               {list_num:4},
               function(err,result){
               if(err) console.log(err);
               console.log({match_all_nodes:result});
               })

db.cypherQuery('MATCH (a:'+label+') WHERE a.index = {index} SET a.available_compute_resource = {resource} RETURN a',{
        index:1,
        resource:100
    },function(err,result){
    if(err){
        console.log(err);
    }else{
        console.log(result);
    }
});
    
