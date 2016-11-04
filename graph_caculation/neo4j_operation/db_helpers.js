var Matrix = require('ml-matrix');
var dcopy = require('deep-copy');

function array_stuff(len,content){
    var arr = new Array();
    if(typeof(content) == 'object'){
        for(var i=0;i<len;i++){
            let stuff = dcopy(content);
            arr.push(stuff);
        }
    }else if(typeof(content) == 'number'){
        for(var i=0;i<len;i++){
            arr.push(content);
        }
    }else{
        for(var i=0;i<len;i++){
            arr.push(content);
        }
    }
    return arr;
}

function array_2D_to_1D(array_2D){
    var result=[];
    for(let i=0;i<array_2D.length;i++){
        result = result.concat(array_2D[i]);
    }
    return result
}

module.exports = {
    array_stuff:array_stuff,
};
