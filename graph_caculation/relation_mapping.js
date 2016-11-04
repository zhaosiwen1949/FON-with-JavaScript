var co = require('co');
var dcopy = require('deep-copy');

var spectrum_resource = require('./settings').spectrum_resource;
var find_shortest_paths = require('./neo4j_operation/find_shortest_paths');
var graph = require('./settings').graph;
var array_stuff = require('./neo4j_operation/db_helpers').array_stuff;
var spectrum_distribute_with_LFH = require('./algorithm').spectrum_distribute_with_LFH;
//var array_2D_to_1D = require('./neo4j_operation/db_helpers').array_2D_to_1D;

//记录relation的频谱资源
var content = {
    number:spectrum_resource,
    list:array_stuff(spectrum_resource,0)
};
var available_spectrum_resource = init_available_spectrum_resource(graph,content);
var relation_mapping_log = new Array();

//构建一个辅助函数来初始化可用频谱资源的记录对象
function init_available_spectrum_resource(graph,content){
    var result = new Object();
    for(let i = 0;i<graph.length;i++){
        for(let j = 1;j<graph[i].length;j++){
            let start = Math.min(graph[i][0],graph[i][j]);
            let end = Math.max(graph[i][0],graph[i][j]);
            let index = start+'-'+end;
            if(result[index] == undefined){
                result[index] = dcopy(content);
            }
        }
    }
    return result;
}


module.exports = {
    relation_mapping:function(db,index_list,node_graph,duration,time){
        /*测试使用
        console.log({
            available_spectrum_resource:available_spectrum_resource
        })
        */
        return new Promise(function(resolve,reject){
            var break_flag=false,relation_flag,log_err;

            function* g_relation_mapping(){
                //分配资源之前，首先对之前的资源进行保存
                relation_mapping_log.pop();
                log_err = relation_mapping_log.pop();
                if(log_err != undefined) throw new Error('There exists a RELATION LOG ERR!!!');
                relation_mapping_log.push(dcopy(available_spectrum_resource));

                //根据index_list和node_graph对频谱资源进行分配
                let len = node_graph.length;
                for(let i=0;i<len;i++){
                    for(let j=i+1;j<len;j++){
                        if(node_graph[i][j] != 0){
                            //获取需要分配的频谱资源数量
                            var occupied_spectrum_resource = node_graph[i][j];
                               
                            //首先，根据index_list寻找到进行资源映射的路径
                            let start=index_list[i],end=index_list[j];
                            let paths_array = yield find_shortest_paths(db,start,end);
                            //paths_array里面包含所有最短路径，
                            //若最短路径不止一条，这里做一个简单处理，
                            //选取可用频谱资源最多的那条
                            //后续可以更改为按照可用资源大小进行排序，然后对
                            //每条通路都进行尝试（未实现，之后可以做个函数）
                            var path;
                            if(paths_array.length > 1){
                                let len = paths_array.length;
                                let available_resource = new Array();
                                for(let k=0;k<len;k++){
                                    let resource = paths_array[k].reduce(function(preVal,ele){
                                        let index = ele.index
                                        return available_spectrum_resource[index].number+preVal;
                                    },0);
                                    available_resource.push(resource);
                                }
                                let index = available_resource.indexOf(Math.max.apply(Math,available_resource));
                                path = paths_array[index];
                            }else if(paths_array.length = 1){
                                path = paths_array[0];
                            }else if(paths_array.length = 0){
                                //未能找到路径，需进行失败处理
                            }
                            //测试一：能否找出最短路径(通过)
                            //return path;

                            //接下来，映射频谱资源，
                            //目前采用left-first-hit的方式，
                            //注意保持频谱的一致性和连续性
                            //分配资源分两步：
                            //1、过滤掉已经到期的资源占用
                            for(let k = 0;k<path.length;k++){
                                let index = path[k].index;
                                available_spectrum_resource[index].list = available_spectrum_resource[index].list.map(function(val){
                                    if(typeof(val) == "number"){
                                        return 0
                                    }else if(typeof(val) == "object"){
                                        if(val.end<time){
                                            return 0
                                        }else{
                                            return val
                                        }
                                    }else{
                                        //做一些错误处理
                                    }
                                });
                            }

                            //2、分配新的频谱资源占用，注意连续性和一致性
                            //可以使用矩阵相关的库来解决
                            let path_1DArray = [];
                            
                            //记录下path路径中的经过的relation，
                            //并压缩成一维数组
                            for(let s = 0;s<path.length;s++){
                                let index = path[s].index;
                                path_1DArray = path_1DArray.concat(available_spectrum_resource[index].list);
                            }
                                path_1DArray = dcopy(path_1DArray);

                            //开始分配频谱资源
                            let result = spectrum_distribute_with_LFH(occupied_spectrum_resource,path_1DArray,path.length,spectrum_resource,time,duration);
                            //console.log({result_list:result.result_list});
                            if(result.result_flag){
                                //分配成功，更新频谱资源
                                for(let t = 0;t<path.length;t++){
                                    let index = path[t].index;
                                    //测试使用
                                    //console.log('t : '+t);
                                    //console.log('index : '+index);
                                    available_spectrum_resource[index].list = dcopy(result.result_list[t]);
                                    available_spectrum_resource[index].number = available_spectrum_resource[index].number - occupied_spectrum_resource;
                                    //console.log({index_num:available_spectrum_resource[index].number});
                                }
                                relation_flag = true;
                            }else{
                                //分配失败，回滚修改，跳出循环
                                if(relation_mapping_log.length == 1){
                                    //测试频谱分配使用
                                    //console.log("频谱资源回滚！！");
                                    available_spectrum_resource = dcopy(relation_mapping_log.pop());
                                }else{
                                    throw new Error('There exists a RELATION LOG ERR!!!');
                                }
                                relation_flag = false;
                                break_flag = true;
                                break;
                            }
                            //测试使用
                            //break;
                        }
                    }
                    if(break_flag) break;
                }
                /*测试使用
                console.log({
                    available_spectrum_resource:available_spectrum_resource
                });
                */
                return {
                    relation_flag:relation_flag
                }
            }
            co(g_relation_mapping).then(function(data){
                resolve(data);
            }).catch(function(err){
                reject(err);
            });
        });  
    },
    relation_mapping_get_info:function(){
        var available_spectrum_resource_number = new Object();
        //使用for...in循环来读取对象
        for(let index in available_spectrum_resource){
            if(available_spectrum_resource_number[index] == undefined){
                available_spectrum_resource_number[index] = available_spectrum_resource[index].number;
            }
        }
        return {
            available_spectrum_resource_number:available_spectrum_resource_number
        }   
    }
};
