var get_signal = require('./graph_promise/get_signal');

get_signal().then(function(data){
    console.log(data);
    console.log(data.signals[0].sig_list);
    console.log(data.signals[1].sig_graph);
});
