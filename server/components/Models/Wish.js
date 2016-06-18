'use strict';
let App = require(__dirname+'/../../components/App');
let Utils = App.Utils();

/**
 * Clase usuario
 */
class Wish {
  constructor(){
    this.collection = 'wishes';
    this.schema = {
      _id : 'S',
      name : 'S',
      description : 'S',
      link : 'S',
      image : 'S',
      date : 'S',
      requiredFields : ['name']
    };
  }

  create(req,values){
    return new Promise((resolve,reject)=>{
      try{
        Utils.valSchema(values,this.schema);
      }catch(e){
        return reject({ msg : e , code : 412 });
      }
      values._id= Date.now();
      App.log().info(req,'MongoDB: creando wish con valores '+JSON.stringify(values));
      App.DB().mongoDb().collection(this.collection).insert(values,(err)=> {
        return (err) ? reject(err) : resolve(values._id);
      });
    });
  }

  getById(req, userId, projection) {
    projection = projection || {_id: 1, name: 1, description: 1, link: 1, image: 1, date: 1};
    return new Promise((resolve, reject) => {
      App.log().info(req, 'MongoDB: obteniendo usuario' + JSON.stringify(userId));
      App.DB().mongoDb().collection(this.collection).findOne({_id: userId}, projection, (err, item)=> {
        return (err || !item) ? reject(err || {msg: 'Non existent wish ', code: 404}) : resolve(item);
      });
    });
  }

}

module.exports = Wish;
