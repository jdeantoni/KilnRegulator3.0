const swaggerRoutes = require('swagger-routes')
const express = require('express')
const app = express()

swaggerRoutes(app, {
    api: '../doc/swagger.yaml',
    handlers:  {
    	path: './src/handlers',
	group: true
	},
    authorizers: './src/handlers/security'
})
app.listen(8080)
