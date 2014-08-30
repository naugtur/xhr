# xhr

A small xhr wrapper. Designed for use with [browserify](http://browserify.org/).

[![browser support](https://ci.testling.com/raynos/xhr.png)](https://ci.testling.com/Raynos/xhr)

## Example

```js
var xhr = require("xhr")

xhr({
    body: someJSONString,
    uri: "/foo",
    headers: {
        "Content-Type": "application/json"
    }
}, function (err, resp, body) {
    // resp === xhr
    // check resp.body or resp.statusCode
})
```

## `var req = xhr(options, callback)`

```js
type XhrOptions = String | {
    useXDR: Boolean?,
    sync: Boolean?,
    uri: String,
    url: String,
    method: String?,
    timeout: Number?,
    headers: Object?,
    body: String?,
    json: Object?,
    withCredentials: Boolean?,
    response: Boolean?
}
xhr := (XhrOptions, Callback<Response>) => Request
```
the returned object is either an [`XMLHttpRequest`][3] instance
    or an [`XDomainRequest`][4] instance (if on IE8/IE9 &&
    `options.useXDR` is set to `true`)

Your callback will be called once with the arguments
    ( [`Error`][5], `response` , `body` ) where the response is depending on
    `options.response` and body will be either
    [`xhr.response`][6], [`xhr.responseText`][7] or
    [`xhr.responseXML`][8] depending on the request type.

Your callback will be called with an [`Error`][5] if the
    resulting status of the request is either `0`, `4xx` or `5xx`

If `options` is a string then it's a short hand for
    `{ method: "GET", uri: string }`

### `options.method`

Specify the method the [`XMLHttpRequest`][3] should be opened
    with. Passed to [`xhr.open`][2]. Defaults to "GET"

### `options.response`
Specify the format of the response. Defaults to return the xhr/xdr-object
    with body, headers and status-properties added. When set to `true` a special response
    object is returned that includes parsed response headers, status and body.
    `options.response` must be set to `true` for IE8 support.

### `options.useXDR`

Specify whether this is a cross origin (CORS) request for IE<10.
    Switches IE to use [`XDomainRequest`][4] instead of `XMLHttpRequest`.
    Ignored in other browsers.
    
Note that headers cannot be set on an XDomainRequest instance.

### `options.sync`

Specify whether this is a synchrounous request. Note that when
    this is true the callback will be called synchronously. In
    most cases this option should not be used. Only use if you
    know what you are doing!

### `options.body`

Pass in body to be send across the [`XMLHttpRequest`][3].
    Generally should be a string. But anything that's valid as
    a parameter to [`xhr.send`][1] should work

### `options.uri` or `options.url`

The uri to send a request too. Passed to [`xhr.open`][2]. `options.url` and `options.uri` are aliases for each other.

### `options.headers`

An object of headers that should be set on the request. The
    key, value pair is passed to [`xhr.setRequestHeader`][9]

### `options.timeout`

A numeric timeout to use for this xhr request. Defaults to 5
    seconds. Ignored when `options.sync` is true.

### `options.json`

A valid JSON serializable value to be send to the server. If this
    is set then we serialize the value and use that as the body.
    We also set the Content-Type to `"application/json"`.

Additionally the response body is parsed as JSON

### `options.withCredentials`

Specify whether user credentials are to be included in a cross-origin
    request. Sets [`xhr.withCredentials`][10]. Defaults to false.
    
For backward-compatibility defaults to true
    when deprecated `options.cors` is also true.

A wildcard `*` cannot be used in the `Access-Control-Allow-Origin` header when `withCredentials` is true. 
    The header needs to specify your origin explicitly or browser will abort the request.
    

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
  [10]: http://xhr.spec.whatwg.org/#the-withcredentials-attribute
