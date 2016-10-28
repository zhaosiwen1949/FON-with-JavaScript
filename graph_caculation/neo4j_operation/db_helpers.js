var Matrix = require('ml-matrix');

function array_stuff(len,content){
    var arr = new Array();
    for(var i=0;i<len;i++){
        arr.push(content);
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
