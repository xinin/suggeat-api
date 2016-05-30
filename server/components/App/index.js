'use strict';

let config;
let auth;
let users;
let utils;
let db;
let log;

/**
 * Clase que gestiona la APP y todas sus dependencias
 */
class App {
  static Config(){
    if(!config) config = require(__dirname+'/../Config');
    return config;
  }

  static Auth(){
    if(!auth) auth = require(__dirname+'/../Auth');
    return auth;
  }

  static Utils(){
    if(!utils) utils = require(__dirname+'/../Utils');
    return utils;
  }

  static DB(){
    if(!db) db = require(__dirname+'/../DB');
    return new db();
  }

   /**
   * Carga un modelo de mongo
   * @param model
   * @return {*|Object}
   */
  static getModel(model){
    let md = require(__dirname+'/../Models/'+model);
    return new md();
  }

 static log(){
    if(!log) log = require(__dirname+'/../Log');
    return new log();
  }

  /**
   * Lanza una aplicación
   * @return {*|Object}
   */
  static launch(){
    return require(__dirname+'/servers');
  }
}

module.exports = App;
