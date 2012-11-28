/*global window*/
var extend = require("xtend")
    , once = require("once")

    , messages = {
        "0": "Internal XMLHttpRequest Error"
        , "4": "4xx Client Error"
        , "5": "5xx Server Error"
    }
    , Base = window.XDomainRequest ?
        window.XDomainRequest :
        window.XMLHttpRequest

createXHR.defaults = {}

module.exports = createXHR

function createXHR(options, callback) {
    options = extend({}, createXHR.defaults, options)
    callback = once(callback)

    var xhr = new Base()
        , load = options.status === false ? call(xhr, callback) :
            callWithStatus(xhr, callback)

    xhr.onreadystatechange = readystatechange
    xhr.onload = load
    xhr.onerror = error
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
    }
    xhr.ontimeout = noop
    xhr.timeout = "timeout" in options ? options.timeout : 5000
    xhr.open(options.method, options.uri)

    if (options.headers && xhr.setRequestHeader) {
        Object.keys(options.headers).forEach(function (key) {
            xhr.setRequestHeader(key, options.headers[key])
        })
    }

    process.nextTick(send)

    return xhr

    function send() {
        xhr.send(options.data)
    }

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
            (self.status > 400 && self.status < 600)
        ) {
            var message = self.responseText ||
                    messages[String(self.status).charAt(0)]
                , error = new Error(message)

            error.statusCode = self.status

            return callback.call(self, error)
        }

        callback.call(self, null, self.response ||
            self.responseText || self.responseXML)
    }
}

function noop() {}
