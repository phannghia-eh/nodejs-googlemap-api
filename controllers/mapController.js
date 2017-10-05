//require dependencies
var qStr = require('querystring'),
    http = require('http');
//renders the form/index page
exports.start = function(req, res) {
    res.render('index.jade',
        {layout : false,
            title : "Test",
            scripts : {source : __dirname + "/assets/handleSearch.js"}});
}
//queries API and returns JSON encoded response to be parsed by jQuery
exports.slugSearch = function(req, res) {
    var reqBody = "";
    var reqJSON = "";

    var apiKey = "API KEY",
        client = "CLIENT ID",
        place = req.body.location,
        options = {
            host: 'maps.google.com',
            port: 80,
            path: '/maps/geo?'+
            qStr.stringify({"q":place}) +
            '&output=json&oe=utf8/&sensor=false&key='
            +apiKey
        };

    http.get(options, function(mapsResponse) {
        mapsResponse.setEncoding("utf8");

        mapsResponse.on("data", function(chunk) {
            reqBody += chunk;
        });
        mapsResponse.on("end", function() {
            res.send(reqBody);
        });
    });
}