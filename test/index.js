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

test("can GET current page with response option = true", function(assert) {
    xhr({
        headers: {accept: "text/html"},
        uri: window.location.href,
        response: true
    }, function (err, resp, body) {
        assert.ifError(err, "no err")
        assert.equal(resp.statusCode, 200)
        assert.equal(resp.statusText, 'OK')
        assert.equal(resp.headers['content-type'], 'text/html')
        assert.notEqual(resp.body.length, 0)
        assert.notEqual(body.length, 0)
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

test("XDR usage (run on IE8 or 9)", function(assert) {
    var req = xhr({
        useXDR: true,
        response:true,
        uri: window.location.href,
    }, function () {})
    
    assert.ok(
        !window.XDomainRequest || window.XDomainRequest === req.constructor,
        "Uses XDR when told to"
    )
    
    req = xhr({
        cors: true,
        uri: window.location.href,
    }, function () {})
    
    assert.ok(
        !window.XDomainRequest || window.XDomainRequest === req.constructor,
        "Uses XDR with deprecated option cors"
    )
    
    assert.end()
})
