/*
* A script taht configures variables shared across the app
*/

var path = require('path')

var root = path.join(__dirname, '..')

var config = module.exports = {}

config.port = process.env.ENV === 'development' ? 8000 : 80
config.LOCAL_URL = 'http://localhost:' + config.port
config.tmpDir = '/tmp'
config.configDir = __dirname
config.publicDir = path.join(root, './public')
config.viewsDir = path.join(config.publicDir, 'views')
config.appsDir = path.join(root, './.sandbox')
