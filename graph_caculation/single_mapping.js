var co = require('co');
var dcopy = require('deep-copy');
var get_signal = require('./graph_promise/http_promise');
var signal = require('./settings').signal;
var db = require('./neo4j_operation/db_settings').db;
var node_mapping = require('./node_mapping');
var change_node_resource = require('./neo4j_operation/change_node_resource');
var relation_mapping = require('./relation_mapping');
var change_relation_resource = require('./neo4j_operation/change_relation_resource');

module.exports = function(time){
    return new Promise(function(resolve,reject){
        function* g_node_map(){
            var result_flag=[],signal_flag=[];
            //测试回滚使用
            var node_ref=[],relation_ref=[];
            var data = yield get_signal('POST','/get_signal',{signal_settings:signal});
            var sig,sigs = data['signals'];
            if(sigs != false){
                for(let k=0;k<sigs.length;k++){
                    //sig = sigs[0];
                    //console.log('sigs is '+sigs);
                    //console.log('sig is '+sig);
                    sig = sigs[k];
                    var node_result =  yield node_mapping.node_mapping(db,sig,time);
                    //若计算资源分配成功，则分配频谱资源
                    if(node_result.node_flag){
                        let index_list = node_result.index_list;
                        let node_graph = node_result.node_graph;
                        let duration = node_result.duration;
                        var relation_result = yield relation_mapping.relation_mapping(db,index_list,node_graph,duration,time);
                        if(relation_result.relation_flag){
                            //若计算资源及频谱资源都分配成功，则更改节点
                            //首先需要读取目前计算及频谱资源分配情况
                            let node_info = node_mapping.node_mapping_get_info();
                            let a_compute_res = dcopy(node_info.available_compute_resource);
                            let relation_info = relation_mapping.relation_mapping_get_info();
                            let a_spectrum_res = dcopy(relation_info.available_spectrum_resource_number);
                            //更新计算资源
                            for(let i = 0;i<index_list.length;i++){
                                let index = index_list[i];
                                let flag = yield change_node_resource(db,index,a_compute_res[index-1]);
                                if(flag){
                                    continue;
                                }else{
                                    //若更新节点时失败，则不断尝试直到成功
                                    while(!flag){
                                        flag = yield change_node_resource(db,index,a_compute_res[index-1])
                                    }    
                                }
                            }   
                            //更新频谱资源
                            for(let index in a_spectrum_res){
                                let flag = yield change_relation_resource(db,index,a_spectrum_res[index]);
                                if(flag){
                                    continue;
                                }else{
                                    while(!flag){
                                        let flag = yield change_relation_resource(db,index,a_spectrum_res[index]);
                                    }
                                }
                            }
                            //console.log('节点分配完成！');
                            result_flag.push(true);
                            signal_flag.push(true);
                            //测试回滚使用
                            node_ref.push(dcopy(node_mapping.node_mapping_get_info()));
                            relation_ref.push(dcopy(relation_mapping.relation_mapping_get_info()));
                            //node_ref.push(Object.assign({},node_mapping.node_mapping_get_info()));
                        }else if(!relation_result.relation_flag){
                            //回滚节点计算资源（频谱资源已经回滚了）
                            /*let node_info = node_mapping.node_mapping_get_info();
                            let node_mapping_rollback = node_mapping.node_mapping_rollback;
                            let occupied_compute_resource = node_info.occupied_compute_resource;
                            let available_compute_resource = node_info.available_compute_resource;
                            let node_mapping_log = node_info.node_mapping_log;
                            node_mapping_rollback(occupied_compute_resource,available_compute_resource,node_mapping_log);*/
                            node_mapping.node_mapping_rollback();
                            result_flag.push(false);
                            signal_flag.push(true);
                            //测试回滚使用
                            node_ref.push(dcopy(node_mapping.node_mapping_get_info()));
                            relation_ref.push(dcopy(relation_mapping.relation_mapping_get_info()));
                            /*node_ref.push(Object.assign({},{
                                occupied_compute_resource:[].concat(node_mapping.node_mapping_get_info().occupied_compute_resource),
                                available_compute_resource:[].concat(node_mapping.node_mapping_get_info().available_compute_resource),
                                node_mapping_log:[].concat(node_mapping.node_mapping_get_info().node_mapping_log)
                            }));*/
                        }
                    }else if(!node_result.node_flag){
                        //console.log('资源不足，已回滚！');
                        result_flag.push(false);
                        signal_flag.push(true);
                        //测试回滚使用
                        node_ref.push(dcopy(node_mapping.node_mapping_get_info()));
                        relation_ref.push(dcopy(relation_mapping.relation_mapping_get_info()));
                        /*node_ref.push(Object.assign({},{
                            occupied_compute_resource:[].concat(node_mapping.node_mapping_get_info().occupied_compute_resource),
                            available_compute_resource:[].concat(node_mapping.node_mapping_get_info().available_compute_resource),
                            node_mapping_log:[].concat(node_mapping.node_mapping_get_info().node_mapping_log)
                        }));*/
                    }
                }
            }else{
                //console.log("没有信号到达~");
                signal_flag.push(false);
                result_flag.push(false);
                //测试回滚使用
                node_ref.push(dcopy(node_mapping.node_mapping_get_info()));
                relation_ref.push(dcopy(relation_mapping.relation_mapping_get_info()));
                /*node_ref.push(Object.assign({},{
                    occupied_compute_resource:[].concat(node_mapping.node_mapping_get_info().occupied_compute_resource),
                    available_compute_resource:[].concat(node_mapping.node_mapping_get_info().available_compute_resource),
                    node_mapping_log:[].concat(node_mapping.node_mapping_get_info().node_mapping_log)
                }));*/
                
            }
            return {
                result_flag:result_flag,
                signal_flag:signal_flag,
                node_ref:node_ref,
                relation_ref:relation_ref,
                signals:sigs
            };
        }

        co(g_node_map).then(function(data){
            resolve(data);
        }).catch(function(err){
            reject(err);
        });
    });
};
