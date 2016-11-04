var Matrix = require('ml-matrix');
var array_stuff = require('./neo4j_operation/db_helpers').array_stuff;
var dcopy = require('deep-copy');

function spectrum_distribute_with_LFH(occupied_num,resource_list,rows,columns,time,duration){
    //注意，reource_list是一维数组
    var result_flag=false,result_list,sub_list,matrix,sub_matrix,index;
    matrix = Matrix.from1DArray(rows,columns,resource_list);
    for(let i = 0;i<columns-occupied_num+1;i++){
        let sum = matrix.subMatrix(0,rows-1,i,i+occupied_num-1).sum();
        if(sum == 0){
            index = i;
            result_flag = true;
            break;
        }
    }
    if(result_flag){
        sub_list = array_stuff(rows*occupied_num,{start:time,end:time+duration});
        sub_matrix = Matrix.from1DArray(rows,occupied_num,sub_list);
        matrix.setSubMatrix(sub_matrix,0,index);
        result_list = matrix.to2DArray();
    }else{
        result_list = matrix.to2DArray();
    }
    return {
        result_list:dcopy(result_list),
        result_flag:result_flag
    }
}

module.exports = {
    spectrum_distribute_with_LFH:spectrum_distribute_with_LFH
};
