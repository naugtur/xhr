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
    xhr.open(options.method, options.uri)

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
