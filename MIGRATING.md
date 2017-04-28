# Migrating from v2 to v3

## JSON body
If you used the `json` option to pass request body, now you need to set `body` to the object you want to send, and `json: true`

## Old IEs
If you need to support IE8 or IE9, stay on v2.
