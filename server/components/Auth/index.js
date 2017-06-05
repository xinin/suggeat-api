'use strict';
const App = require(__dirname+'/../App');

class Auth {


  static isAuth(req,res,next){
    // let appKey = req.query.appKey || false;
    // let appId = req.query.appId || false;
    const config = App.Config();
    const Utils = App.Utils();
    // if(!appKey || !appId){//TODO esto esta quitado hasta que el api sea privada
    //   //return Utils.error(r/eq,res,'Invalid credentials',401); //TODO HACER ESTA PARTE
    // }
    // if(config.clients[appId] === appKey) return next(); // TODO HACER ESSTO
    // next();
    // //return Auth.checkInDb(req,res,next,appId,appKey);



    next();
  }



}

module.exports = Auth;
