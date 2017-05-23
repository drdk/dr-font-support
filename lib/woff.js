var fs = require("fs");
var path = require("path");
var ttf2woff = require("ttf2woff");

function convert (file, callback) {

	var filebase = path.basename(file, path.extname(file));
	console.log("woff: reading ttf");
	var ttf = fs.readFile(file, function (err, data) {

		if (err) {
			throw(err);
		}
		console.log("woff: ttf read");
		var woffData = new Buffer(ttf2woff(data, {}).buffer)

		fs.writeFile(filebase + ".woff", woffData, function (err) {

			if (err) {
				throw(err);
			}
			console.log("woff written");
			callback(null, filebase + ".woff");
		});

	});

}

module.exports = convert;
