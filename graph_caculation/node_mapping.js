var co = require('co');
var array_stuff = require('./neo4j_operation/db_helpers').array_stuff;
var graph = require('./settings').graph;
var compute_resource = require('./settings').compute_resource;
var match_all_nodes = require('./neo4j_operation/match_all_nodes');
var change_node_resource = require('./neo4j_operation/change_node_resource');

var len = graph.length;
var content = new Array({start:0,end:0,compute_resource:0});
var occupied_compute_resource = array_stuff(len,content);
var available_compute_resource = array_stuff(len,compute_resource);
var node_mapping_log=[];

module.exports = {
    node_mapping:function(db,signal,time){
    var ctx = this;
    return new Promise(function(resolve,reject){
        function* g_node_mapping(){
            //读取信号信息；
            var duration = signal['duration'];
            var node_list = signal['sig_list'].sort(function(a,b){
                return b-a;
            }); 
            var node_graph = signal['sig_graph'];
            var node_num = node_list.length;
            var index_list;
            var node_flag,log_err;

            //读取仿真网络中剩余计算资源最大的节点
            //读取之后存入日志中，便于分配失败时进行恢复
            var nodes = yield match_all_nodes(db,node_num);
            index_list = nodes.map(function(val){
                return val.index;
            });

            //记录下分配前的资源情况
            node_mapping_log.pop();
            log_err = node_mapping_log.pop();
            if(log_err != undefined) throw new Error("There exists a LOG ERR! ");
            node_mapping_log.push({
                node_mapping_index_list:[].concat(index_list),
                node_mapping_occupied_resource_list:[].concat(occupied_compute_resource),
                node_mapping_available_resource_list:[].concat(available_compute_resource)
            });

            /*构建辅助函数，帮助记录分配资源前的资源可用情况
            function generate_resource_list(available_compute_resource,index_list){
                var len = index_list.length;
                var index,result_array = new Array();
                for(var k=0;k<len;k++){
                    index = index_list[k];
                    result_array.push({
                        index:index,
                        pre_resource:available_compute_resource[index]
                    });
                }
                return result_array;
            }*/

            //映射节点，分配计算资源；
            for(var i=0;i<node_num;i++){
                var index = index_list[i]-1;
                //所需分配的资源入栈
                occupied_compute_resource[index].push({
                    start:time,
                    end:time+duration-1,
                    compute_resource:node_list[i]
                });
                //筛查排除已经过时的资源占用
             occupied_compute_resource[index]=occupied_compute_resource[index].filter(function(val){
                    if(val.end<time){
                        return false
                    }else{
                        return true
                    }
                });
                //更新当前资源占用
                var resource = occupied_compute_resource[index].reduce(function(preVal,ele){
                    return preVal+ele.compute_resource
                },0);
                //更新可用资源总量
                available_compute_resource[index] = available_compute_resource[index] - resource;

                //检查可用资源总量，若小于零，说明无法进行资源分配，
                //需要发出分配失败的信号，并且回滚操作
                if(available_compute_resource[index]<0){
                    ctx.node_mapping_rollback(occupied_compute_resource,available_compute_resource,node_mapping_log);     
                    node_flag = false;
                    break;
                }else{
                    //修改仿真网络中节点资源
                    //node_flag = yield change_node_resource(db,index,available_compute_resource[index]);
                    node_flag = true;
                }

                /*修改仿真网络中节点资源(此处需要单独构造一个函数)
                var data = yield change_node_resource(db,index,available_compute_resource[index]);
                if(data[0].index == index){
                    node_flag = true;
                }else{
                    node_flag = false;
                }*/
            }
            return {
                node_flag:node_flag,
                index_list:[].concat(index_list),
                node_graph:[].concat(node_graph),
                duration:duration
            }
        }
        
        co(g_node_mapping).then(function(data){
            resolve(data);
        }).catch(function(err){
            reject(err);
        });
    });},
    node_mapping_rollback:function(occupied_compute_resource,available_compute_resource,node_mapping_log){
        if(node_mapping_log.length != 1) throw new Error('There exists a LOG ERR!');
        occupied_compute_resource = node_mapping_log[0].node_mapping_occupied_resource_list;
        available_compute_resource = node_mapping_log[0].node_mapping_available_resource_list;
    },
    node_mapping_get_info:function(){
        return {
            occupied_compute_resource:occupied_compute_resource,
            available_compute_resource:available_compute_resource,
            node_mapping_log:node_mapping_log
        }
    }
};
