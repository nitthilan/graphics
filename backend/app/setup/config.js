var mongoose = require('mongoose');
module.exports = {
  development:{
    root:require('path').normalize(__dirname + '/..')+"/",
    static_path:require('path').normalize(__dirname + '/../../../frontend/app')+"/",
    host:'localhost',
    port:'3000',
    version:'0.0.0',
    db_prefix: 'mongodb',
    db_port: '27017',
    db_name:'development',
    rest_logs:true,
    cookieSetting : {
      cookieName: 'session',    // defaults to session_state
      secret: (new mongoose.Types.ObjectId()).toString(),
      // true session duration:
      // will expire after duration (ms)
      // from last session.reset() or
      // initial cookieing.
      duration: 24 * 60 * 60 * 1000, // defaults to 1 day
    },

  },
  test:{
    db_name: 'test',
  },
  production:{
  }
}
