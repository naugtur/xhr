var xhr = require('../')
var test = require('tape')

test('constructs and calls callback without throwing', function(t) {
  t.plan(1)
  xhr({}, function (err, resp, body) {
    t.ok(true, 'got here')
  })
})

test('can GET current page', function(t) {
  t.plan(1)
  xhr({
    headers: {accept: "text/html"},
    uri: window.location.href,
  }, function (err, resp, body) {
    t.false(err, 'no err')
  })
})

