var getContent = require('./utils.js')
var request = require('request')
var http = require('http')
var fs = require('fs');
var url = require('url');

var res;
var req;

module.exports = function init(_res,_req){
    res = _res;
    req = _req;
    console.log("dsdsds")
    var request = url.parse(req.url, true);
    var action = request.pathname;
        // if(action.indexOf('/configuration') != -1 ){
        //     console.log("ds2dsd")
        //     console.log(__dirname+'/mapsData'+ action+".json")
        // fs.readFile(__dirname+'/mapsData'+ action+".json", function(err, data) {
        //     if (err) throw err; // Fail if the file can't be read.

        //         res.writeHead(200, {'Content-Type': 'application/json'});
        //         res.end(data); // Send the file data to the browser.

        //     console.log('Server running at http://localhost:8124/');
        //     });
        // }
        // if(action.indexOf('/json') != -1 ){
        //     console.log("ds2dsd")
        //     console.log(__dirname+'/mapsData'+ action+".json")
        // fs.readFile(__dirname+'/mapsData'+ action+".json", function(err, data) {
        //     if (err) throw err; // Fail if the file can't be read.

        //         res.writeHead(200, {'Content-Type': 'application/json'});
        //         res.end(data); // Send the file data to the browser.

        //     console.log('Server running at http://localhost:8124/');
        //     });
        // }
        if(action.indexOf('/images/') != -1){
            fs.readFile(__dirname+'/mapsData'+action+".png", function(err, data) {
            if (err) throw err; // Fail if the file can't be read.

                res.writeHead(200, {'Content-Type': 'image/png'});
                res.end(data); // Send the file data to the browser.

            console.log('Server running at http://localhost:8124/');
            });
        } else {
            console.log("ds2dsd")
            console.log(__dirname+'/mapsData'+ action+".json")
            fs.readFile(__dirname+'/mapsData'+ action+".json", function(err, data) {
                if (err) throw err; // Fail if the file can't be read.

                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(data); // Send the file data to the browser.

                console.log('Server running at http://localhost:8124/');
                });
        }
        //res.status(400).send("ops, url errada");
}


