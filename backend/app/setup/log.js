var bunyan = require('bunyan');


module.exports = {
  restLogger : bunyan.createLogger({name: 'restLogger'}),
  appLogger : bunyan.createLogger({name: 'appLogger'})
}
