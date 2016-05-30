'use strict';

let express = require('express');
let compression = require('compression');
let bodyParser = require('body-parser');
let methodOverride = require('method-override');
let cookieParser = require('cookie-parser');
let helmet = require('helmet');
let App = require(__dirname+'/index');
let Utils = App.Utils();
let config = App.Config();
let setup = require(__dirname+'/setup');
let cluster = require('cluster');
let numCPUs = require('os').cpus().length;

// Creamos app de express
var app = express();
app.use(helmet.hidePoweredBy({ setTo: 'PHP 5.2.0' }));  // hidePoweredBy to remove the X-Powered-By header
app.use(helmet.hsts({ maxAge: 7776000000 }));           // hsts for HTTP Strict Transport Security
app.use(helmet.ieNoOpen());                             // ieNoOpen sets X-Download-Options for IE8+
app.use(helmet.noCache());                              // noCache to disable client-side caching
app.use(helmet.noSniff());                              // noSniff to keep clients from sniffing the MIME type
app.use(helmet.frameguard());                           // frameguard to prevent clickjacking
app.use(helmet.xssFilter());                            // xssFilter adds some small XSS protections
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());
Utils.setMorgan(app);
Utils.setMiddleware(app);
setup.once('success',() => {
  // Multihilo
  if (!config.test.start && cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    } else {

    try {
      require(__dirname+'/routes')(app);
      let server = require('http').createServer(app);
      server.listen(config.app.port, config.app.ip, () => {
        App.log().info(false,'API Webs Públicas server listening on port '+config.app.port+', env '+app.get('env'));
      });
    } catch (err) {
      App.log().error(false,{ msg : 'Error arrancando servidor: '+err.stack, code : 500, alert : 'system' });
      process.exit(1);
    }
  }
}).on('error',(err) => {
  App.log().error(false, { msg : 'Error en el setup del servidor: '+JSON.stringify(err), code : 500 , alert : 'system' });
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  App.log().error(false, { msg : 'Excepción en el servidor: '+JSON.stringify(err), code : 500 , alert : 'system' });
});

// Expose app
module.exports = app;
