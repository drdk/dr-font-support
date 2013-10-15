/*global module:false*/
module.exports = function(grunt) {
	var fs = require("fs"),
		path = require("path"),
		cleanCSS = require("clean-css");

	var fontName = "test-webfont",
		stylesheet = "fonts.css";

	// Project configuration.
	grunt.initConfig({
		// Task configuration.
		uglify: {
			options: {
				mangle: false,
				report: "gzip"
			},
			"default": {
				files: {
					"dist/index-min.js": ["dist/index.js"]
				}
			}
		},
		clean: ["test-webfont.ttf", "test-webfont.woff", "fonts-inline.css", "dist/index.js"]
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-clean");

	grunt.registerTask("build-ttf", "Build Truetype font from SVG.", function () {
		var svg2ttf = require("svg2ttf"),
			svg = fs.readFileSync(fontName + ".svg", {encoding: "utf8"}),
			ttf = svg2ttf(svg);
		fs.writeFileSync(fontName + ".ttf", ttf.buffer);
	});

	grunt.registerTask("build-woff", "Build Woff font from Truetype font.", function () {
		var done = this.async(),
			ttf2woff = require("ttf2woff"),
			ttf = fs.readFileSync(fontName + ".ttf");
		ttf2woff(ttf, {}, function (err, woff) {
			fs.writeFileSync(fontName + ".woff", woff.buffer);
			done();
		});
	});

	grunt.registerTask("inline-fonts", "Inline fonts into stylesheet", function () {
		
		var input = stylesheet,
			root = input.replace(/(^|\/)[^\/]+$/, "$1"),
			output = input.replace(/(\.[^.]+)$/, "-inline$1"),
			css = fs.readFileSync(input, {encoding: "utf8"});

		css = css.replace(/(url\(["']?)([^"']+.(woff|ttf|svg))(?:\??#[^"']+)?(["']?\))/g, function (m, cssPrefix, url, type, cssSuffix) {
			url = path.resolve(root, url);
			var data = fs.readFileSync(url),
				mime = {
					woff: "application/x-font-woff",
					ttf: "application/x-font-ttf",
					svg: "image/svg+xml"
				}[type];
			return cssPrefix + "data:" + mime + ";base64," + encodeURIComponent(data.toString('base64')) + cssSuffix;
		});

		fs.writeFileSync(output, css);

	});

	grunt.registerTask("inline-css", "Inline CSS into script", function () {
		var js = fs.readFileSync("index.js", {encoding: "utf8"}),
			css = fs.readFileSync("fonts-inline.css", {encoding: "utf8"});
		css = cleanCSS.process(css);
		js = js.replace("{{css}}", css.replace(/"/g, "\\\""));
		if (!fs.existsSync("dist")) {
			fs.mkdir("dist");
		}
		fs.writeFileSync("dist/" + "index.js", js);
	});

	// Default task.
	grunt.registerTask("default", ["build-ttf", "build-woff", "inline-fonts", "inline-css", "uglify", "clean"]);

};
