var fs = require("fs");
var path = require("path");

var async = require("async");
var CleanCSS = require("clean-css");
var inline = require("dr-webfont-inliner");

var ttf = require("./lib/ttf");
var woff = require("./lib/woff");
var woff2 = require("./lib/woff2");

var ttfpatch = require("nodettfpatch");

var file = "./test-webfont.svg";

var filebase = path.basename(file, path.extname(file));

fs.readFile(file, {encoding: "utf8"}, function (err, svg) {

	if (err) {
		throw(err);
	}

	ttf(file, svg, function () {

		var ttffile = filebase + ".ttf";

		async.parallel({
			woff: function (callback) {
				woff(ttffile, callback);
			},
			woff2: function (callback) {
				woff2(ttffile, callback);
			}
		}, function () {


			ttfpatch(ttffile, 0);

			async.parallel({
				js: function (callback) {
					fs.readFile("index_template.js", {encoding: "utf8"}, callback);
				},
				css: function (callback) {
					inline("fonts.css", function (css) {
						callback(null, css);
					});
				}
			},
			function (err, results) {

				if (err) {
					throw(err);
				}

				results.css = new CleanCSS().minify(results.css);
				results.js = results.js.replace("{{css}}", results.css.styles.replace(/"/g, "\\\""));
				fs.writeFile("index.js", results.js);

			});

		});

	});


});
