/**
 *  Copyright (c) Facebook, Inc. and its affiliates.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/**
 * Provided a duration and a function, returns a new function which is called
 * `duration` milliseconds after the last call.
 */
export default function debounce(duration, fn) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      fn.apply(this, arguments);
    }, duration);
  };
}
