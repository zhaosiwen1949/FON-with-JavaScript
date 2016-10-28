var get_signal = require('../graph_promise/http_promise');
var signal = require('../settings').signal;

var obj;

function test(num,fails,successes){
    var num = num, fails = fails, successes = successes;
    get_signal('POST','/get_signal',{signal_settings:signal}).then(function(data){
        if(num == 0){
            obj = {fails:fails,successes:successes};
            console.log(obj);
        }else{
            var signals = data['signals'];
            if(signals == false ){
                fails++;
            }else{
                successes++;    
            }
            num--;
            test(num,fails,successes);
        }
    }).catch();
}

test(300,0,0) 

