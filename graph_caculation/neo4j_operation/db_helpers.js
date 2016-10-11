function array_stuff(arr,len,content){
    for(var i=0;i<len;i++){
        arr.push(content);
    }
    return arr;
}

module.exports = {
    array_stuff:array_stuff
};
