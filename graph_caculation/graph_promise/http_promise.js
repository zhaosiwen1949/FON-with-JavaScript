var http = require('http');

module.exports = function(method,path,post){
    var option = {
        hostname:'localhost',
        port:5000,
        method:method,
        path:path,
        headers:{
            'Content-Type':'application/json'
        }
    }

    return new Promise(function(resolve,reject){
        http.request(option,function(res){
            var body = '';
            res.setEncoding('utf8');
            if(res.statusCode === 200){
                res.on('data',function(chunk){
                    body += chunk;
                });
                res.on('end',function(chunk){
                    var obj = JSON.parse(body);
                    resolve(obj);
                });
                res.on('err',function(error){
                    reject(error);
                });
            }else{
                res.on('data',function(chunk){
                    body += chunk;
                });
                res.on('end',function(chunk){
                    reject(body);
                });
                res.on('err',function(error){
                    reject(error);
                });
            }
        }).end(JSON.stringify(post));
    });
}
