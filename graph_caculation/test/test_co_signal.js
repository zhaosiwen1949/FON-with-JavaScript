var co = require('co');
var get_signal = require('../graph_promise/http_promise');
var signal = require('../settings').signal;

function * g_signal(){
    var num = 100,fails = 0,successes = 0,data,signals;
    while(num>0){
        data = yield get_signal('POST','/get_signal',{signal_settings:signal});
        signals = data['signals'];
        if(signals == false){
            fails++;
        }else{
            successes++;
        }
        num--;
    }
    console.log({fails:fails,successes:successes});
}

co(g_signal);
