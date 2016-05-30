'use strict';
let App = require(__dirname+'/../../components/App');
let Utils = App.Utils();

/**
 * Clase usuario
 */
class User {

  constructor(){
    this.collection = 'users';
    this.schema = {
      _id : 'S',
      username : 'S',
      email : 'S',
      password : 'S',
      wishlists : 'M',
      followers : 'M',
      followings : 'M',
      requiredFields : ['username', 'email', 'password']
    };
  }

  create(req,values){
    console.log(values);
    return new Promise((resolve,reject)=>{
      try{
        Utils.valSchema(values,this.schema);
      }catch(e){
        return reject({ msg : e , code : 412 });
      }
      App.log().info(req,'MongoDB: creando usuario con valores '+JSON.stringify(values));
      App.DB().mongoDb().collection(this.collection).insert(values,(err)=> {
            return (err) ? reject(err) : resolve(values);
      });
    });
  }
}

module.exports = User;
