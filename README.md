# xhr

A small xhr wrapper

## Example

    var xhr = require("xhr")

    xhr({
        method: "GET",
        data: someJSON,
        uri: "/foo",
        headers: {
            "Content-Type": "application/json"
        }
    }, function (err, result) {
        // this === xhr
    })

## MIT Licenced