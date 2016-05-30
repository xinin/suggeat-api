'use strict';

let uniqidfn = require('uniqid');
let bcrypt = require('bcrypt-nodejs');
let App = require(__dirname+'/../App');
let bunyan = require('bunyan');
let _ = require('lodash');

/**
 * Clase Utils con utilidades comunes
 */
class Utils {
  /**
   * Genera un uniqid
   * @return {*}
   */
  static uniqid(){
    return uniqidfn();
  }

  /**
   * Genera un hash
   * @param ftp
   * @return {string}
   */
  static hash(ftp){
    return (ftp)?Math.random().toString(36).slice(-8):bcrypt.hashSync(Utils.uniqid(), bcrypt.genSaltSync(1));
  }

  /**
   * Valida un esquema de datos
   * @param values
   * @param schema
   */
  static valSchema(values,schema,update){
    for(let attr in values){
      let val = values[attr];
      if(attr === '_id') continue;
      if(!schema[attr]) throw "Attribute not valid "+attr+":"+JSON.stringify(values);
      switch(schema[attr]){
        case 'S':
          if(typeof val !== 'string') throw "Type Attr (string) error "+attr;
          break;
        case 'L':
          if(!Array.isArray(val)) throw "Type Attr (List: string comma sep.) error "+attr;
          break;
        case 'N':
          if(isNaN(val)) throw "Type Attr (Number) error "+attr;
          break;
        case 'M':
          if(typeof val !== 'object') throw "Type Attr (Object) error "+attr;
          break;
        case 'B':
          if(typeof val !== 'boolean') throw "Type Attr (boolean) error "+attr;
          break;
        case 'U':
          break;
      }
    }
    if(schema.requiredFields && !update){
      for(let i=0;i<schema.requiredFields.length;i++){
        if(!values[schema.requiredFields[i]]){
          throw schema.requiredFields[i]+" is required";
        }
      }
    }
  }

  /**
   * Str replace múltiple
   * @param str
   * @param mapObj
   * @return {*}
   */
  static replace(str,mapObj){
    for(let search in mapObj){
      str = str.split(search);
      str = str.join(mapObj[search]);
    }
    return str;
  }

  /**
   * Limpia de posibles variables un string ($)
   * @param str
   * @return {*}
   */
  static cleanJenkins(str){
    return Utils.replace(str,{'$' : parseInt(Math.random()*10)});
  }

  /**
   * Borra un parámetro get de una url
   * @param url
   * @param parameter
   * @return {*}
   */
  static removeURLParameter(url, parameter) {
    let urlparts= url.split('?');
    if (urlparts.length>=2) {
      let prefix= encodeURIComponent(parameter)+'=';
      let pars= urlparts[1].split(/[&;]/g);

      for (let i= pars.length; i-- > 0;) {
        if (pars[i].lastIndexOf(prefix, 0) !== -1) {
          pars.splice(i, 1);
        }
      }

      url= urlparts[0]+'?'+pars.join('&');
      return url;
    } else {
      return url;
    }
  }

  /**
   * Añade a la app el log de apache
   * @param webApp
   */
  static setMorgan(webApp){
    let morgan = require('morgan');
    let fs = require('fs');
    let config = App.Config();
    let accessLogStream = fs.createWriteStream(config.log.requests, {flags: 'a'});
    morgan.token('uid', function (req) {
      return req.utils.uid
    });
    morgan.token('from', function (req) {
      return req.utils.from
    });
    morgan.token('ip', function (req) {
      return req.utils.ip
    });
    let type = ':uid - :ip - :from - [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';
    webApp.use(morgan(type,{stream: accessLogStream}));
  }

  /**
   * Middleware que intercepta TODAS Las peticiones a la API inicialmente
   * @param app
   */
  static setMiddleware(app){
    app.use((req,res,next) => {
      if(req.path !== '/status') {
        let config = App.Config();
        let ip;
        try{
          ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        }catch(e){
          ip = "nodejs system";
        }
        req.utils = {
          from : req.headers.from,
          ip : ip,
          uid : req.headers.uid || Utils.uniqid()
        };

        if(!config.test.start) {
          if (!req.utils.from) return res.status(401).send("From header are required");
          App.Auth().isAuth(req, res, function () {
            return next();
          });
        }
      }
      else{
        return next();
      }
    });
  }

  /**
   * Devuelve un timestamp casero con todas las cifras
   * @param milisec
   * @return {string}
   */
  static getDate(milisec){
    let date = new Date();
    let hour = date.getHours();
    if(hour<10) hour = "0"+hour;
    let min = date.getMinutes();
    if(min<10) min = "0"+min;
    let seg = date.getSeconds();
    if(seg<10) seg = "0"+seg;
    let month = date.getMonth()+1;
    if(month<10) month = "0"+month;
    let day = date.getUTCDate();
    if(day<10) day = "0"+day;
    let mil = date.getMilliseconds();
    if(mil<10){
      mil = "00"+mil;
    }else if(mil<100){
      mil = "0"+mil;
    }
    let basic = ""+date.getFullYear()+month+day+hour+min+seg;
    return (milisec)?basic+mil:basic;
  }

  static cleanUrl(url,preserveWww) {
    url = url.replace('http://', '');
    url = url.replace('https://', '');
    if(!preserveWww && url.startsWith('www.')){
      url = url.substr(4,url.length-4);
    }
    url = url.split('?')[0];
    url = url.split('/')[0];
    return url.trim();
  }

  /**
   * Respuesta genérica de la API
   * @param req
   * @param res
   * @param code
   * @param data
   * @return {*}
   */
  static response(req,res,code,data){
    return res.status(code).json({
      code,
      data
    });
  }


  /**
   * Error genérico de la api
   * @param req
   * @param res
   * @param err
   * @param code
   * @return {*}
   */
  static error(req,res,err,code){
    if(!err && (code === 401)){
      err = 'Auth error';
    }
    if(!_.isObject(err)){
      err = {
        msg : err,
        code : code || 500
      };
    }else{
      if(!err.msg){
        err = {
          code : isNaN(err.code)?500:err.code,
          msg : err.toString() || JSON.stringify(err)
        }
      }
    }
    App.log().error(req, err);
    return res.status(err.code).send({
      code : err.code,
      msg : err.msg
    });
  }

  static objetcSize( object ) {

    var objectList = [];
    var stack = [ object ];
    var bytes = 0;

    while ( stack.length ) {
      var value = stack.pop();

      if ( typeof value === 'boolean' ) {
        bytes += 4;
      }
      else if ( typeof value === 'string' ) {
        bytes += value.length * 2;
      }
      else if ( typeof value === 'number' ) {
        bytes += 8;
      }
      else if
      (
        typeof value === 'object'
        && objectList.indexOf( value ) === -1
      )
      {
        objectList.push( value );

        for( var i in value ) {
          stack.push( value[ i ] );
        }
      }
    }
    return bytes;
  }
}

module.exports = Utils;
