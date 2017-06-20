'use strict';

let uniqidfn = require('uniqid');
let bcrypt = require('bcrypt-nodejs');
let App = require(__dirname + '/../App');
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
  static uniqid() {
    return uniqidfn();
  }

  /**
   * Valida un esquema de datos
   * @param values
   * @param schema
   */
  static valSchema(values, schema, update) {
    for (let attr in values) {
      let val = values[attr];
      if (attr === '_id') continue;
      if (!schema[attr]) throw "Attribute not valid " + attr + ":" + JSON.stringify(values);
      switch (schema[attr]) {
        case 'S':
          if (typeof val !== 'string') throw "Type Attr (string) error " + attr;
          break;
        case 'L':
          if (!Array.isArray(val)) throw "Type Attr (List: string comma sep.) error " + attr;
          break;
        case 'N':
          if (isNaN(val)) throw "Type Attr (Number) error " + attr;
          break;
        case 'M':
          if (typeof val !== 'object') throw "Type Attr (Object) error " + attr;
          break;
        case 'B':
          if (typeof val !== 'boolean') throw "Type Attr (boolean) error " + attr;
          break;
        case 'U':
          break;
      }
    }
    if (schema.requiredFields && !update) {
      for (let i = 0; i < schema.requiredFields.length; i++) {
        if (!values[schema.requiredFields[i]]) {
          throw schema.requiredFields[i] + " is required";
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
  static replace(str, mapObj) {
    for (let search in mapObj) {
      str = str.split(search);
      str = str.join(mapObj[search]);
    }
    return str;
  }

  /**
   * Borra un parámetro get de una url
   * @param url
   * @param parameter
   * @return {*}
   */
  static removeURLParameter(url, parameter) {
    let urlparts = url.split('?');
    if (urlparts.length >= 2) {
      let prefix = encodeURIComponent(parameter) + '=';
      let pars = urlparts[1].split(/[&;]/g);

      for (let i = pars.length; i-- > 0;) {
        if (pars[i].lastIndexOf(prefix, 0) !== -1) {
          pars.splice(i, 1);
        }
      }

      url = urlparts[0] + '?' + pars.join('&');
      return url;
    } else {
      return url;
    }
  }

  /**
   * Añade a la app el log de apache
   * @param webApp
   */
  static setMorgan(webApp) {
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
    webApp.use(morgan(type, {stream: accessLogStream}));
  }

  /**
   * Middleware que intercepta TODAS Las peticiones a la API inicialmente
   * @param app
   */
  static setMiddleware(app) {
    app.use((req, res, next) => {
      if (req.path !== '/status') {
        let config = App.Config();
        let ip;
        try {
          ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        } catch (e) {
          ip = "nodejs system";
        }
        req.utils = {
          from: req.headers.from,
          ip: ip,
          uid: req.headers.uid || Utils.uniqid()
        };

        console.log(`Req ${req.utils.uid} : ${req.method} ${req.path}`);

        if (!req.utils.from) return res.status(401).send("From header are required");
        App.Auth().isAuth(req, res, function () {
          return next();
        });

      }
      else {
        return next();
      }
    });
  }

  /**
   * Respuesta genérica de la API
   * @param req
   * @param res
   * @param code
   * @param data
   * @return {*}
   */
  static response(req, res, code, data) {
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
  static error(req, res, err, code) {
    if (!err && (code === 401)) {
      err = 'Auth error';
    }
    if (!_.isObject(err)) {
      err = {
        msg: err,
        code: code || 500
      };
    } else {
      if (!err.msg) {
        err = {
          code: isNaN(err.code) ? 500 : err.code,
          msg: err.toString() || JSON.stringify(err)
        }
      }
    }
    App.log().error(req, err);
    return res.status(err.code).send({
      code: err.code,
      msg: err.msg
    });
  }

  static b64encode(s){
    return new Buffer(s).toString('base64');
  }

  static b64decode(s){
    return new Buffer(s, 'base64').toString();
  }

}

module.exports = Utils;
