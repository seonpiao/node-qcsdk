var express = require('express');
var jade = require('jade');
var path = require('path');
var fs = require('fs');
var uglifyjs = require('uglify-js');
global.beautify = function(code){
    var ast = uglifyjs.parse(code);
    var stream = uglifyjs.OutputStream({
        beautify:true
    });
    ast.print(stream);
    return stream.toString();
}

var app = express();

app.use(express.static(__dirname + '/static/dist'));

app.get('/:name?',function(req,res){
    var name = req.params.name;
    var tmplPath = path.join(__dirname,'tmpls/main.jade');
    var dataFilePath = path.join(__dirname,'docs/instance.json');
    var dataFile = fs.readFileSync(dataFilePath,{
        encoding:'utf8'
    });
    var data = JSON.parse(dataFile);
    var tmpl = fs.readFileSync(tmplPath,{
        encoding:'utf8'
    });
    var render = jade.compile(tmpl,{
        filename:path.join(__dirname,'tmpls/main.jade'),
        pretty:true
    });
    var html = render(data);
    res.send(html);
});

app.listen(3000);