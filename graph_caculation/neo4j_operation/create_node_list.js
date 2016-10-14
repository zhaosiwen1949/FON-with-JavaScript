var array_stuff = require('./db_helpers').array_stuff;
var label = require('./db_settings').label;

module.exports = function(db,props_list){
    return new Promise(function(resolve,reject){
        db.cypherQuery("UNWIND {props_list} as props CREATE (n:"+label+") SET n = props",{
            props_list:props_list
        },function(err,result){
            if(err) reject(err);
            resolve('SUCCESS!');
        })
    });
}
