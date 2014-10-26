(function (global, define) {
	"use strict";

	define(function() {
	
		var doc = global.document;
		var html = doc.documentElement;
		var body, fakeBody, div, span;
		var overflow;
		var style = "&#173;<style>{{css}}</style>";
		var formats = ["woff2", "woff", "ttf", "svg"];
		var isComplete = false;
		var isRunning = false;
		var callbacks = [];
		var support = {};

		return function (callback, returnOption) {

			if (isComplete) {
				handleCallbacks();
			}
			else {
			
				callbacks.push({callback: callback, option: returnOption || null});
				
				if (isRunning) {
					return;
				}
				
				detect();
			}

		};
		
		function formatResult (option) {
			var result;
			if (!option) {
				result = support;
			}
			else if (typeof option == "string") {
				result = support[option];
			}
			else {
				result = [];
				var i = 0;
				var l = option.length;
				while (i < l) {
					(function (format) {
						if (support[format]) {
							result.push(format);
						}
					}(option[i++]));
					i++;
				}
				result = 0 in result && result[0] || null;
			}
			return result;
		}
		
		function handleCallbacks () {
			var data;
			while (callbacks.length) {
				data = callbacks.shift();
				data.callback(formatResult(data.option));
			}
		}
		
		function detect () {
			isRunning = true;
			body = doc.body,
			fakeBody = body || doc.createElement("body"),
			div = doc.createElement("div"),
			span = doc.createElement("span"),

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

			var i = 0;
			var l = formats.length;
			var countdown = l;
			var clones = [];
			var detected;
			var start = new Date();
			var timeout = 2000;

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
				if (detected) {
					isComplete = true;
					cleanup();
				}
				else if (new Date() - start > timeout) {
					cleanup();
				}
				else {
					setTimeout(check, 100);
				}
			}());
		}
		
		function cleanup() {
			if (!body) {
				fakeBody.parentNode.removeChild(fakeBody);
				html.style.overflow = overflow;
			} else {
				div.parentNode.removeChild(div);
			}
			handleCallbacks();
			isRunning = false;
		}
		
	});

}(window, typeof define == "function" && define.amd ? define : function(factory) { window.fontSupport = factory() } ));