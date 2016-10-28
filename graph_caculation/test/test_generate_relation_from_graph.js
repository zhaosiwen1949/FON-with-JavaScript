var graph = require('../settings').graph;
var result = new Object();

for(let i = 0;i<graph.length;i++){
    for(let j = 1;j<graph[i].length;j++){
        let a = Math.min(graph[i][0],graph[i][j]),b = Math.max(graph[i][0],graph[i][j]);
        let index = a+"-"+b;
        if(result[index] == undefined){
            result[index] = {
                num:5000,
                list:[0,0,0,0,0]
            };
        }
    }
}

console.log(result);
