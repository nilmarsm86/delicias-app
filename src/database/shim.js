// src/database/shim.js
// Polyfill para promisify en React Native
if (global.process?.version === undefined) {
  global.process = {
    ...global.process,
    version: 'v16.0.0',
    nextTick: (fn) => setTimeout(fn, 0)
  };
}

if (!global.util?.promisify) {
  global.util = {
    ...global.util,
    promisify: (fn) => {
      return function(...args) {
        return new Promise((resolve, reject) => {
          fn(...args, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
        });
      };
    }
  };
}