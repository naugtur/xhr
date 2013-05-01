/*global window*/
var extend = require("xtend")
var once = require("once")

var messages = {
    "0": "Internal XMLHttpRequest Error",
    "4": "4xx Client Error",
    "5": "5xx Server Error"
}

var _window = typeof window === "undefined" ? {} : window
var XHR = _window.XMLHttpRequest || noop
var XDR = "withCredentials" in (new XHR()) ?
        _window.XMLHttpRequest : _window.XDomainRequest

module.exports = createXHR

function createXHR(options, callback) {
    if (typeof options === "string") {
        options = { uri: options }
    }

    options = options || {}
    callback = once(callback)

    var xhr
    var uri = options.uri

    if (options.cors) {
        xhr = new XDR()
        xhr.withCredentials = true
    } else {
        xhr = new XHR()
    }

    xhr.onreadystatechange = readystatechange
    xhr.onload = load
    xhr.onerror = error
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
    }
    xhr.ontimeout = noop
    xhr.open(options.method || "GET", uri)
    xhr.timeout = "timeout" in options ? options.timeout : 5000

    if (options.headers && xhr.setRequestHeader) {
        Object.keys(options.headers).forEach(function (key) {
            xhr.setRequestHeader(key, options.headers[key])
        })
    }

    xhr.send(options.data)

    return xhr

    function readystatechange() {
        xhr.readyState === 4 && load()
    }

    function load() {
        var error = null
        var status = xhr.statusCode = xhr.status
        xhr.body = xhr.response || xhr.responseText || xhr.responseXML

        if (status === 0 || (status >= 400 && status < 600)) {
            var message = xhr.responseText ||
                messages[String(xhr.status).charAt(0)]
            error = new Error(message)

            error.statusCode = xhr.status
        }

        callback(error, xhr, xhr.body)
    }

    function error(evt) {
        callback(evt, xhr)
    }
}


function noop() {}
