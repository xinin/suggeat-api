'use strict';
module.exports = {
  env : 'dev', // dev, pre y pro
  clients : { // clientes autorizados a usar la api (que no sean proyectos en aws)
    'ihfwywb8' : '$2a$10$deLg3nPbHEkMvF69WPPLvuStB5gAJ3q2GXUE1cJYAmIriEaiZXtDu', // Portal
    's75ng82g': '9fcd2ec79330cae9564c5efbd8619f22438dc18b3d202f2fa42de23784524318' //Compponents
  },
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
  apiComponents : {
    url : 'http://localhost:9090',
    params : {
      appId : '576e12e7',
      appKey : '405c54ee1cddeaab73b7d203841be2ab24f81f95faff890dd8e1484484e39cb4a0eba8a7a86cf13c85e3b87f117e2e03'
    }
  },
  mongo : {
    path : 'localhost',
    port : 27017,
    db : 'wishlist'
  }
};
