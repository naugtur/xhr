# xhr

A small xhr wrapper

## Example

    var xhr = require("xhr")

    xhr({
        method: "GET",
        data: someJSON,
        uri: "/foo",
        headers: {
            "Content-Type": "application/json"
        }
    }, function (err, result) {
        // this === xhr
    })

## `var req = xhr(options, callback)`

the returned object is either an [`XMLHttpRequest`][3] instance
    or an [`XDomainRequest`][4] instance (if on IE8/IE9)

Your callback will be called once with the arguments ( [`Error`][5]
    , `response` , `body` ) where response is the context of the xhr request
    and body will be either
    [`xhr.response`][6], [`xhr.responseText`][7] or
    [`xhr.responseXML`][8] depending on the request type.

Your callback will be called with an [`Error`][5] if the
    resulting status of the request is either `0`, `4xx` or `5xx`

### `options.method`

Specify the method the [`XMLHttpRequest`][3] should be opened
    with. Passed to [`xhr.open`][2]

### `options.cors`

Specify whether this is a cross domain request. Used in IE<10
    to use `XDomainRequest` instead of `XMLHttpRequest`. If not
    specified the library will pick `XDomainRequest` if the uri
    has a protocol.

### `options.data`

Pass in data to be send across the [`XMLHttpRequest`][3].
    Generally should be a string. But anything that's valid as
    a parameter to [`xhr.send`][1] should work

### `options.status`

Set this to `false` if you do not want this module to turn
    a status code of 4xx, 5xx or 0 into an error.

### `options.uri`

The uri to send a request too. Passed to
    [`xhr.open`][2]

### `options.headers`

An object of headers that should be set on the request. The
    key, value pair is passed to [`xhr.setRequestHeader`][9]

## MIT Licenced

  [1]: http://xhr.spec.whatwg.org/#the-send()-method
  [2]: http://xhr.spec.whatwg.org/#the-open()-method
  [3]: http://xhr.spec.whatwg.org/#interface-xmlhttprequest
  [4]: http://msdn.microsoft.com/en-us/library/ie/cc288060(v=vs.85).aspx
  [5]: http://es5.github.com/#x15.11
  [6]: http://xhr.spec.whatwg.org/#the-response-attribute
  [7]: http://xhr.spec.whatwg.org/#the-responsetext-attribute
  [8]: http://xhr.spec.whatwg.org/#the-responsexml-attribute
  [9]: http://xhr.spec.whatwg.org/#the-setrequestheader()-method
