//Require dependencies
const Morgan = require('morgan') // Terminal logging
const Express = require('express') // Terminal logging

//Initilaziation
const app = Express()

//Middlewares
app.use(Morgan('dev'))
app.use(Express.json())

app.use(Express.static('public'))

//Listen for requests
const port = 4000
app.listen(port, console.log('API => Listening on port %s', port))