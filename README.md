dr-font-support
===============

Clientside script to detect woff, ttf or svg font support.

The detection method is selfcontained and exposed via UMD as a function that accepts a callback. It clocks in at 5.5kb minified and 2.8kb gzipped.

Note: eot detection has been left out on purpose as browser that would otherwise require eot fonts (<IE9) have either no support for datauris or very little (IE8 only supports 32kb) - making detection more or less useless.

## Usage

### Vanilla JS

```javascript
fontSupport(function (support) {
  if (support.woff) {
    // woff is supported
  } 
  if (support.ttf) {
    // ttf is supported
  } 
  if (support.svg) {
    // svg is supported
  } 
});
```

### AMD

```javascript
require(["font-support"], function (fontSupport) {
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
