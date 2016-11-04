var co = require('co');
var single_mapping = require('./single_mapping');

function* g(){
    var num = 1000;
    var success_num = 0;
    var signal_num = 0;
    var result;

    for(let i=0;i<num;i++){
        result = yield single_mapping(i+1);
        let signal_flag_array = result.signal_flag;
        let result_flag_array = result.result_flag;
        for(let j=0;j<signal_flag_array.length;j++){
            if(signal_flag_array[j]){
                signal_num++;
                if(result_flag_array[j]){
                    success_num++;
                }
            }
        }
        /*
        if(result.signal_flag){
            signal_num++;
            if(result.result_flag){
                success_num++;
            }
        }*/
    }
    return {signal_num:signal_num,success_num:success_num}
}

co(g).then(function(data){
    console.log(new Date()+'  '+' 总共产生信号：'+data.signal_num+'  '+' 总共成功次数：'+data.success_num);
}).catch(function(err){
    console.log(err);
});
