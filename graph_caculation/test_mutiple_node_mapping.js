var co = require('co');
var test_node_mapping = require('./test_node_mapping');

function* g(){
    var num = 1000;
    var success_num = 0;
    var signal_num = 0;
    var result;

    for(let i=0;i<num;i++){
        result = yield test_node_mapping(i+1);
        if(result.signal_flag){
            signal_num++;
            if(result.result_flag){
                success_num++;
            }
        }
    }
    return {signal_num:signal_num,success_num:success_num}
}

co(g).then(function(data){
    console.log(data);
}).catch(function(err){
    console.log(err);
});
