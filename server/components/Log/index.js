'use strict';

let App = require(__dirname+'/../App');
let logger;

/**
 * Clase Utils con utilidades comunes
 */
class Log {
  constructor(){
    if(!logger){
      this.initLog();
    }
  }

  info (req,message) {
    let msg = this.getLogObj(req);
    let Config = App.Config();
    if(Config.env==='dev'){
      console.log(msg,message);
    }
    logger.info.error(msg,message);
  }

  error(req,errorObj){
    let msg = this.getLogObj(req);
    let txt = '';
    try {
      msg.code = errorObj.code || 500;
      txt = errorObj.msg;
    } catch (e) {
      msg = {};
      msg.code = 500;
      txt = JSON.stringify(errorObj);
    }
    let Config = App.Config();
    if(msg.alert || (Config.env === 'dev')){
      console.log(msg,txt);
    }
    logger.error.error(msg,txt);
  }

  getLogObj (req) {
    let size = 1;
    if(req && req.body){
      try {
        size = JSON.stringify(req.body).length;
      }catch(e){
        size = 1;
      }
    }
    if(!req) return {};
    let msg;
    try{
      msg = {
        from : req.utils.from,
        uid : req.utils.uid,
        body : (size>1000)?'too large':req.body
      };
      if(req.originalUrl) msg.url = req.originalUrl;
      if(req.utils.ip) msg.ip = req.utils.ip;
    }catch(e){
      msg = {};
    }
    return msg;
  }

  initLog(){
    let bunyan = require('bunyan');
    let config = App.Config();
    logger = {
      info : bunyan.createLogger({
        name: 'webs-publicas-info',
        streams: [
          {
            level: 'error',
            path: config.log.info
          }
        ]
      }),
      error : bunyan.createLogger({
        name: 'webs-publicas-error',
        streams: [
          {
            level: 'error',
            path: config.log.errors
          }
        ]
      })
    };
  }
}

module.exports = Log;
