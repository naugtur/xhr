var window = require("global/window")
var test = require("tape")

var xhr = require("../index.js")

test("constructs and calls callback without throwing", function (assert) {
    xhr({}, function (err, resp, body) {
        assert.ok(true, "got here")
        assert.end()
    })
})

test("can GET a url", function (assert) {
    xhr({
        headers: {
            accept: "text/html"
        },
        uri: "http://reqr.es/api/stuff"
    }, function (err, resp, body) {
        assert.ifError(err, "no err")
        assert.equal(resp.statusCode, 200)
        assert.equal(typeof resp.rawRequest, "object")
        assert.equal(resp.headers['content-type'].indexOf('application/json'), 0)
        assert.notEqual(resp.body.length, 0)
        assert.notEqual(body.length, 0)
        assert.end()
    })
})

test("Returns http error responses like npm's request", function (assert) {
    xhr({
        headers: {
            accept: "text/html"
        },
        uri: "http://reqr.es/api/stuff/23"
    }, function (err, resp, body) {
        assert.ifError(err, "no err")
        assert.equal(resp.statusCode, 404)
        assert.equal(typeof resp.rawRequest, "object")
        assert.end()
    })
})

test("Times out to an error ", function (assert) {
    xhr({
        headers: {
            accept: "text/html"
        },
        timeout: 1000,
        uri: "http://reqr.es/api/stuff?delay=10"
    }, function (err, resp, body) {
        assert.ok(err instanceof Error, "should return error")
        assert.equal(resp.statusCode, 0)
        assert.end()
    })
})


test("withCredentials option", function (assert) {
    if (!window.XDomainRequest) {
        var req = xhr({}, function () {})
        assert.ok(!req.withCredentials,
            "withCredentials not true"
        )
        req = xhr({
            withCredentials: true
        }, function () {})
        assert.ok(
            req.withCredentials,
            "withCredentials set to true"
        )
    } else {
        assert.ok(
            true,
            "no point testing withCredentials in IE8/9"
        )
    }
    assert.end()
})

test("XDR usage (run on IE8 or 9)", function (assert) {
    var req = xhr({
        useXDR: true,
        uri: window.location.href,
    }, function () {})

    assert.ok(!window.XDomainRequest || window.XDomainRequest === req.constructor,
        "Uses XDR when told to"
    )


    if (!!window.XDomainRequest) {
        assert.throws(function () {
            xhr({
                useXDR: true,
                uri: window.location.href,
                headers: {
                    "foo": "bar"
                }
            }, function () {})
        }, true, "Throws when trying to send headers with XDR")
    }
    assert.end()
})

test("handles errorFunc call with no arguments provided", function (assert) {
    var req = xhr({}, function (err) {
        assert.ok(err instanceof Error, "callback should get an error")
        assert.equal(err.message, "unknown", "error message should say 'unknown'")
    })
    assert.doesNotThrow(function () {
        req.onerror()
    }, "should not throw when error handler called without arguments")
    assert.end()

})

test("constructs and calls callback without throwing", function (assert) {
    assert.throws(function () {
        xhr({})
    }, "callback is not optional")
    assert.end()
})