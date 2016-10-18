var get_signal = require('./graph_promise/http_promise');
var signal = require('./settings').signal;

get_signal('POST','/get_signal',{signal_settings:signal})
    .then(function(data){
        var signals = data['signals'];
        console.log(signals);
        console.log(signals[0].sig_list);
        console.log(signals[0].sig_graph);
    })
    .catch(function(err){
        console.log(err);
    });
