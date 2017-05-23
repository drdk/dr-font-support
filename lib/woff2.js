var fs = require("fs");
var path = require("path");
var ttf2woff2 = require("ttf2woff2");

function convert (file, callback) {

	var filebase = path.basename(file, path.extname(file));

	var ttf = fs.readFile(file, function (err, data) {

		if (err) {
			throw(err);
		}

		var woff2Data = ttf2woff2(data);

		fs.writeFile(filebase + ".woff2", woff2Data, function (err) {

			if (err) {
				throw(err);
			}
			callback(null, filebase + ".woff2");
		});

	});

}

module.exports = convert;
