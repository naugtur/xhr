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
        "withCredentials not true when nothing set in options"
    )
    req = xhr({
        cors: true
    }, function () {})
    assert.ok(
        req.withCredentials,
        "withCredentials set to true when cors is true in options"
    )
    req = xhr({
        cors: true,
        withCredentials: false
    }, function () {})
    assert.ok(
        !req.withCredentials,
        "withCredentials set to false when set to false in options"
    )
    assert.end()
})
