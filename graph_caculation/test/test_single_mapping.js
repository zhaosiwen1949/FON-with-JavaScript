var co = require('co');
var single_mapping = require('../single_mapping');

function* g_test_single_mapping(){
    let num = 5;
    for (let n = 1;n<=num;n++){
        let result;
        result = yield single_mapping(n);
        console.log("============================");
        console.log("第"+n+"次分配：");
        for (let i = 0;i<result.node_ref.length;i++){
            console.log("###########################");
            console.log("是否有信号到来："+result.signal_flag[i]);
            console.log("是否分配成功："+result.result_flag[i]);
            if(result.signal_flag[i] == true){
                //信号情况统计
                console.log("第"+i+"个信号为：");
                console.log("持续时间："+result.signals[i]['duration']);
                console.log("信号列表："+result.signals[i]['sig_list']);
                console.log("信号图形：");
                let sig_graph = result.signals[i]['sig_graph']
                for(let i = 0;i<sig_graph.length;i++){
                    for(let j = i;j<sig_graph.length;j++){
                        if(sig_graph[i][j]>0){
                            console.log("链路"+i+"-"+j+"的频谱资源占用是："+sig_graph[i][j]);
                        }
                    }
                }
                //计算资源情况统计
                console.log("第"+i+"个信号处理后："+"节点计算资源占用情况：");
                for (let index = 0;index<result.node_ref[i].occupied_compute_resource.length;index++){
                    console.log((index+1)+": ");
                    console.log(result.node_ref[i].occupied_compute_resource[index]);
                }
                console.log("节点计算资源可用情况：");
                for (let index = 0;index<result.node_ref[i].available_compute_resource.length;index++){
                    console.log("节点"+(index+1)+"可用资源数量是："+result.node_ref[i].available_compute_resource[index]);
                }
                /*
                console.log("节点计算资源回复日志情况：");
                console.log("资源占用日志：");
                for(let i = 0;i<result.node_ref[i].node_mapping_log[0].node_mapping_occupied_resource_list.length;i++){
                    console.log("节点"+(i+1)+"的资源占用日志是："+result.node_ref[i].node_mapping_log[0].node_mapping_occupied_resource_list[i]);
                }*/
                console.log("计算资源可用日志："+result.node_ref[i].node_mapping_log[0].node_mapping_available_resource_list);
                //频谱资源情况统计
                let available_spectrum_resource_number = result.relation_ref[i].available_spectrum_resource_number;
                console.log("频谱资源使用情况：");
                for(let index in available_spectrum_resource_number){
                    console.log("链路"+index+"的频谱可用资源为："+available_spectrum_resource_number[index]);
                }
            }else{
              console.log("无信号到来");
            }
        }
    }    
}

co(g_test_single_mapping).
    then(function(data){
        console.log("运行完成！！");
}).
    catch(function(err){
        console.log(err);
});
