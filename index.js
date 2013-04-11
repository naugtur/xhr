/*global window*/
var extend = require("xtend")
    , once = require("once")

    , protocolLess = /^\/\/[^\/]+\//
    , hasProtocol = /^https?:\/\//
    , messages = {
        "0": "Internal XMLHttpRequest Error"
        , "4": "4xx Client Error"
        , "5": "5xx Server Error"
    }
    , _window = typeof window === "undefined" ? {} : window
    , XHR = _window.XMLHttpRequest || noop
    , XDR = "withCredentials" in (new XHR()) ?
        _window.XMLHttpRequest : _window.XDomainRequest

createXHR.defaults = {}

module.exports = createXHR

function createXHR(options, callback) {
    options = extend({}, createXHR.defaults, options)
    callback = once(callback)

    var xhr
        , uri = options.uri

    if ("cors" in options) {
        if (options.cors) {
            xhr = new XDR()
            xhr.withCredentials = true
        } else {
            xhr = new XHR()
        }
    } else {
        if (protocolLess.test(uri) || hasProtocol.test(uri)) {
            xhr = new XDR()
            xhr.withCredentials = true
        } else {
            xhr = new XHR()
        }
    }

    var load = options.status === false ? call(xhr, callback) :
            callWithStatus(xhr, callback)

    xhr.onreadystatechange = readystatechange
    xhr.onload = load
    xhr.onerror = error
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
    }
    xhr.ontimeout = noop
    xhr.open(options.method, uri)
    xhr.timeout = "timeout" in options ? options.timeout : 5000

    if (options.headers && xhr.setRequestHeader) {
        Object.keys(options.headers).forEach(function (key) {
            xhr.setRequestHeader(key, options.headers[key])
        })
    }

    xhr.send(options.data)

    return xhr

    function readystatechange() {
        this.readyState === 4 && load()
    }

    function error(evt) {
        callback.call(this, evt)
    }
}

function call(self, callback) {
    return function () {
        callback.call(self, null, self.response ||
            self.responseText || self.responseXML)
    }
}

function callWithStatus(self, callback) {
    return function () {
        if (self.status === 0 ||
            (self.status >= 400 && self.status < 600)
        ) {
            var message = self.responseText ||
                    messages[String(self.status).charAt(0)]
                , error = new Error(message)

            error.statusCode = self.status

            return callback.call(self, error, self.response ||
                self.responseText || self.responseXML)
        }

        callback.call(self, null, self.response ||
            self.responseText || self.responseXML)
    }
}

function noop() {}
