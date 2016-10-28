var db = require('./db_settings').db;
var label = require('./db_settings').label;
var find_shortest_paths = require('./find_shortest_paths');
var spectrum_distribute_with_LFH = require('../algorithm').spectrum_distribute_with_LFH;
var array_2D_to_1D = require('./db_helpers').array_2D_to_1D;
var change_relation_resource = require('./change_relation_resource');

//测试修改节点资源
change_relation_resource(db,'10-14',1).then(function(data){
    if(data){
        console.log("修改成功！！！");
    }else{
        console.log("修改失败！！！");
    }
}).catch(function(err){
    console.log(err);
});

/*压缩二维数组的测试
var array_2D = [[1,2,3,4,5],
                [6,7,8,9,10],
                [11,12,13,14,15]];
var array_1D = array_2D_to_1D(array_2D);
console.log("处理之前的资源数组是：");
console.log(array_2D);
console.log("处理之后的资源数组是：");
console.log(array_1D);
*/

/*分配频谱资源的测试
var list = [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
var result = spectrum_distribute_with_LFH(3,list,3,6,10,5);
console.log("处理之前的资源数组是：");
console.log(list);
console.log("处理之后的资源数组是：");
console.log(result);
*/

//寻找最短路径的测试
//find_shortest_paths(db,10,1);

/* 查询可用节点及分配节点资源的测试
 * db.cypherQuery('MATCH (a:'+label+') RETURN a ORDER BY a.available_compute_resource LIMIT {list_num}',
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
*/    
