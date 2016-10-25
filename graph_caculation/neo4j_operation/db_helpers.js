function array_stuff(len,content){
    var arr = new Array();
    for(var i=0;i<len;i++){
        arr.push(content);
    }
    return arr;
}

module.exports = {
    array_stuff:array_stuff
};
