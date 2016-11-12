module.exports = function (req, res) {
    console.log('mock:',req.url)
    if (req.url === '/mock/200ok') {
        res.statusCode = 200
        res.end('')
    } else if (req.url === '/mock/no-content') {
        res.statusCode = 204
        res.end('')
    } else if (req.url === '/mock/echo') {
        var body = []
        req.on('data', function(chunk) {
            body.push(chunk)
        })
        req.on('end', function() {
            res.statusCode = 200
            res.end(Buffer.concat(body).toString())
        })
    } else if (req.url === '/mock/timeout') {
        setTimeout(function() {
            res.statusCode = 200
            res.end()
        }, 100)
    } 
}
