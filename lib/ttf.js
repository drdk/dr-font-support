var fs = require("fs");
var path = require("path");
var svg2ttf = require("svg2ttf");

function convert (file, data, callback) {

	var filebase = path.basename(file, path.extname(file));

	var ttf = svg2ttf(data);

	fs.writeFile(filebase + ".ttf", ttf.buffer, function () {
		callback(null, filebase + ".ttf");
	});

}

module.exports = convert;