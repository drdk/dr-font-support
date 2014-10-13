var fs = require("fs");
var path = require("path");

function convert (file, callback) {

	var url = "http://188.226.250.76";

	var filebase = path.basename(file, path.extname(file));

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