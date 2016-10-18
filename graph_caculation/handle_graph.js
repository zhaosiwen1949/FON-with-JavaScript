//以下都是伪代码
//对于一次信号源的处理过程，可是如何保证顺序多次执行呢？目前两个方法：
//1、async库
//2、co库结合迭代回调
 
get_signal().then(function(data){
    var handled_signals = handle_signal(data['signals']);
    return handled_signals;
}).then(function(data){
    return new Promise(function(resolve,reject){
        get_nodes(handled_signals,function(nodes){
            //根据信号源信息，获取节点信息，并加以运算
            resolve(nodes);    
        });
    })
}).then(function(data){
    return new Promise(function(resolve,reject){
        get_relations(nodes,function(relations){
            //根据节点信息，获取关系信息，并加以运算
            resolve({nodes:nodes,relations:relations});
        })
    });
}).then(function(data){
    return new Promise(function(resolve,reject){
        //根据节点和关系信息，修改数据库
        change_database(nodes,relations,function(result){
            resolve(result);
        })
    });
});
