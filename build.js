var fs = require("fs");
var path = require("path");

var async = require("async");
var cleanCSS = require("clean-css");
var inline = require("dr-webfont-inliner");

var ttf = require("./lib/ttf");
var woff = require("./lib/woff");
var woff2 = require("./lib/woff2");

var file = "./test-webfont.svg";

var filebase = path.basename(file, path.extname(file));

fs.readFile(file, {encoding: "utf8"}, function (err, svg) {

	if (err) {
		throw(err);
	}

	ttf(file, svg, function () {

		async.parallel({
			woff: function (callback) {
				woff(filebase + ".ttf", callback);
			},
			woff2: function (callback) {
				woff2(filebase + ".ttf", callback);
			}
		}, function () {
				
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

				results.css = cleanCSS.process(results.css);
				results.js = results.js.replace("{{css}}", results.css.replace(/"/g, "\\\""));
				fs.writeFile("index.js", results.js);

			});

		});

	});


});

