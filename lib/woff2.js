var fs = require("fs");
var path = require("path");
//var request = require("request");//require("superagent");

function convert (file, callback) {

	var url = "http://188.226.250.76";

	var filebase = path.basename(file, path.extname(file));

	/*
	fs.readFile(file, function (err, data) {
		if (err) {
			throw(err);
		}

		var options = {
			headers: {
				"Content-Type": "font/ttf",
				"Accept": "font/woff2"
			},
			body: data.toString()
		};

		request.post(url, options, callback);

	});
	var req = request
		.post("http://188.226.250.76")
		.type("font/ttf")
		.accept("font/woff2")
		.on("error", function () {
			console.log("stuff happened");
		});

	stream.pipe(req, {end: false});

	stream.on('data', function() {
		console.log("converting:", file);
	});

	stream.on('end', function() {
		console.log("ended converting:", file);
		req.end(function (result) {
			console.log("ready to write file", result);
			callback(result.body);
		});
	});
	*/
/*
	fs.readFile(file, function (err, data) {
		if (err) {
			throw(err);
		}

		

	});
	*/

	var execFile = require("child_process").execFile;
	if (/^win/.test(process.platform)) {
		execFile(
			"powershell.exe",
			[
				"Invoke-RestMethod",
				"-InFile \"" + file + "\"",
				"-OutFile \"" + filebase + ".woff2\"",
				"-ContentType \"font/ttf\"",
				"-Headers @{\"accept\"=\"font/woff2\"}",
				"-Method POST",
				"-Uri http://188.226.250.76"
			],
			function () {
				callback(null, filebase + ".woff2");
			}
		);
	}
	else {
		execFile(
			"curl",
			[
				"--data-binary \"@" + file + "\"",
				"-o \"" + filebase + ".woff2\"",
				"-H \"Content-Type: font/ttf\"",
				"-H \"Accept: font/woff2\"",
				"-X POST http://188.226.250.76"
			],
			function () {
				callback(null, filebase + ".woff2");
			}
		);
	}

}

module.exports = convert;