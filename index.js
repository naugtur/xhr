var extend = require("pd").extend

createXHR.defaults = {}

module.exports = createXHR

function createXHR(options, callback) {
    var options = extend({}, createXHR.defaults, options)
    var xhr = new XMLHttpRequest
    xhr.onreadystatechange = function () {
        if (this.readystate === 4) {
            callback.call(this, null, this.response || 
                this.responseText || this.responseXML)
        }
    }
    xhr.onerror = function (evt) {
        callback.call(this, evt)
    }
    xhr.open(options.method, options.uri)
    if (options.headers) {
        Object.keys(options.headers).forEach(function (key) {
            xhr.setRequestHeader(key, options.headers[key])
        })
    }
    xhr.send(options.data)
    return xhr
}