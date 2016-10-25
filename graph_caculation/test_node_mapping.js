var co = require('co');
var get_signal = require('./graph_promise/http_promise');
var signal = require('./settings').signal;
var db = require('./neo4j_operation/db_settings').db;
var node_mapping = require('./node_mapping');
var change_node_resource = require('./neo4j_operation/change_node_resource');

module.exports = function(time){
    return new Promise(function(resolve,reject){
        function* g_node_map(){
            var result_flag,signal_flag;
            var data = yield get_signal('POST','/get_signal',{signal_settings:signal});
            var sig,sigs = data['signals'];
            if(sigs != false){
                for(let k=0;k<sigs.length;k++){
                    //sig = sigs[0];
                    //console.log('sigs is '+sigs);
                    //console.log('sig is '+sig);
                    sig = sigs[k];
                    var result =  yield node_mapping.node_mapping(db,sig,time);
                    var node_info = node_mapping.node_mapping_get_info();

                    //若资源分配成功，则更新节点
                    if(result.node_flag){
                        for(let i = 0;i<result.index_list.length;i++){
                            let index = result.index_list[i];
                            let flag = yield change_node_resource(db,index,node_info.available_compute_resource[index-1]);
                            if(flag){
                                continue;
                            }else{
                                //若更新节点时失败，则不断尝试直到成功
                                while(!flag){
                                    flag = yield change_node_resource(db,result.index_list[i],node_info.available_compute_resource[index])
                                }    
                            }
                        }   
                        //console.log('节点分配完成！');
                        result_flag = true;
                        signal_flag = true;
                    }else if(!result.result_flag){
                        //console.log('资源不足，已回滚！');
                        result_flag = false;
                        signal_flag = true;
                    }
                }
            }else{
                //console.log("没有信号到达~");
                signal_flag = false;
                result_flag = false;
            }
            return {
                result_flag:result_flag,
                signal_flag:signal_flag
            };
        }

        co(g_node_map).then(function(data){
            resolve(data);
        }).catch(function(err){
            reject(err);
        });
    });
};
