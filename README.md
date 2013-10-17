dr-font-support
===============

Clientside script to detect woff, ttf or svg font support.

The detection method is selfcontained and exposed via UMD as a function that accepts a callback. It clocks in at 5.5kb minified and 2.8kb gzipped.

Note: eot detection has been left out on purpose as browser that would otherwise require eot fonts (<IE9) have either no support for datauris or very little (IE8 only supports 32kb) - making detection more or less useless.


## Usage

```
fontSupport(callback /*, returnOption*/)
```

#### Arguments

* `callback [function]` - Once the tests have been run this callback will be executed.
* `returnOption [array|string|null]` - Optional. A format string will return a boolean whether that format is supprted. An array of format strings will return the first listed supported format or null if none of them are supported. Default will return an object with formats as keys with boolean values.


### Vanilla JS

With `returnOption` as null (default):

```javascript
fontSupport(function (supported) {
	  if (supported.woff) {
	    // woff is supported
	  } 
	  if (supported.ttf) {
	    // ttf is supported
	  } 
	  if (supported.svg) {
	    // svg is supported
	  } 
});
```

With `returnOption` as string:

```javascript
fontSupport(function (supported) {
	  if (supported) {
	    // ttf is supported
	  }
}, "ttf");
```

With `returnOption` as an array:

```javascript
fontSupport(function (supported) {
	switch (supported) {
		case "woff":
			// do stuff
			break;
	  		
		case "ttf":
			// do other stuff
			break;
	}
}, ["woff", "ttf"]);
```

### AMD

```javascript
require(["font-support"], function (supported) {
  // see vanilla js usage
});
```

## Build

Install dependencies:

```
npm install
```

Build script:

```
grunt
```

The built script will then be found in "./dist" ready for use.




## Credits

#### Testing
The basic template for testing was hoisted from the [Modernizr](https://github.com/Modernizr/Modernizr) library.

#### Font generation
Uses [svg2ttf](https://github.com/fontello/svg2ttf) and [ttf2woff](https://github.com/fontello/ttf2woff) from [Vitaly](https://github.com/fontello)'s brilliant collection of libraries.