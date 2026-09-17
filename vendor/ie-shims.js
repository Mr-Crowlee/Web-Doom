/* ES5 shims for IE11 (including Compatibility View with documentMode 11). */
(function () {
  if (!window.console) {
    window.console = {};
  }
  if (typeof console.log !== "function") {
    console.log = function () {};
  }
  if (typeof console.error !== "function") {
    console.error = function () {};
  }
  if (typeof console.warn !== "function") {
    console.warn = console.log;
  }

  if (!window.performance) {
    window.performance = {};
  }
  if (typeof performance.now !== "function") {
    var perfStart = new Date().getTime();
    performance.now = function () {
      return new Date().getTime() - perfStart;
    };
  }

  if (typeof Math.imul !== "function") {
    Math.imul = function (a, b) {
      a = a | 0;
      b = b | 0;
      var ah = (a >>> 16) & 0xffff;
      var al = a & 0xffff;
      var bh = (b >>> 16) & 0xffff;
      var bl = b & 0xffff;
      return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0) | 0) | 0;
    };
  }

  if (typeof Math.clz32 !== "function") {
    Math.clz32 = function (x) {
      x = x >>> 0;
      if (x === 0) {
        return 32;
      }
      return 31 - (Math.log(x) / Math.LN2 | 0);
    };
  }

  if (typeof Math.fround !== "function") {
    if (typeof Float32Array !== "undefined") {
      var f32 = new Float32Array(1);
      Math.fround = function (x) {
        f32[0] = x;
        return f32[0];
      };
    } else {
      Math.fround = function (x) {
        return x;
      };
    }
  }

  if (typeof Math.trunc !== "function") {
    Math.trunc = function (v) {
      return v < 0 ? Math.ceil(v) : Math.floor(v);
    };
  }

  var typed = [
    "Int8Array", "Uint8Array", "Uint8ClampedArray",
    "Int16Array", "Uint16Array",
    "Int32Array", "Uint32Array",
    "Float32Array", "Float64Array"
  ];
  var methods = ["forEach", "map", "slice", "every", "some", "reduce", "indexOf", "filter"];
  var i, j, Ctor, proto, name;
  for (i = 0; i < typed.length; i++) {
    Ctor = window[typed[i]];
    if (!Ctor) {
      continue;
    }
    proto = Ctor.prototype;
    for (j = 0; j < methods.length; j++) {
      name = methods[j];
      if (typeof proto[name] !== "function" && typeof Array.prototype[name] === "function") {
        proto[name] = Array.prototype[name];
      }
    }
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame =
      window.msRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (cb) {
        return window.setTimeout(function () {
          cb(performance.now());
        }, 16);
      };
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame =
      window.msCancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      function (id) {
        window.clearTimeout(id);
      };
  }

  if (typeof window.URL === "undefined" && typeof window.webkitURL !== "undefined") {
    window.URL = window.webkitURL;
  }

  /* SDL already skips audio when AudioContext is missing; keep it that way. */
})();
