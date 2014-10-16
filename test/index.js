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
        uri: window.location.href
    }, function (err, resp, body) {
        assert.ifError(err, "no err")
        assert.equal(resp.statusCode, 200)
        assert.equal(typeof resp.res, "object")
        assert.equal(resp.headers['content-type'].indexOf('text/html'), 0) //can be 'text/html; charset=UTF-8' in IE8 particularly
        assert.notEqual(resp.body.length, 0)
        assert.notEqual(body.length, 0)
        assert.end()
    })
})

test("Returns http error responses like npm's request", function(assert) {
    xhr({
        headers: {accept: "text/html"},
        uri: window.location.href+"theonethatdoesntexist"
    }, function (err, resp, body) {
        assert.ifError(err, "no err")
        assert.equal(resp.statusCode, 404)
        assert.equal(typeof resp.res, "object")
        assert.end()
    })
})

test("Returns http errors as errors when an option is set", function(assert) {
    xhr({
        headers: {accept: "text/html"},
        httpErrors:true,
        uri: window.location.href+"theonethatdoesntexist"
    }, function (err, resp, body) {
        assert.equal(err.message, "Error 404")
        assert.equal(resp.statusCode, 404)
        assert.equal(typeof resp.res, "object")
        assert.end()
    })
})

test("withCredentials option", function(assert) {
    if(!window.XDomainRequest){
        var req = xhr({}, function () {})
        assert.ok(
            !req.withCredentials,
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

test("XDR usage (run on IE8 or 9)", function(assert) {
    var req = xhr({
        useXDR: true,
        uri: window.location.href,
    }, function () {})
    
    assert.ok(
        !window.XDomainRequest || window.XDomainRequest === req.constructor,
        "Uses XDR when told to"
    )
    
    
    if(!!window.XDomainRequest){
        assert.throws(function(){
            xhr({
                useXDR: true,
                uri: window.location.href,
                headers:{"foo":"bar"}
            }, function () {})
        },true,"Throws when trying to send headers with XDR")
    }
    assert.end()
})
