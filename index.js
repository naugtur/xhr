var extend = require("xtend")
    , once = require("once")
    , Base = window.XDomainRequest ?
        window.XDomainRequest :
        window.XMLHttpRequest

createXHR.defaults = {}

module.exports = createXHR

function createXHR(options, callback) {
    options = extend({}, createXHR.defaults, options)
    callback = once(callback)

    var xhr = new Base()
        , load = call(xhr, callback)

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
