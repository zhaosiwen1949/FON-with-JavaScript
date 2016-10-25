var co = require('co');
var spectrum_resource = require('./settings').spectrum_resource;
var find_shortest_paths = require('./neo4j_operation/find_shortest_paths');

module.exports = function(db,index_list,node_graph,duration){
    return new Promise(function(resolve,reject){
        function* g_relation_mapping(){
            //分配资源之前，首先对之前的资源进行保存

            //根据index_list和node_graph对频谱资源进行分配
            let len = node_graph.length;
            for(let i=0;i<len;i++){
                for(let j=i+1;j<len;j++){
                    if(node_graph[i][j] != 0){
                        //首先，根据index_list寻找到进行资源映射的路径
                        let start=index_list[i],end=index_list[j];
                        let paths_array = yield find_shortest_paths(db,start,end);
                        //paths_array里面包含所有最短路径，
                        //若最短路径不止一条，这里做一个简单处理，
                        //选取可用频谱资源最多的那条
                        var path;
                        if(paths_array.length > 1){
                            let len = paths_array.length;
                            let available_resource = new Array();
                            for(let k=0;k<len;k++){
                                let resource = paths_array[k].reduce(function(preVal,ele){
                                    return ele.available_spectrum_resource+preVal;
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
                        // return path;

                        //接下来，映射频谱资源，
                        //注意保持频谱的一致性和连续性
                    }
                }
            }
        }
        co(g_relation_mapping).then(function(data){
            resolve(data);
        });
    });  
};
