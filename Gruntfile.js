/*global module:false*/
module.exports = function(grunt) {
	var fs = require("fs");
	var path = require("path");
	var cleanCSS = require("clean-css");
	var inline = require("dr-webfont-inliner");

	var fontName = "test-webfont";
	var stylesheet = "fonts.css";

	// Project configuration.
	grunt.initConfig({
		// Task configuration.
		uglify: {
			options: {
				compress: true/*,
				mangle: true
				*/
			},
			"default": {
				files: {
					"index-min.js": ["index.js"]
				}
			}
		},
		clean: ["test-webfont.ttf", "test-webfont.woff", "test-webfont.woff2", "fonts-inline.css"]
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-clean");

	grunt.registerTask("build-ttf", "Build Truetype font from SVG.", function () {
		var svg2ttf = require("svg2ttf");
		var svg = fs.readFileSync(fontName + ".svg", {encoding: "utf8"});
		var ttf = svg2ttf(svg);
		fs.writeFileSync(fontName + ".ttf", ttf.buffer);
	});

	grunt.registerTask("build-woff", "Build Woff font from Truetype font.", function () {
		var done = this.async();
		var ttf2woff = require("ttf2woff");
		var ttf = fs.readFileSync(fontName + ".ttf");
		ttf2woff(ttf, {}, function (err, woff) {
			fs.writeFileSync(fontName + ".woff", woff.buffer);
			done();
		});
	});

	grunt.registerTask("build-woff2", "Build Woff2 font from Truetype font.", function () {
		var execFile = require("child_process").execFile;
		var done = this.async();
		if (/^win/.test(process.platform)) {
			execFile(
				"powershell.exe",
				[
					"Invoke-RestMethod",
					"-InFile \"" + fontName + ".ttf\"",
					"-OutFile \"" + fontName + ".woff2\"",
					"-ContentType \"font/ttf\"",
					"-Headers @{\"accept\"=\"font/woff2\"}",
					"-Method POST",
					"-Uri http://188.226.250.76"
				],
				function () {
					done();
				}
			);
		}
		else {
			execFile(
				"curl",
				[
					"--data-binary \"@" + fontName + ".ttf\"",
					"-o \"" + fontName + ".woff2\"",
					"-H \"Content-Type: font/ttf\"",
					"-H \"Accept: font/woff2\"",
					"-X POST http://188.226.250.76"
				],
				function () {
					done();
				}
			);
		}
	});

	grunt.registerTask("inline-fonts", "Inline fonts into stylesheet", function () {
		inline(stylesheet);
	});

	grunt.registerTask("inline-css", "Inline CSS into script", function () {
		var js = fs.readFileSync("index_template.js", {encoding: "utf8"});
		var css = fs.readFileSync("fonts-inline.css", {encoding: "utf8"});
		css = cleanCSS.process(css);
		js = js.replace("{{css}}", css.replace(/"/g, "\\\""));
		fs.writeFileSync("index.js", js);
	});

	// Default task.
	grunt.registerTask("default", ["build-ttf", "build-woff", "build-woff2", "inline-fonts", "inline-css", "uglify", "clean"]);

};
