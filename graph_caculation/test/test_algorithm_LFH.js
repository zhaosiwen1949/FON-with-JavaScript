var LFH = require("../algorithm").spectrum_distribute_with_LFH;

var occupied_num = 4;
var resource_list = [0,0,0,0,0,0,0,{start:1,end:0},0,0,0,0,0,0,0];
var rows = 3;
var columns = 5;
var time = 1;
var duration =29;

var result = LFH(occupied_num,resource_list,rows,columns,time,duration);

console.log(result);
console.log("其中一个分配结果是：");
console.log(result.result_list[0][0]);
