var http = require('http')
var runBrowser = require('run-browser')

var phantom = process.argv[2] === 'phantom'
var port = 3000

var handler = runBrowser.createHandler('test/index.js', null, phantom)
var server = http.createServer(function (req, res) {
    if (req.url === '/no-content') {
        res.statusCode = 204
        res.end('')
    } else if (req.url === '/timeout') {
        setTimeout(function() {
            res.statusCode = 200
            res.end()
        }, 5000)
    } else {
        return handler(req, res, phantom)
    }
})
server.listen(port)

if (phantom) {
    var proc = runBrowser.runPhantom('http://localhost:' + port+ '/')
    proc.stdout.pipe(process.stdout)
    proc.stderr.pipe(process.stderr)
} else {
    console.log('Open a browser and navigate to "http://localhost:' + port+ '"')
}
