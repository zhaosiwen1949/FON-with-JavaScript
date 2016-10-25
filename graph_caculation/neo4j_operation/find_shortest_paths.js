var label = require('./db_settings').label;

module.exports = function(db,start,end){
    return new Promise(function(resolve,reject){
        db.cypherQuery('MATCH p=allShortestPaths((a:'+label+')-[*]-(b:'+label+')) WHERE a.index={start} AND b.index={end} RETURN rels(p)',{
            start:start,
            end:end
        },function(err,result){
            if(err){
                //console.log(err);
                reject(err);
            }else{
                //console.log(result);
                //console.log(result.data[0][0].data);
                var data = result.data;
                if(data.length == 0){
                    //console.log("我们未能找到这种路径");
                    resolve(data);
                }else{
                    var result_array = new Array();
                    for(let i=0;i<data.length;i++){
                        result_array.push(new Array());
                        for(let j=0;j<data[i].length;j++){
                            result_array[i].push(data[i][j].data);
                        }
                    }
                    //console.log(result_array);
                    resolve(result_array);
                }
            }
        });
    });
};
