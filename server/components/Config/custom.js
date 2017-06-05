'use strict';
module.exports = {
  env : 'dev', // dev, pre y pro
  threads: 4,
  log : {
    requests : __dirname+'/../../../log/req.log',
    errors : __dirname+'/../../../log/err.log',
    info : __dirname+'/../../../log/info.log',
    cloudWatch : {
      system : 'id:123456'
    }
  },
  app : {
    port : 9090,
    ip : '0.0.0.0'
  },
  mongo : {
    path : 'localhost',
    port : 27017,
    db : 'suggeat'
  }
};
