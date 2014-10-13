var fs = require("fs");
var path = require("path");
var ttf2woff = require("ttf2woff");

function convert (file, callback) {

	var filebase = path.basename(file, path.extname(file));

	var ttf = fs.readFile(file, function (err, data) {

		if (err) {
			throw(err);
		}

		ttf2woff(data, {}, function (err, woff) {

			if (err) {
				throw(err);
			}
			
			fs.writeFile(filebase + ".woff", woff.buffer, function () {
				callback(null, filebase + ".woff");
			});
		});

	});

}

module.exports = convert;