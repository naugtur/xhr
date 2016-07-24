module.exports = function (req, res) {
    console.log('mock:',req.url)
    if (req.url === '/mock/200ok') {
        res.statusCode = 200
        res.end('')
    } else if (req.url === '/mock/200json-empty') {
        res.statusCode = 200
        res.setHeader('content-type','application/json')
        res.end()
    } else if (req.url === '/mock/200json-false') {
        res.statusCode = 200
        res.setHeader('content-type','application/json')
        res.end('false')
    } else if (req.url === '/mock/200xml-empty') {
        res.statusCode = 200
        res.setHeader('content-type','application/xml')
        res.end('<?xml version="1.0" ?>')
    } else if (req.url === '/mock/200xml') {
        res.statusCode = 200
        res.setHeader('content-type','application/xml')
        res.end('<?xml version="1.0" ?><x>x</x>')
    } else if (req.url === '/mock/no-content') {
        res.statusCode = 204
        res.end()
    } else if (req.url === '/mock/timeout') {
        setTimeout(function() {
            res.statusCode = 200
            res.end()
        }, 100)
    }
}
