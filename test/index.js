var window = require("global/window")
var test = require("tape")

var xhr = require("../index.js")

test("constructs and calls callback without throwing", function(assert) {
    xhr({}, function (err, resp, body) {
        assert.ok(true, "got here")
        assert.end()
    })
})

test("can GET current page", function(assert) {
    xhr({
        headers: {accept: "text/html"},
        uri: window.location.href,
    }, function (err, resp, body) {
        assert.ifError(err, "no err")
        assert.end()
    })
})

test("withCredentials option", function(assert) {
    var req = xhr({}, function () {})
    assert.ok(
        !req.withCredentials,
        "withCredentials not set when not set in options"
    )
    req = xhr({
        withCredentials: true
    }, function () {})
    assert.ok(
        req.withCredentials,
        "withCredentials set to true when true in options"
    )
    assert.end()
})
