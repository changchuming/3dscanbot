//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------

var fs = require("fs"),
    formidable = require("formidable"),
    image_path = "uploads/test.png",
    util = require('util'),
    path = require('path');

var start = function (request,response){

    console.log("Request handler 'start' was called");

    var body = '<form action="/upload" enctype="multipart/form-data" method="post">' +
        '<input type="text" name="title"><br>' +
        '<input type="file" name="upload"><br>' +
        '<input type="submit" value="Upload">' +
        '</form>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
};

var upload = function (request,response){
	console.log("Request handler 'upload' was called");

	console.log(request.files);
	
    /*
    var form = new formidable.IncomingForm(),
        files = [],
        fields = [];

    console.log("About to parse");

    form.uploadDir = 'uploads/';
    
    form.on('fileBegin', function(name, file) {
    	console.log("starting to parse");
    });

    form.on('end', function () {
        console.log('-> upload done');
        fs.rename(this.openedFiles[0].path,image_path);

        response.writeHead(200, {'content-type': 'text/html'});
        response.write('This file was uploaded <br/>' + '<img src="/show">');
        response.end();
    });
    form.parse(request);
    */
    
    
    
    var form = new formidable.IncomingForm();

    form.parse(request, function(err, fields, files) {
      //response.writeHead(200, {'content-type': 'text/plain'});
      //response.write('received upload:\n\n');
      //response.end(util.inspect({fields: fields, files: files}));
      
      // `file` is the name of the <input> field of type `file`
        var old_path = files.file.path,
            file_size = files.file.size,
            file_ext = files.file.name.split('.').pop(),
            index = old_path.lastIndexOf('/') + 1,
            file_name = old_path.substr(index),
            new_path = path.join(process.env.PWD, '/uploads/', file_name + '.' + file_ext);
 
        fs.readFile(old_path, function(err, data) {
            fs.writeFile(new_path, data, function(err) {
                fs.unlink(old_path, function(err) {
                    if (err) {
                        response.status(500);
                        response.json({'success': false});
                    } else {
                        response.status(200);
                        response.json({'success': true});
                    }
                });
            });
        });
      
      console.log("uploading");
    });
    
    console.log("upload finished");
    
    return;
    
    
};


var show = function (request,response){
	console.log("Request handler 'show' was called.");
    fs.readFile(image_path, "binary", function (error, file) {
        if (error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": "image/png"});
            response.write(file, "binary");
            response.end();
        }
    });
}

exports.start = start;
exports.upload = upload;
exports.show = show;