'use strict';
let App = require(__dirname+'/../App');
let dynamoDbInstance = null;
let mongoDbInstance = null;

/**
 * Clase que administra las distintas bases de datos de la aplicación.
 * Devuelve siempre la misma instancia
 */
class DB {

  dynamoDb(){
    if(dynamoDbInstance === null){
      let AWS = App.AWS();
      dynamoDbInstance = new AWS.DynamoDB.DocumentClient();
    }
    return dynamoDbInstance;
  }

  mongoDb(){
    if(!mongoDbInstance){
      console.error('DB no iniciada');
      process.exit(1);
    }
    return mongoDbInstance;
  }

  mongoConnect(){
    return new Promise((resolve,reject)=>{
      let config = App.Config();
      let MongoClient =   require('mongodb').MongoClient;
      let path = (config.mongo.user && config.mongo.password)
        ?'mongodb://'+config.mongo.user+':'+config.mongo.password+'@'+config.mongo.path+':'+config.mongo.port+'/'+config.mongo.db
        :'mongodb://'+config.mongo.path+':'+config.mongo.port+'/'+config.mongo.db;
      MongoClient.connect(path, function(err, db) {
        if(err){
          return reject(err);
        }else{
          mongoDbInstance=db;
          return resolve(db);
        }
      });
    });
  }
}

module.exports = (function(){
  return DB;
})();
