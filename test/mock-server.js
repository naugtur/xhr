module.exports = function (req, res) {
    if (req.url === '/mock/no-content') {
        res.statusCode = 204
        res.end('')
    } else if (req.url === '/mock/timeout') {
        setTimeout(function() {
            res.statusCode = 200
            res.end()
        }, 100)
    }
}
