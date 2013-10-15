(function (global, define) {
	"use strict";

	define(function() {

		return function (callback) {
			var doc = global.document,
				html = doc.documentElement,
				body = doc.body,
				fakeBody = body || doc.createElement("body"),
				div = doc.createElement("div"),
				span = doc.createElement("span"),
				overflow,
				style = "&#173;<style>{{css}}</style>",
				formats = ["woff", "ttf", "svg"],
				support = {
						woff: false,
						ttf: false,
						svg: false
					};

			span.innerHTML = ".";

			(body ? div : fakeBody).innerHTML += style;
			fakeBody.appendChild(div);
			if (!body) {
				fakeBody.style.background = "";
				fakeBody.style.overflow = "hidden";
				overflow = html.style.overflow;
				html.style.overflow = "hidden";
				html.appendChild(fakeBody);
			}

			var i = 0,
				l = formats.length,
				countdown = l,
				clones = [],
				detected,
				start = new Date(),
				timeout = 2000;

			while (i < l) {
				(function (format, clone) {
					clone.className = "test-" + format;
					clones.push(clone);
					div.appendChild(clone);
				}(formats[i++], span.cloneNode(true)));
			}

			(function check() {
				var i = 0;
				while (i < l) {
					if (clones[i].offsetWidth == 10) {
						detected = true;
						support[formats[i]] = true;
					}
					i++;
				}
				if (detected || new Date() - start > timeout) {
					cleanup();
				}
				else {
					setTimeout(check, 100);
				}
			}());

			function cleanup() {
				if (!body) {
					fakeBody.parentNode.removeChild(fakeBody);
					html.style.overflow = overflow;
				} else {
					div.parentNode.removeChild(div);
				}
				callback(support);
			}
		}
	});

}(this, typeof define == "function" && define.amd ? define : function(factory) { this.fontSupport = factory() } ));