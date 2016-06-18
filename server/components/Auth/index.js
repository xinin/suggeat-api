'use strict';
var App = require(__dirname+'/../App');

class Auth {


  static isAuth(req,res,next){
    let appKey = req.query.appKey || false;
    let appId = req.query.appId || false;
    let config = App.Config();
    let Utils = App.Utils();
    if(!appKey || !appId){
      //return Utils.error(r/eq,res,'Invalid credentials',401); //TODO HACER ESTA PARTE
    }
    if(config.clients[appId] === appKey) return next(); // TODO HACER ESSTO
    next();
    //return Auth.checkInDb(req,res,next,appId,appKey);
  }

  static checkInDb(req,res,next,appId,appKey){
    let Utils = App.Utils();
    let Project = App.getModel('Project');
    Project.checkCredentials(req,appId,appKey).then(
      isOk => (isOk)?next():Utils.error(req,res,'Invalid credentials',401),
      () => Utils.error(req,res,'Error check projects in DB',500)
    );
  }





}

module.exports = Auth;
